const ResponseFormatter = require("./ResponseFormatter");

class Router {
  constructor({ request, routes = [] }) {
    this.request = request;
    this.routes = routes;
  }

  add(method, path, handler) {
    this.routes.push({ method, path, handler });
  }

  route() {
    const response = new ResponseFormatter();

    for (const { path, handler, method } of this.routes) {
      if (method === this.request.method) {
        if (this.request.path === path) {
          handler(this.request, response);
          return response;
        } else if (
          this.request.path.startsWith(path.replace("/*", "")) &&
          path.endsWith("*")
        ) {
          handler(this.request, response);
          return response;
        } else if (path === "*") {
          handler(this.request, response);
          return response;
        }
      }
    }
  }
}

module.exports = Router;
