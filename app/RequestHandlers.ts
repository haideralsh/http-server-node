import fs from "fs";
import path from "path";
import { parseDirectoryNameFromFlag } from "./lib";
import Request from "./Request";
import ResponseFormatter from "./ResponseFormatter";

export type RequestHandler = (request: Request, response: ResponseFormatter) => void;

export const notFound: RequestHandler = (_, response) => {
  response.httpStatusLine = "HTTP/1.1 404";
};

export const userAgent: RequestHandler = (request, response) => {
  const headers = request.headers;
  const userAgent = headers["User-Agent"];

  response.httpStatusLine = "HTTP/1.1 200";
  response.contentType = "Content-Type: text/plain";
  response.responseBody = userAgent;
};

export const echo: RequestHandler = (request, response) => {
  response.httpStatusLine = "HTTP/1.1 200";
  response.contentType = "Content-Type: text/plain";
  response.responseBody = request.uri;
};

export const readFile: RequestHandler = (request, response) => {
  const directoryName = parseDirectoryNameFromFlag();
  if (!directoryName) {
    console.error(`Missing --directory flag. Pass a directory name using the "--directory" flag`);

    return;
  }

  const files = fs.readdirSync(directoryName);
  const fileName = request.uri;

  if (!files.includes(fileName)) {
    response.httpStatusLine = "HTTP/1.1 404";
    return;
  }

  const filePath = path.join(directoryName, fileName);
  const content = fs.readFileSync(filePath, { encoding: "utf8" });

  response.httpStatusLine = "HTTP/1.1 200";
  response.contentType = "Content-Type: application/octet-stream";
  response.responseBody = content;
};

export const writeFile: RequestHandler = (request, response) => {
  const directoryName = parseDirectoryNameFromFlag();
  if (!directoryName) {
    console.error(`Missing --directory flag. Pass a directory name using the "--directory" flag`);

    return;
  }

  const fileName = request.uri;

  const requestBody = request.body;
  const filePath = path.join(directoryName, fileName);
  fs.writeFileSync(filePath, requestBody, { encoding: "utf8" });

  response.httpStatusLine = "HTTP/1.1 201";
};

export const root: RequestHandler = (_, response) => {
  response.httpStatusLine = "HTTP/1.1 200";
};
