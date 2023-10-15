const net = require("net");
const RequestParser = require("./RequestParser");
const ResponseFormatter = require("./ResponseFormatter");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = new RequestParser(data);
    const response = new ResponseFormatter();

    if (request.path === "/") {
      response.httpStatusLine = "HTTP/1.1 200";
    } else if (request.path.startsWith("/echo")) {
      response.httpStatusLine = "HTTP/1.1 200";
      response.contentType = "Content-Type: text/plain";
      response.contentLength = `Content-Length: ${request.uri.length}`;
      response.responseBody = request.uri;
    } else if (request.path.startsWith("/user-agent")) {
      const headers = request.headers;
      const userAgent = headers["User-Agent"];

      response.httpStatusLine = "HTTP/1.1 200";
      response.contentType = "Content-Type: text/plain";
      response.contentLength = `Content-Length: ${userAgent.length}`;
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
