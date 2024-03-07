import ResponseFormatter from "./ResponseFormatter";
import Request from "./Request";
import { RequestHandler } from "./RequestHandlers";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH" | "OPTIONS" | "TRACE";

interface Route {
  path: string;
  handler: RequestHandler;
  method: HttpMethod;
}

export default class Router {
  private readonly request: Request;
  private routes: Route[];

  constructor(request: Request, routes: Route[] = []) {
    this.request = request;
    this.routes = routes;
  }

  add(method: HttpMethod, path: string, handler: RequestHandler) {
    this.routes.push({ method, path, handler });
  }

  route() {
    const response = new ResponseFormatter();

    for (const { path, handler, method } of this.routes) {
      if (method !== this.request.method) continue;

      if (this.isExactPath(path) || this.isWildCard(path) || this.is404(path)) {
        handler(this.request, response);
        return response;
      }
    }
  }

  private isExactPath(path: string) {
    return this.request.path === path;
  }

  private isWildCard(path: string) {
    return this.request.path.startsWith(path.replace("/*", "")) && path.endsWith("*");
  }

  private is404(path: string) {
    return path === "*";
  }
}
