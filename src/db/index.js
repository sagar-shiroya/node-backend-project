import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // console.log(connectionInstance.connection);

    console.log(
      `MongoDB Connected... Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("DB Connect Error: ", error);
    process.exit(1); // TODO: what are these numbers 1, read more...
  }
};

export default connectDB;
