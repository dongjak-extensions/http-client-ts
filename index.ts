import {AxiosInstance} from "axios";
import HttpRequest from "luch-request";
import {IApi} from "./src/IApi";

export const createApi = <T extends new (...args: any) => IApi>(api: T, client: HttpRequest | AxiosInstance) => {

    const instance = new api(client);
  /*  const prototype = Object.getPrototypeOf(instance);
    const methods = Object.getOwnPropertyNames(prototype)
        .filter((method) => method !== 'constructor');
    const apiInstance = methods.reduce((acc, method) => {
        const originalMethod = prototype[method];
        acc[method] = function (...args: any[]) {
            return originalMethod.apply(this, args);
        }
        return acc;
    }, {} as any);*/

    return instance as InstanceType<T>;
}


export * from './src/methods/Get'
export * from './src/methods/Post'
export * from './src/methods/Delete'
export * from './src/parameters/Path'
export * from './src/parameters/Query'
export * from './src/parameters/Config'
export * from './src/parameters/Body'
export * from './src/parameters/Header'
export * from './src/DefaultApiImpl'
export * from './src/IApi'
export * from './src/util'
