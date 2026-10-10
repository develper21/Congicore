import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Do not throw at module-evaluation time: Next.js imports every API route
// module during `next build` (page data collection), where MONGO_URI is not
// required yet. Validate lazily when a real connection is attempted.
if (!MONGO_URI && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn(
    "MONGO_URI is not set. Database-backed routes will fail at request time until it is configured."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGO_URI) {
      throw new Error(
        "Please define the MONGO_URI environment variable."
      );
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
