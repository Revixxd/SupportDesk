import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

export type AppEnv = 'development' | 'stage' | 'production';
const __dirname = dirname(fileURLToPath(import.meta.url));

const normalizeAppEnv = (value: string | undefined): AppEnv => {
  if (value === 'production' || value === 'stage') {
    return value;
  }
  return 'development';
};

export const appEnv = normalizeAppEnv(process.env.APP_ENV ?? process.env.NODE_ENV);

const envRoot = resolve(__dirname, '../../../environment/backend');
const envByPriority = [`.env.${appEnv}`];

for (const envFile of envByPriority) {
  const envPath = resolve(envRoot, envFile);
  if (existsSync(envPath)) {
    config({ path: envPath, override: false });
  }
}
