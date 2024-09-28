import mongoose from "mongoose";

let isConnected = false;

const ConnectDB = async () => {
    if (isConnected) {
        console.log("=> using existing database connection");
        return;
    }

    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CLOUD_URI}`, {
            // Optional: Add additional mongoose options here
        });
        isConnected = true;
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error){
        console.log("MONGODB connection Failed ", error);
        throw error; // Throw error to let the serverless function handle it
    }
};

export default ConnectDB;