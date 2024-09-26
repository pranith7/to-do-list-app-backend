import mongoose from "mongoose";
// import { DB_NAME } from '../constant';

const ConnectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CLOUD_URI}`);
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }catch (error){
        console.log("MONGODB connection Failed ", error);
        process.exit(1);
    }
};

export default ConnectDB;
