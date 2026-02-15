import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// If your embedding model uses 1536 dims, keep vector(1536) in Postgres.
// If you change models later and dims differ, you must change the DB column dimension.
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

function buildEmbeddingText(r: any) {
  const labelNames: string[] = (r.labels || [])
    .map((x: any) => x.label?.label_name)
    .filter(Boolean)
    .sort();

  const ageGroups: string[] = (r.age_groups || []).slice().sort();

  const externalUrl = r.externalResources?.external_url ?? "";

  // Canonical, stable serialization (keep field names/order consistent)
  return [
    `Title: ${r.title}`,
    `Description: ${r.description ?? ""}`,
    `Category: ${r.category}`,
    `ResourceType: ${r.resource_type}`,
    `HostingType: ${r.hosting_type}`,
    `Language: ${r.language}`,
    `AgeGroups: ${ageGroups.join(", ")}`,
    `TimeToReadMinutes: ${r.time_to_read}`,
    `Labels: ${labelNames.join(", ")}`,
    `ExternalURL: ${externalUrl}`,
    `ImageS3Key: ${r.image_s3_key ?? ""}`,
  ].join("\n");
}

async function embed(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in env");
  }

  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`Embeddings API error ${resp.status}: ${msg}`);
  }

  const data: any = await resp.json();
  return data.data[0].embedding as number[];
}

function toVectorLiteral(vec: number[]) {
  // pgvector accepts: '[0.1,0.2,...]'
  return `[${vec.join(",")}]`;
}

async function main() {
  const resources = await prisma.resource.findMany({
    include: {
      labels: { include: { label: true } }, // ResourceLabel -> CategoryLabel
      externalResources: true,              // ExternalResources
    },
    orderBy: { updated_at: "asc" },
  });

  console.log(`Found ${resources.length} resources`);

  let processed = 0;

  for (const r of resources) {
    const embeddingText = buildEmbeddingText(r);
    const embedding = await embed(embeddingText);

    // Optional: log dims once
    if (processed === 0) console.log(`Embedding dims: ${embedding.length}`);

    const vectorLiteral = toVectorLiteral(embedding);

    // Upsert into public.resource_embeddings
    await prisma.$executeRaw`
      insert into public.resource_embeddings (resource_id, embedding, embedding_text, updated_at)
      values (${r.id}, ${vectorLiteral}::vector, ${embeddingText}, now())
      on conflict (resource_id)
      do update set
        embedding = excluded.embedding,
        embedding_text = excluded.embedding_text,
        updated_at = now();
    `;

    processed++;
    if (processed % 25 === 0) console.log(`Upserted ${processed}/${resources.length}`);
  }

  console.log("✅ Backfill complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
