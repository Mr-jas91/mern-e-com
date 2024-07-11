import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

// Define the connectDB function
const connectDB = async () => {
  try {
    // Connect to MongoDB using mongoose
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // Log successful connection
    console.log("MongoDB connected:", connectionInstance.connection.host);
  } catch (error) {
    // Log and handle any errors
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Export the connectDB function as the default export
export default connectDB;
