/**
 * 这个装饰器用于声明一个请求头参数
 * ```js
 *    @Post('/rest/getPage')
 *     getPage<T>(@Header("entity") entity: string, @RequestBody() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 *
 * @param paramName 参数名
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function RequestHeader(paramName: string) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}_header_params`;
        const headerParams: { [key: string]: number } = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};

        headerParams[paramName] = parameterIndex;

        Reflect.defineMetadata(metadataKey, headerParams, target, propertyKey);
    };
}
