const net = require("net");
const RequestParser = require("./RequestParser");
const ResponseFormatter = require("./ResponseFormatter");
const fs = require("fs");
const path = require("path");

function parseFlag(flag) {
  const args = process.argv;

  const directoryFlagIndex = args.indexOf("--directory");

  if (directoryFlagIndex !== -1 && args.length > directoryFlagIndex + 1) {
    return args[directoryFlagIndex + 1];
  } else return null;
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = new RequestParser(data);
    const response = new ResponseFormatter();

    if (request.path === "/") {
      response.httpStatusLine = "HTTP/1.1 200";
    } else if (request.path.startsWith("/files")) {
      const fileName = request.uri;
      const directory = parseFlag("directory");

      if (directory) {
        let files = fs.readdirSync(directory);

        if (files.includes(fileName)) {
          const filePath = path.join(directory, fileName);
          const content = fs.readFileSync(filePath, { encoding: "utf8" });

          response.httpStatusLine = "HTTP/1.1 200";
          response.contentType = "Content-Type: application/octet-stream";
          response.responseBody = content;
        } else {
          response.httpStatusLine = "HTTP/1.1 404";
        }
      }
    } else if (request.path.startsWith("/echo")) {
      response.httpStatusLine = "HTTP/1.1 200";
      response.contentType = "Content-Type: text/plain";
      response.responseBody = request.uri;
    } else if (request.path.startsWith("/user-agent")) {
      const headers = request.headers;
      const userAgent = headers["User-Agent"];

      response.httpStatusLine = "HTTP/1.1 200";
      response.contentType = "Content-Type: text/plain";
      response.responseBody = userAgent;
    } else {
      response.httpStatusLine = "HTTP/1.1 404";
    }

    socket.write(response.format());
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
