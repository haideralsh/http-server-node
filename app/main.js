const net = require("net");

const PORT = 4221

// The end-of-line marker that HTTP uses
const CRLF = "\r\n"

const withCRLF = (s) => s + CRLF

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(`Got a request on localhost:${PORT}`, data.toString())

    const HttpStatusLine  =  withCRLF("HTTP/1.1 200")
    const responseHeaders  =  withCRLF("")

    socket.write(HttpStatusLine + responseHeaders)

    socket.end()
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(PORT, "localhost");
