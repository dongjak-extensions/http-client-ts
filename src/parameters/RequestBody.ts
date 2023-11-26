import {IApi, ParamType} from "../IApi";

/**
 * 这个装饰器用于声明一个请求体参数
 * ```js
 *    @Post('/rest/getPage')
 *     getPage<T>(@RequestBody() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 *
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function RequestBody() {
    return function (target: IApi, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}${ParamType.BODY}`;
        const requestBodyParams: {
            [key: string]: number
        } = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};

        requestBodyParams['request_body_index'] = parameterIndex;

        Reflect.defineMetadata(metadataKey, requestBodyParams, target, propertyKey);
    };
}
