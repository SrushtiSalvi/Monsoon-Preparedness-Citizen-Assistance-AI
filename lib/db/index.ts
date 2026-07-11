import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL || '';

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, { schema });

const INITIAL_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY,
    "name" text,
    "email" text NOT NULL UNIQUE,
    "emailVerified" boolean NOT NULL DEFAULT false,
    "image" text,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "expiresAt" timestamp with time zone NOT NULL,
    "token" text NOT NULL UNIQUE,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    "scope" text,
    "password" text,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
  );

  CREATE TABLE IF NOT EXISTS "profile" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
    "location" text NOT NULL,
    "houseType" text NOT NULL,
    "householdSize" integer NOT NULL,
    "children" integer NOT NULL DEFAULT 0,
    "elderly" integer NOT NULL DEFAULT 0,
    "pets" text,
    "medicalConditions" text,
    "medications" text,
    "preparednessScore" integer NOT NULL DEFAULT 0,
    "riskLevel" text NOT NULL DEFAULT 'moderate',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS "checklist_item" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "category" text NOT NULL,
    "item" text NOT NULL,
    "completed" boolean NOT NULL DEFAULT false,
    "priority" text NOT NULL DEFAULT 'medium',
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS "weather_data" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "location" text NOT NULL,
    "currentTemp" integer,
    "condition" text,
    "humidity" integer,
    "windSpeed" integer,
    "rainfall" numeric,
    "floodRisk" text NOT NULL DEFAULT 'low',
    "forecast" text,
    "lastUpdated" timestamp with time zone NOT NULL DEFAULT now()
  );
`;

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(INITIAL_SCHEMA_SQL);
  } finally {
    client.release();
  }
}

void initializeDatabase().catch((error) => {
  console.error('[db] failed to initialize schema', error);
});

export type Database = typeof db;
