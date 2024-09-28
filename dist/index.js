"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./db/index"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../.env')
});
console.log(`process.env.PORT: ${process.env.PORT}`);
(0, index_1.default)();
app_1.app.listen(process.env.PORT || 4005, () => {
    console.log(`Server is running at port: ${process.env.PORT}`);
});
