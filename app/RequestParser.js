const { CRLF } = require("./crlf");

class RequestParser {
  constructor(data) {
    this.data = data;
  }

  get path() {
    let [startLine] = this._dataLines;
    return startLine.split(" ")[1];
  }

  get headers() {
    const [_, ...headers] = this._dataLines;

    return Object.fromEntries(
      headers
        .filter(Boolean)
        .map((header) => header.split(":").map((s) => s.trim())),
    );
  }

  get base() {
    return this.path.split("/")[1];
  }

  get uri() {
    const parts = this.path.split(`/${this.base}/`);

    return parts[parts.length - 1];
  }

  // private
  get _dataLines() {
    return this.data.toString().split(CRLF);
  }
}

module.exports = RequestParser;
