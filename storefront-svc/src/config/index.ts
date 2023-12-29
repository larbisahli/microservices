import dotenv from 'dotenv';

dotenv.config();

// Mapper for environment variables

const {
  POSTGRES_READ_USER,
  POSTGRES_READ_USER_PASSWORD,
  POSTGRES_ENDPOINT,
  POSTGRES_ENDPOINT_DEV,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_DEV,
  MONGODB_USERNAME,
  MONGODB_CLUSTER_URL,
  MONGODB_PASSWORD,
  NODE_ENV,
} = process.env;

export const PRODUCTION_ENV = NODE_ENV === 'development';

const endPoint = !PRODUCTION_ENV ? POSTGRES_ENDPOINT : POSTGRES_ENDPOINT_DEV;
const database = !PRODUCTION_ENV ? POSTGRES_DB : POSTGRES_DB_DEV;
const postgresPort = Number(POSTGRES_PORT);

export const ReadPoolConfig = {
  host: endPoint,
  port: postgresPort,
  database,
  user: POSTGRES_READ_USER,
  password: POSTGRES_READ_USER_PASSWORD,
  max: 20,
};

export const MongoDBConfig = {
  url: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/?retryWrites=true&w=majority`,
  admin_url: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/internal?retryWrites=true&w=majority`,
  store_db: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/store-cache?retryWrites=true&w=majority`,
};

export const RPCPort = '0.0.0.0:50051';
