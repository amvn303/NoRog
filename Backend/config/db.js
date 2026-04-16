import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/norog";
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || "norog"
  });
  console.log("MongoDB connected");
};

