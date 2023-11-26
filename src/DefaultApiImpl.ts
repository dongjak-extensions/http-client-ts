import {IApi, ParamType} from "./IApi";

import HttpRequest from "luch-request";
import {AxiosInstance} from "axios";
import {objectToQueryString} from "./util";
import 'reflect-metadata'


/**
 * 默认的 API 实现
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export class DefaultApiImpl implements IApi {
    private readonly client: AxiosInstance | HttpRequest | undefined;


    constructor(client: AxiosInstance | HttpRequest | undefined) {
        this.client = client;
    }

    getParametersObj(type: ParamType, target: IApi, propertyKey: PropertyKey, ...args: any[]) {
        const paramObj: { [key: string]: string } = {}
        const metadataKey = `${propertyKey.toString()}${type}`;
        const pathParams: {
            [key: string]: number
        } = Reflect.getOwnMetadata(metadataKey, target, propertyKey as string) || {};


        for (const paramName in pathParams) {
            if (pathParams.hasOwnProperty(paramName)) {
                const paramIndex = pathParams[paramName];
                paramObj[paramName] = args[paramIndex];
            }
        }

        return paramObj
    }

    getRequestBodyParam(target: IApi, propertyKey: PropertyKey, ...args: any[]): any {
        const requestBodyParamsMetadataKey = `${propertyKey.toString()}${ParamType.BODY}`;
        const bodyParams: {
            [key: string]: number
        } = Reflect.getOwnMetadata(requestBodyParamsMetadataKey, target, propertyKey as string) || {};

        return args[bodyParams['request_body_index']]
    }

    buildFinalUrl(originUrl: string, target: IApi, propertyKey: PropertyKey, ...args: any[]) {
        let finalUrl = originUrl;
        const pathParamsObj = this.getParametersObj(ParamType.PATH, target, propertyKey, ...args)
        Object.keys(pathParamsObj).forEach((key) => {
            finalUrl = finalUrl.replace(`:${key}`, pathParamsObj[key]);
        })

        const queryParamsObj = this.getParametersObj(ParamType.QUERY, target, propertyKey, ...args)
        if (Object.keys(queryParamsObj).length > 0)
            finalUrl = finalUrl + "?" + objectToQueryString(queryParamsObj);
        return finalUrl
    }

    getClient(): AxiosInstance | HttpRequest | undefined {
        return this.client;
    }

}
