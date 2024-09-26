import { app } from './app';
import path from 'path';

import dotenv from "dotenv";
import ConnectDB from './db/index';

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

console.log(`process.env.PORT: ${process.env.PORT}`);


ConnectDB();

app.listen(process.env.PORT || 4005 , () => {
    console.log(`Server is running at port: ${process.env.PORT}`);

});


