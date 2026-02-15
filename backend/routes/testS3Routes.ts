import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3 } from '../config/s3';

const router = Router();
const s3 = getS3();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 🔥 Optimize image before upload
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200 })        // limit width
      .webp({ quality: 80 })          // compress + convert
      .toBuffer();

    const key = `resources/${Date.now()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    res.json({ key });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
