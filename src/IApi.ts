import {AxiosInstance} from "axios";
import HttpRequest from "luch-request";
import {FormDataParameter} from "./parameters/FormData";

export enum ParamType {
    PATH = "_path_params",
    QUERY = "_query_params",
    HEADER = "_header_params",
    BODY = "_request_body",
    CONFIG = "_client_config",
    FORM_DATA = "_form_data"
}

/**
 * 表示一个 API
 *
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export interface IApi {
    getClient(): AxiosInstance | HttpRequest | undefined
    getFormDataParam(target: IApi, propertyKey: PropertyKey, ...args: any[]): FormData
    getRequestBodyParam(target: IApi, propertyKey: PropertyKey, ...args: any[]): { [key: string]: any }
    getClientConfig(target: IApi, propertyKey: PropertyKey, ...args: any[]): { [key: string]: any }

    getParametersObj(type: ParamType, target: IApi, propertyKey: PropertyKey, ...args: any[]): { [key: string]: string }

    buildFinalUrl(originUrl: string, target: IApi, propertyKey: PropertyKey, ...args: any[]): string
}
