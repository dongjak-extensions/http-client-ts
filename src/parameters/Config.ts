/**
 * 这个装饰器用于声明一个配置参数,在实际发送请求时,会将配置参数的值作为请求的配置参数
 *
 * ```js
 *    @Post('/rest/:entity/getPage')
 *     getPage<T>(@Config("responseType") responseType: string, @RequestBody() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 *
 * @param paramName 参数名
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function Config(paramName: string) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}_config_params`;
        const configParams: { [key: string]: number } = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};

        configParams[paramName] = parameterIndex;

        Reflect.defineMetadata(metadataKey, configParams, target, propertyKey);
    };
}
