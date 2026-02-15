import { Router } from 'express';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3 } from '../config/s3';

const s3 = getS3();

const router = Router();

router.get('/s3-test', async (_req, res) => {
  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: 'childrens_mental_disorders',
      }),
      { expiresIn: 300 }
    );

    res.json({ url });
  } catch (err) {
    console.error('S3 test failed:', err);
    res.status(500).json({ error: 'S3 test failed' });
  }
});

router.post('/s3-presign', async (req, res) => {
  try {
    const { imageKey, contentType } = req.body;
    if (!imageKey) return res.status(400).json({ error: 'imageKey required' });

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: imageKey,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });
    

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
    res.json({ url, imageKey });
  } catch (err) {
    console.error('Failed to create presigned URL', err);
    res.status(500).json({ error: 'Failed to create presigned URL' });
  }
});

export default router;