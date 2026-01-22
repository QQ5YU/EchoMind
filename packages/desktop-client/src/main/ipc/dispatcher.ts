import { INestApplicationContext, Type } from "@nestjs/common";
import {
  PATH_METADATA,
  METHOD_METADATA,
  ROUTE_ARGS_METADATA,
} from "@nestjs/common/constants";
import { pathToRegexp } from "path-to-regexp";
import {
  IpcRequest,
  RouteHandler,
  RouteParamtypes,
  RouteParams,
} from "./types";

type DispatchContext = IpcRequest & { routeParams?: RouteParams };
type ControllerMethod = (...args: unknown[]) => unknown | Promise<unknown>;
type ControllerPrototype = Record<string, (...args: unknown[]) => unknown>;

export class IpcDispatcher {
  private routes: RouteHandler[] = [];

  constructor(private readonly nestApp: INestApplicationContext) {}

  /**
   * Registers multiple controllers
   */
  public registerControllers(controllers: Type<object>[]) {
    controllers.forEach((ctrl) => this.scanController(ctrl));
  }

  /**
   * Scans a controller and builds the route map
   */
  private scanController(controllerType: Type<object>) {
    const instance = this.nestApp.get(controllerType) as Record<
      string,
      unknown
    >;
    const controllerPath =
      Reflect.getMetadata(PATH_METADATA, controllerType) || "";
    const prototype = Object.getPrototypeOf(instance);

    Object.getOwnPropertyNames(prototype)
      .filter(
        (name) =>
          name !== "constructor" && typeof prototype[name] === "function",
      )
      .forEach((methodName) => {
        this.extractRoute(instance, methodName, controllerPath, controllerType);
      });
  }

  /**
   * Extracts route information from a controller method
   */
  private extractRoute(
    instance: Record<string, unknown>,
    methodName: string,
    basePath: string,
    controllerType: Type<object>,
  ) {
    const prototype = Object.getPrototypeOf(instance) as Record<
      string,
      ControllerPrototype
    >;
    const target = prototype[methodName];
    const path = Reflect.getMetadata(PATH_METADATA, target);
    const methodNum = Reflect.getMetadata(METHOD_METADATA, target);

    if (methodNum === undefined) return;

    const fullPath =
      `/${basePath}/${path || ""}`.replace(/\/+/g, "/").replace(/\/$/, "") ||
      "/";
    const { regexp, keys } = pathToRegexp(fullPath);
    const paramMetadata = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      controllerType,
      methodName,
    ) as RouteHandler["paramMetadata"];
    const httpMethods = this.mapMethodNames(methodNum);

    httpMethods.forEach((httpMethod) => {
      this.routes.push({
        target: instance,
        methodName,
        httpMethod,
        regex: regexp,
        keys,
        paramMetadata,
      });
    });
  }

  /**
   * Dispatches an incoming IPC request to the matching controller method
   */
  public async dispatch(request: IpcRequest) {
    const { url, method } = request;
    const cleanUrl = url.replace(/^\/api/, "").replace(/\/$/, "") || "/";
    const httpMethod = method.toUpperCase();

    const route = this.routes.find(
      (r) => r.httpMethod === httpMethod && r.regex.test(cleanUrl),
    );
    if (!route) throw new Error(`Route not found: ${httpMethod} ${cleanUrl}`);

    const routeParams = this.extractParams(route, cleanUrl);
    const args = this.resolveArgs(route, { ...request, routeParams });
    const handler = (route.target[route.methodName] ??
      null) as ControllerMethod | null;

    if (typeof handler !== "function") {
      throw new Error(`Invalid handler for route: ${route.methodName}`);
    }

    return await handler.apply(route.target, args);
  }

  /**
   * Extracts path parameters from the URL
   */
  private extractParams(route: RouteHandler, url: string): RouteParams {
    const match = route.regex.exec(url);
    const params: RouteParams = {};
    if (match) {
      route.keys.forEach((key, i) => {
        const value = match[i + 1];
        if (typeof value === "string") {
          params[String(key.name)] = value;
        }
      });
    }
    return params;
  }

  /**
   * Resolves arguments for the controller method based on NestJS metadata
   */
  private resolveArgs(route: RouteHandler, ctx: DispatchContext): unknown[] {
    const args: unknown[] = [];
    if (!route.paramMetadata) return args;

    const bodyRecord = this.asRecord(ctx.data);
    const queryRecord = this.asRecord(ctx.params);
    const headersRecord = this.asRecord(ctx.headers);

    Object.entries(route.paramMetadata).forEach(([key, metadata]) => {
      const [type, index] = key.split(":").map(Number);
      const { data: dataKey } = metadata;

      switch (type) {
        case RouteParamtypes.BODY:
          args[index] = dataKey
            ? this.getRecordValue(bodyRecord, dataKey)
            : ctx.data;
          break;
        case RouteParamtypes.QUERY:
          args[index] = dataKey
            ? this.getRecordValue(queryRecord, dataKey)
            : queryRecord;
          break;
        case RouteParamtypes.PARAM:
          args[index] = dataKey ? ctx.routeParams?.[dataKey] : ctx.routeParams;
          break;
        case RouteParamtypes.HEADERS:
          args[index] = dataKey
            ? this.getRecordValue(headersRecord, dataKey)
            : headersRecord;
          break;
        case RouteParamtypes.REQUEST:
          args[index] = {
            ...ctx,
            params: queryRecord,
            headers: headersRecord,
            user: headersRecord?.user,
          };
          break;
        default:
          break;
      }
    });
    return args;
  }

  private asRecord(value: unknown): Record<string, unknown> | undefined {
    return typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : undefined;
  }

  private getRecordValue(
    source: Record<string, unknown> | undefined,
    key?: string,
  ): unknown {
    if (!key) return source;
    return source ? source[key] : undefined;
  }

  /**
   * Maps NestJS method number to HTTP method names
   */
  private mapMethodNames(num: number): string[] {
    const methods = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "ALL",
      "OPTIONS",
      "HEAD",
    ];
    return num === 5 ? methods : [methods[num]];
  }
}
