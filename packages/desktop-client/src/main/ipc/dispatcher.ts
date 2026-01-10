import { INestApplicationContext, Type } from '@nestjs/common';
import { PATH_METADATA, METHOD_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { pathToRegexp } from 'path-to-regexp';
import { IpcRequest, RouteHandler, RouteParamtypes } from './types';

export class IpcDispatcher {
  private routes: RouteHandler[] = [];

  constructor(private readonly nestApp: INestApplicationContext) {}

  /**
   * Registers multiple controllers
   */
  public registerControllers(controllers: Type<any>[]) {
    controllers.forEach(ctrl => this.scanController(ctrl));
  }

  /**
   * Scans a controller and builds the route map
   */
  private scanController(controllerType: Type<any>) {
    const instance = this.nestApp.get(controllerType);
    const controllerPath = Reflect.getMetadata(PATH_METADATA, controllerType) || '';
    const prototype = Object.getPrototypeOf(instance);

    Object.getOwnPropertyNames(prototype)
      .filter(name => name !== 'constructor' && typeof prototype[name] === 'function')
      .forEach(methodName => {
        this.extractRoute(instance, methodName, controllerPath, controllerType);
      });
  }

  /**
   * Extracts route information from a controller method
   */
  private extractRoute(instance: any, methodName: string, basePath: string, controllerType: Type<any>) {
    const target = Object.getPrototypeOf(instance)[methodName];
    const path = Reflect.getMetadata(PATH_METADATA, target);
    const methodNum = Reflect.getMetadata(METHOD_METADATA, target);

    if (methodNum === undefined) return;

    const fullPath = `/${basePath}/${path || ''}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    const { regexp, keys } = pathToRegexp(fullPath);
    const paramMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, controllerType, methodName);
    const httpMethods = this.mapMethodNames(methodNum);

    httpMethods.forEach(httpMethod => {
      this.routes.push({ target: instance, methodName, httpMethod, regex: regexp, keys, paramMetadata });
    });
  }

  /**
   * Dispatches an incoming IPC request to the matching controller method
   */
  public async dispatch(request: IpcRequest) {
    const { url, method } = request;
    const cleanUrl = url.replace(/^\/api/, '').replace(/\/$/, '') || '/';
    const httpMethod = method.toUpperCase();

    const route = this.routes.find(r => r.httpMethod === httpMethod && r.regex.test(cleanUrl));
    if (!route) throw new Error(`Route not found: ${httpMethod} ${cleanUrl}`);

    const routeParams = this.extractParams(route, cleanUrl);
    const args = this.resolveArgs(route, { ...request, routeParams });

    return await route.target[route.methodName](...args);
  }

  /**
   * Extracts path parameters from the URL
   */
  private extractParams(route: RouteHandler, url: string): Record<string, any> {
    const match = route.regex.exec(url);
    const params: Record<string, any> = {};
    if (match) {
      route.keys.forEach((key, i) => params[key.name] = match[i + 1]);
    }
    return params;
  }

  /**
   * Resolves arguments for the controller method based on NestJS metadata
   */
  private resolveArgs(route: RouteHandler, ctx: any): any[] {
    const args: any[] = [];
    if (!route.paramMetadata) return args;

    Object.keys(route.paramMetadata).forEach(key => {
      const [type, index] = key.split(':').map(Number);
      const { data: dataKey } = route.paramMetadata[key];

      switch (type) {
        case RouteParamtypes.BODY: args[index] = dataKey ? ctx.data?.[dataKey] : ctx.data; break;
        case RouteParamtypes.QUERY: args[index] = dataKey ? ctx.params?.[dataKey] : ctx.params; break;
        case RouteParamtypes.PARAM: args[index] = dataKey ? ctx.routeParams?.[dataKey] : ctx.routeParams; break;
        case RouteParamtypes.HEADERS: args[index] = dataKey ? ctx.headers?.[dataKey] : ctx.headers; break;
        case RouteParamtypes.REQUEST: args[index] = { ...ctx, user: ctx.headers?.user }; break;
      }
    });
    return args;
  }

  /**
   * Maps NestJS method number to HTTP method names
   */
  private mapMethodNames(num: number): string[] {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'ALL', 'OPTIONS', 'HEAD'];
    return num === 5 ? methods : [methods[num]];
  }
}
