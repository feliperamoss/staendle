class ExpressError extends Error{
    constructor(message, statusCode) {
        super();//to access the parent's properties and methods.
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;