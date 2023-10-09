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



let response = {
   httpStatusLine : "",
   contentType : "",
   contentLength : "",
   responseHeaders : "",
   responseBody : "",
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const { path, uri } = parseRequestData(data)

    if (path === "/") {
      response.httpStatusLine = "HTTP/1.1 200"
    } else if (path.startsWith("/echo")) {
      response.httpStatusLine = "HTTP/1.1 200"
      response.contentType = "Content-Type: text/plain"
      response.contentLength = `Content-Length: ${uri.length}`
      response.responseBody = uri
    } else {
      response.httpStatusLine = "HTTP/1.1 404"
    }

    socket.write(Object.values(response).map(v => withCRLF(v)).join(""))
    socket.end()
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
