import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let publicKEY: string;
let privateKEY: string;

const ENV = process.env;
const PRODUCTION_ENV = ENV.NODE_ENV === 'production';

if (PRODUCTION_ENV) {
  const jwtRS256File = path.join(process.cwd(), 'jwtRS256.key.pub');
  publicKEY = fs.readFileSync(jwtRS256File, 'utf8');
} else {
  publicKEY = fs.readFileSync('./src/config/jwtRS256.key.pub', 'utf8');
}

if (PRODUCTION_ENV) {
  const jwtRS256File = path.join(process.cwd(), 'jwtRS256.key');
  privateKEY = fs.readFileSync(jwtRS256File, 'utf8');
} else {
  privateKEY = fs.readFileSync('./src/config/jwtRS256.key', 'utf8');
}

export { privateKEY, publicKEY };
