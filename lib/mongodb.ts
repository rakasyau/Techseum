import mongoose, { type Mongoose } from "mongoose";
import { serverEnv } from "./env";

/*
 * MongoDB connection singleton.
 *
 * Next.js hot-reloads modules during development and runs several isolates in
 * production. Without this cache each reload would open a fresh connection
 * pool until Atlas refuses further connections.
 */

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ??
  (global._mongooseCache = { conn: null, promise: null });

export async function connectToDatabase(): Promise<Mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);

    cache.promise = mongoose
      .connect(serverEnv.mongodbUri, {
        dbName: serverEnv.mongodbDb,
        // Keep the pool modest: serverless functions scale horizontally, and a
        // large per-instance pool exhausts Atlas connection limits.
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        autoIndex: true,
      })
      .catch((error) => {
        // Clear the cached promise so the next request retries instead of
        // reusing a rejected connection forever.
        cache.promise = null;
        throw error;
      });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}

// True when the cluster answers a ping. Used by the health endpoint.
export async function databaseIsReachable(): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (!conn.connection.db) return false;
    await conn.connection.db.admin().ping();
    return true;
  } catch {
    return false;
  }
}

// Mongoose caches models on the global mongoose instance itself, so the
// standard `mongoose.models.X || mongoose.model("X", schema)` guard inside
// each model file is sufficient to survive hot reload.
export { mongoose };
