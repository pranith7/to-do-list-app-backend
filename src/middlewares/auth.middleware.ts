import jwt from "jsonwebtoken";

import { Usermodel as User} from "../models/user.model";

import { ApiError } from "../utils/ApiError";
import { AsyncHandler } from "../utils/AsyncHandler";



export const verifyJWT = AsyncHandler( async(req: any, _: any,next: any) => {
    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload & {_id: string};
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();

    } catch(error){
        const err = error as Error;
        throw new ApiError(401, err?.message || "Invalid access token");
    }
});