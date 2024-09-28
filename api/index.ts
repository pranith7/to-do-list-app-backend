import serverless from 'serverless-http';
import { app } from '../src/app';
import ConnectDB from '../src/db/index';
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

console.log(`process.env.PORT: ${process.env.PORT}`);

// Initialize database connection
ConnectDB();

app.listen(process.env.PORT || 4005 , () => {
    console.log(`Server is running at port: ${process.env.PORT}`);

});

export const handler = serverless(app);