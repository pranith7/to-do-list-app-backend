const AsyncHandler = (requestHandler: any) => {
    return (req: any, res: any, next: any) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err: any) => next(err));
    };
};


export { AsyncHandler };