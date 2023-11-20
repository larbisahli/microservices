import dotenv from 'dotenv';

dotenv.config();

// Mapper for environment variables

const {
  POSTGRES_READ_USER,
  POSTGRES_CREATE_USER,
  POSTGRES_UPDATE_USER,
  POSTGRES_DELETE_USER,
  POSTGRES_CRUD_USER,
  POSTGRES_READ_USER_PASSWORD,
  POSTGRES_CREATE_USER_PASSWORD,
  POSTGRES_DELETE_USER_PASSWORD,
  POSTGRES_UPDATE_USER_PASSWORD,
  POSTGRES_CRUD_USER_PASSWORD,
  POSTGRES_ENDPOINT,
  POSTGRES_ENDPOINT_DEV,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_DEV,
  REDIS_HOST,
  REDIS_USER,
  REDIS_PASSWORD,
  REDIS_HOST_DEV,
  MONGODB_USERNAME,
  MONGODB_CLUSTER_URL,
  MONGODB_PASSWORD,
  NODE_ENV,
} = process.env;

export const PRODUCTION_ENV = NODE_ENV === 'production';

const endPoint = PRODUCTION_ENV ? POSTGRES_ENDPOINT : POSTGRES_ENDPOINT_DEV;
const database = PRODUCTION_ENV ? POSTGRES_DB : POSTGRES_DB_DEV;
const postgresPort = Number(POSTGRES_PORT);

export const ReadPoolConfig = {
  host: endPoint,
  port: postgresPort,
  database,
  user: POSTGRES_READ_USER,
  password: POSTGRES_READ_USER_PASSWORD,
  max: 20,
};

export const WritePoolConfig = {
  host: endPoint,
  port: postgresPort,
  database,
  user: POSTGRES_CREATE_USER,
  password: POSTGRES_CREATE_USER_PASSWORD,
  max: 10,
};

export const UpdatePoolConfig = {
  host: endPoint,
  port: postgresPort,
  database,
  user: POSTGRES_UPDATE_USER,
  password: POSTGRES_UPDATE_USER_PASSWORD,
  max: 10,
};

export const DeletePoolConfig = {
  host: endPoint,
  port: postgresPort,
  database,
  user: POSTGRES_DELETE_USER,
  password: POSTGRES_DELETE_USER_PASSWORD,
  max: 10,
};

export const CRUDPoolConfig = {
  host: endPoint,
  port: postgresPort,
  database,
  user: POSTGRES_CRUD_USER,
  password: POSTGRES_CRUD_USER_PASSWORD,
  max: 10,
};

// export const REDIS_ENDPOINT = PRODUCTION_ENV
//   ? `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}`
//   : REDIS_HOST_DEV!;

export const REDIS_ENDPOINT = PRODUCTION_ENV
  ? `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}`
  : REDIS_HOST_DEV!;

export const MongoDBConfig = {
  url: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}?retryWrites=true&w=majority`,
  admin_url: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/admin-cache?retryWrites=true&w=majority`,
};

export const tokenInfo = {
  accessTokenValidityDays: parseInt(
    process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'
  ),
  issuer: process.env.TOKEN_ISSUER || '',
};

export const whitelistDomains = [
  'http://127.0.0.1:80',
  'http://127.0.0.1:3001',
  'http://localhost:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://dropgala.shop',
  'https://media.dropgala.shop',
  'https://dropgala.com',
  'https://www.dropgala.com',
  'https://dropgala.vercel.app',
  'https://dropgala-larbisahli.vercel.app',
  'https://business.dropgala.com',
  'https://development.dropgala.com',
];

export const graphqlPort = PRODUCTION_ENV ? 80:5000
export const RPCPort = '0.0.0.0:50051';
export const RPCStoreFrontServerPort = PRODUCTION_ENV
  ? 'storefront_server:50052'
  : '0.0.0.0:50052';
