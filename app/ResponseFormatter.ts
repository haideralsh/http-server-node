import { withCRLF } from "./crlf";

interface Response {
  httpStatusLine?: string;
  contentType?: string;
  contentLength?: string;
  responseHeaders?: string;
  responseBody?: string;
}

export default class ResponseFormatter {
  private response: Response;

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

  set httpStatusLine(value: string) {
    this.response.httpStatusLine = value;
  }
  set contentType(value: string) {
    this.response.contentType = value;
  }
  set responseHeaders(value: string) {
    this.response.responseHeaders = value;
  }

  set responseBody(value: string) {
    this.response.responseBody = value;
    this.response.contentLength = this.response.responseBody.length
      ? `Content-Length: ${this.response.responseBody.length}`
      : "";
  }

  format() {
    return Object.values(this.response).map(withCRLF).join("");
  }
}
