import { Pool } from 'pg';
import { ReadPoolConfig } from '@config';
import Logger from '@core/Logger';

// **** POOL PERMISSIONS ****

// ^^^ READ USER
export const ReadPool = new Pool(ReadPoolConfig);
ReadPool.on('error', (error) => Logger.system.error(error));