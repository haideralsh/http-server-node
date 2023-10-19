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
      if (method !== this.request.method) continue;

      if (
        this._isExactPath(path) ||
        this._isWildCard(path) ||
        this._is404(path)
      ) {
        handler(this.request, response);
        return response;
      }
    }
  }

  // private

  _isExactPath(path) {
    return this.request.path === path;
  }

  _isWildCard(path) {
    return (
      this.request.path.startsWith(path.replace("/*", "")) && path.endsWith("*")
    );
  }

  _is404(path) {
    return path === "*";
  }
}

module.exports = Router;
