const fs = require("fs");
const path = require("path");
const { parseDirectoryNameFromFlag } = require("./lib");

function handleNotFound(_, response) {
  response.httpStatusLine = "HTTP/1.1 404";
}

function handleUserAgent(request, response) {
  const headers = request.headers;
  const userAgent = headers["User-Agent"];

  response.httpStatusLine = "HTTP/1.1 200";
  response.contentType = "Content-Type: text/plain";
  response.responseBody = userAgent;
}

function handleEcho(request, response) {
  response.httpStatusLine = "HTTP/1.1 200";
  response.contentType = "Content-Type: text/plain";
  response.responseBody = request.uri;
}

function handleReadFile(request, response) {
  const directoryName = parseDirectoryNameFromFlag();
  if (!directoryName) {
    console.error(
      `Missing --directory flag. Pass a directory name using the "--directory" flag`
    );

    return;
  }

  const fileName = request.uri;
  const files = fs.readdirSync(directoryName);

  if (files.includes(fileName)) {
    const filePath = path.join(directoryName, fileName);
    const content = fs.readFileSync(filePath, { encoding: "utf8" });

    response.httpStatusLine = "HTTP/1.1 200";
    response.contentType = "Content-Type: application/octet-stream";
    response.responseBody = content;
  } else {
    response.httpStatusLine = "HTTP/1.1 404";
  }
}

function handleWriteFile(request, response) {
  const directoryName = parseDirectoryNameFromFlag();
  if (!directoryName) {
    console.error(
      `Missing --directory flag. Pass a directory name using the "--directory" flag`
    );

    return;
  }

  const fileName = request.uri;

  const requestBody = request.body;
  const filePath = path.join(directoryName, fileName);
  fs.writeFileSync(filePath, requestBody, { encoding: "utf8" });

  response.httpStatusLine = "HTTP/1.1 201";
}

function handleRoot(_, response) {
  response.httpStatusLine = "HTTP/1.1 200";
}

module.exports = {
  handleEcho,
  handleRoot,
  handleNotFound,
  handleReadFile,
  handleWriteFile,
  handleUserAgent,
};
