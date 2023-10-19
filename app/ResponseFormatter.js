const { withCRLF } = require("./crlf");

class ResponseFormatter {
  constructor(response = {}) {
    this.response = {
      httpStatusLine: "",
      contentType: "",
      contentLength: "",
      responseHeaders: "",
      responseBody: "",
      ...response,
    };
  }

  set httpStatusLine(value) {
    this.response.httpStatusLine = value;
  }
  set contentType(value) {
    this.response.contentType = value;
  }
  set responseHeaders(value) {
    this.response.responseHeaders = value;
  }

  set responseBody(value) {
    this.response.responseBody = value;
    this.response.contentLength = this.response.responseBody.length
      ? `Content-Length: ${this.response.responseBody.length}`
      : "";
  }

  format() {
    return Object.values(this.response).map(withCRLF).join("");
  }
}

module.exports = ResponseFormatter;
