const net = require("net");

const PORT = 4221

// The end-of-line marker that HTTP uses
const CRLF = "\r\n"

const withCRLF = (s) => s + CRLF

const parseRequestData = (data) => {
  let [startLine] = data.toString().split(CRLF)
  let path =  startLine.split(" ")[1]

  return { path }
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const { path } = parseRequestData(data)

    let HttpStatusLine = ""
    let responseHeaders = ""

    if (path === "/") {
      HttpStatusLine = withCRLF("HTTP/1.1 200")
    } else {
      HttpStatusLine = withCRLF("HTTP/1.1 404")
    }

    socket.write(HttpStatusLine + responseHeaders)
    socket.end()
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
