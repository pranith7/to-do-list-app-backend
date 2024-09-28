"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
const ConnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        console.log("=> using existing database connection");
        return;
    }
    try {
        const connectionInstance = yield mongoose_1.default.connect(`${process.env.MONGODB_CLOUD_URI}`, {
        // Optional: Add additional mongoose options here
        });
        isConnected = true;
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log("MONGODB connection Failed ", error);
        throw error; // Throw error to let the serverless function handle it
    }
});
exports.default = ConnectDB;
