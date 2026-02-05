import { S3Client } from '@aws-sdk/client-s3';

let s3: S3Client | null = null;

export function getS3() {
  if (s3) return s3;

  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials missing');
  }

  s3 = new S3Client({
    region: AWS_REGION || 'us-east-1',
  });

  return s3;
}
