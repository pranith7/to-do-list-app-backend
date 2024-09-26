class ApiResponse {

    statusCode: number;
    data: any;
    success: boolean;
    errors: any;
    message: string;

    constructor(statusCode: number, data: any, message: string = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };