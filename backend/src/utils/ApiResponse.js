class ApiResponse {
  constructor(statusCode, message = "success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
  }
}
export { ApiResponse };
