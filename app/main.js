const net = require("net");
const RequestParser = require("./RequestParser");
const ResponseFormatter = require("./ResponseFormatter");
const fs = require("fs");
const path = require("path");
const { parseArgs } = require("util");

function parseDirectoryNameFromFlag() {
  const parsedResult = parseArgs({
    options: {
      directory: {
        type: "string",
      },
    },
  });

  return parsedResult.values.directory ?? null;
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = new RequestParser(data);
    const response = new ResponseFormatter();

    if (request.path === "/") {
      response.httpStatusLine = "HTTP/1.1 200";
    } else if (request.path.startsWith("/files")) {
      const directoryName = parseDirectoryNameFromFlag();
      if (!directoryName) {
        console.error(
          `Missing --directory flag. Pass a directory name using the "--directory" flag`,
        );

        return;
      }

      const fileName = request.uri;
      const method = request.method;
      const files = fs.readdirSync(directoryName);

      switch (method) {
        case "GET":
          if (files.includes(fileName)) {
            const filePath = path.join(directoryName, fileName);
            const content = fs.readFileSync(filePath, { encoding: "utf8" });

            response.httpStatusLine = "HTTP/1.1 200";
            response.contentType = "Content-Type: application/octet-stream";
            response.responseBody = content;
          } else {
            response.httpStatusLine = "HTTP/1.1 404";
          }
          break;

        case "POST":
          const requestBody = request.body;
          const filePath = path.join(directoryName, fileName);
          fs.writeFileSync(filePath, requestBody, { encoding: "utf8" });

          response.httpStatusLine = "HTTP/1.1 201";
          break;
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
