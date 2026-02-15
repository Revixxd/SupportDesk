import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, env } from 'prisma/config';

const appEnv = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';
const normalizedAppEnv =
  appEnv === 'production' || appEnv === 'stage' ? appEnv : 'development';

const envRoot = resolve(process.cwd(), '../../environment/backend');

for (const envFile of [`.env.${normalizedAppEnv}`]) {
  const envPath = resolve(envRoot, envFile);
  if (existsSync(envPath)) {
    config({ path: envPath, override: false });
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
