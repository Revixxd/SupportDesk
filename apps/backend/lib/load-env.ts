import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type AppEnv = 'development' | 'stage' | 'production';

const normalizeAppEnv = (value: string | undefined): AppEnv => {
  if (value === 'production' || value === 'stage') {
    return value;
  }
  return 'development';
};

export const appEnv = normalizeAppEnv(process.env.APP_ENV ?? process.env.NODE_ENV);

const envRoot = resolve(process.cwd(), '../../environment/backend');
const envByPriority = [`.env.${appEnv}`];

for (const envFile of envByPriority) {
  const envPath = resolve(envRoot, envFile);
  if (existsSync(envPath)) {
    config({ path: envPath, override: false });
  }
}
