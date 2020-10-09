import appRootPath from 'app-root-path';
import dotenv from 'dotenv';
import { ensureVariableExists } from '../helpers';

dotenv.config({ path: `${appRootPath.path}/.env` });

export const NODE_ENV = ensureVariableExists(
  process.env.NODE_ENV,
  'NODE ENVIRONMENT',
);

export const APP_PORT = ensureVariableExists(process.env.APP_PORT, 'APP PORT');

export const MONGO_URL = ensureVariableExists(
  process.env.MONGO_URL,
  'MONGO URL',
);

export const TOKEN_SECRET = ensureVariableExists(
  process.env.TOKEN_SECRET,
  'SECRET TOKEN',
);
export const DATABASE_URL = ensureVariableExists(
  process.env.DATABASE_URL,
  'DATABASE URL',
);
