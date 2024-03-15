import { CRLF } from "./crlf";

export default class Request {
  private readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  get path() {
    let [startLine] = this.dataLines;
    return startLine.split(" ")[1];
  }

  get headers(): string[] {
    const [_, ...headers] = this.dataLines;

    return Object.fromEntries(headers.filter(Boolean).map((header) => header.split(":").map((s) => s.trim())));
  }

  get base() {
    return this.path.split("/")[1];
  }

  get uri() {
    const parts = this.path.split(`/${this.base}/`);

    return parts.at(-1);
  }

  get method() {
    let [startLine] = this.dataLines;
    return startLine.split(" ")[0];
  }

  get body() {
    return this.dataLines.at(-1);
  }

  private get dataLines() {
    return this.data.toString().split(CRLF);
  }
}
