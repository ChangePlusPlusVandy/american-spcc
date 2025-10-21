import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE');
    await prisma.$executeRawUnsafe('CREATE SCHEMA public');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.hostedRecources.deleteMany();
  await prisma.resource.deleteMany();
});

async function createTestResource(overrides = {}) {
  return await prisma.resource.create({
    data: {
      title: 'Test Resource',
      description: 'Test description',
      recourse_type: 'PDF',
      hosting_type: 'AWS',
      category_type: 'KIDS_EDUCATIONAL',
      age_range_min: 5,
      age_range_max: 10,
      time_to_read: 15,
      ...overrides,
    },
  });
}

async function createTestHostedResource(resourceId: number, overrides = {}) {
  return await prisma.hostedRecources.create({
    data: {
      id: resourceId,
      s3_key: BigInt(12345),
      ...overrides,
    },
  });
}

describe('Resource Model', () => {
  it('should create a resource', async () => {
    const resource = await createTestResource();
    expect(resource.title).toBe('Test Resource');
    expect(resource.recourse_type).toBe('PDF');
  });

  it('should create a resource with overrides', async () => {
    const resource = await createTestResource({ title: 'Custom Title' });
    expect(resource.title).toBe('Custom Title');
  });
});

describe('HostedResource Model', () => {
  it('should create a hosted resource', async () => {
    const resource = await createTestResource();
    const hostedResource = await createTestHostedResource(resource.resouce_id);
    expect(hostedResource.id).toBe(resource.resouce_id);
    expect(hostedResource.s3_key).toBe(BigInt(12345));
  });
});
