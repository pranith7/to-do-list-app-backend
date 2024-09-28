"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncHandler = void 0;
const AsyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};
exports.AsyncHandler = AsyncHandler;
