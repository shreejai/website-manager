import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local");
}

// In dev, Next.js hot-reload modules. Caching the client on globalThis
// stops us opening a new connection on every reload.
const globalForMongo = globalThis as unknown as {
  _mongoClient?: Promise<MongoClient>;
};

const clientPromise =
  globalForMongo._mongoClient ?? new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(); // uses the database name from the URI
}

/** For scripts (seed) only. The Next app keeps its connection open. */
export async function closeDb(): Promise<void> {
  const client = await clientPromise;
  await client.close();
}
