import net from "net";
import Request from "./Request";
import Router from "./Router";
import * as RequestHandlers from "./RequestHandlers";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = new Request(data);
    const router = new Router(request);

    router.add("GET", "/", RequestHandlers.root);
    router.add("POST", "/files/*", RequestHandlers.writeFile);
    router.add("GET", "/files/*", RequestHandlers.readFile);
    router.add("GET", "/echo/*", RequestHandlers.echo);
    router.add("GET", "/user-agent", RequestHandlers.userAgent);
    router.add("GET", "*", RequestHandlers.notFound);

    const response = router.route();

    if (response) {
      socket.write(response.format());
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
