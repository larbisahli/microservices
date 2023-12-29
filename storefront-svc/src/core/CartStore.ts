import { Service, Container } from 'typedi';
import Keyv from 'keyv';
import { MongoDBConfig } from '@config';
import CartPackage from '@cache/packages/cart.package';

@Service()
export class CartStore extends Keyv {
  constructor() {
    super(MongoDBConfig.store_db, {
      namespace: 'carts',
      collection: 'carts',
      // serialize: CartPackage.encodeCart,
      // deserialize: CartPackage.decodeCart
    });
  }

  serialize = () => {};

  setCart = async (cart: any) => {
    return await this.set('foo', 'expires in 1 second', 1000);
  };
}

export default Container.get(CartStore);
