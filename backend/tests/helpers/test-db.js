import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectTestDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

const clearTestDatabase = async () => {
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
};

const disconnectTestDatabase = async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
};

export {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase,
};