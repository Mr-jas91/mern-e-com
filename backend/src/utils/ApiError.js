class ApiError extends Error {
  constructor(statusCode, message = "somethings went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = message
  }
}
export {ApiError}