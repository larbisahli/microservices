import { Router } from 'express';
import PostgresClient from '@database';
import { Response, Request } from 'express';
import s3 from '@core/S3';

const router = Router();

export class Media extends PostgresClient {
  constructor() {
    super();
  }

  public getImage = async (req: Request, res: Response) => {
    const downloadParams = {
      Key: req.params[0],
      Bucket: process.env.AWS_BUCKET_NAME ?? '',
    };
    try {
      s3.getObject(downloadParams)
        .createReadStream()
        .on('error', (err) => {
          console.log('====<getImage-Error>', { downloadParams });
          return res.status(400).send();
        })
        .pipe(res);
    } catch (error) {
      console.log('err>', error);
    }
  };
}

const Media_ = new Media();

router.get('/*', Media_.getImage);

export default router;
