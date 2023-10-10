const { CRLF } = require("./crlf");

class RequestParser {
  constructor(data) {
    this.data = data;
  }

  get path() {
    let [startLine] = this.data.toString().split(CRLF);
    return startLine.split(" ")[1];
  }

  get base() {
    return this.path.split("/")[1];
  }

  get uri() {
    const parts = this.path.split(`/${this.base}/`);

    return parts[parts.length - 1];
  }
}

module.exports = RequestParser;
