export default class HttpException {
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static CONFLICT = 409;
    static INTERNAL_SERVER_ERROR = 500;

    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.message = message;
    }
}