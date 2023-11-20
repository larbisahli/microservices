import { MongoDBConfig } from '@config';
import { Service, Container } from 'typedi';
import Keyv from 'keyv';

@Service()
export class MongoStore extends Keyv {
  constructor(options: { namespace: string }) {
    super(MongoDBConfig.url, options);
  }
}

export default Container.get(MongoStore);
