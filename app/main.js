const net = require("net");

const PORT = 4221

// The end-of-line marker that HTTP uses
const CRLF = "\r\n"

const withCRLF = (s) => s + CRLF

const parsePathURI = (path, base) => {
    const parts = path.split(`/${base}/`)

    return parts[parts.length - 1]
}

const parseBase = (path) => {
  return path.split("/")[1]
}

const parseRequestData = (data) => {
  let [startLine] = data.toString().split(CRLF)

  let path =  startLine.split(" ")[1]
  let base = parseBase(path)
  const uri = parsePathURI(path, base)

  return { path, uri }
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const { path, uri } = parseRequestData(data)

    let httpStatusLine = withCRLF("")
    let contentType = withCRLF("")
    let contentLength = withCRLF("")
    let responseBody = withCRLF("")
    let responseHeaders = withCRLF("")

    if (path === "/") {
      httpStatusLine = withCRLF("HTTP/1.1 200")
    } else if (path.startsWith("/echo")) {
      httpStatusLine = withCRLF("HTTP/1.1 200")
      contentType = withCRLF("Content-Type: text/plain")
      contentLength = withCRLF(`Content-Length: ${uri.length}`)
      responseBody = withCRLF(uri)
    } else {
      httpStatusLine = withCRLF("HTTP/1.1 404")
    }

    socket.write(httpStatusLine + contentType + contentLength  + responseHeaders + responseBody)
    socket.end()
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
