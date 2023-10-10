const { withCRLF } = require("./crlf");

class ResponseFormatter {
  response = {
    httpStatusLine: "",
    contentType: "",
    contentLength: "",
    responseHeaders: "",
    responseBody: "",
  };

  constructor() {}

  set httpStatusLine(value) {
    this.response.httpStatusLine = value;
  }
  set contentType(value) {
    this.response.contentType = value;
  }
  set contentLength(value) {
    this.response.contentLength = value;
  }
  set responseHeaders(value) {
    this.response.responseHeaders = value;
  }
  set responseBody(value) {
    this.response.responseBody = value;
  }

  format() {
    return Object.values(this.response)
      .map((v) => withCRLF(v))
      .join("");
  }
}

module.exports = ResponseFormatter;
