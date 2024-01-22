import {IApi, ParamType} from "../IApi";

/**
 * 这个装饰器用于声明一个配置参数,在实际发送请求时,会将配置参数的值作为请求的配置参数
 *
 * ```js
 *    @Post('/rest/:entity/getPage')
 *     getPage<T>(@Config("responseType") responseType: string,@RequestBody() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 * @param paramName 参数名
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function Config() {
    return function (target: IApi, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}${ParamType.CONFIG}`;
        const requestBodyParams: {
            [key: string]: number
        } = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};

        requestBodyParams['axios_config_index'] = parameterIndex;

        Reflect.defineMetadata(metadataKey, requestBodyParams, target, propertyKey);
    };
}
