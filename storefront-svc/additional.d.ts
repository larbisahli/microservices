declare module 'express-session' {
  interface SessionData {
    cart: {
      productId: string;
      quantity: number;
    }[];
  }
}
