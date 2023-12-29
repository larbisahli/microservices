import { MongoDBConfig } from '@config';
import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(MongoDBConfig.store_db);
}

main().catch((err) => console.log('Mongoose Error :>>>>>>', { err }));

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('🚀🚀 MongoDB database connection established successfully 🚀🚀');
});
