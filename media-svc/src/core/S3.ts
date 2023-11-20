import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';

dotenv.config();

// Set S3 endpoint
const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
});

export default s3;
