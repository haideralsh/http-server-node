const net = require("net");
const RequestParser = require("./RequestParser");
const Router = require("./Router");
const {
  handleRoot,
  handleWriteFile,
  handleReadFile,
  handleEcho,
  handleUserAgent,
  handleNotFound,
} = require("./RequestHandlers");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = new RequestParser(data);

    const router = new Router({ request });

    router.add("GET", "/", handleRoot);
    router.add("POST", "/files/*", handleWriteFile);
    router.add("GET", "/files/*", handleReadFile);
    router.add("GET", "/echo/*", handleEcho);
    router.add("GET", "/user-agent", handleUserAgent);
    router.add("GET", "*", handleNotFound);

    const response = router.route();

    socket.write(response.format());
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
