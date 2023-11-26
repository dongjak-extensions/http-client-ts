/**
 * 这个装饰器用于声明一个路径参数
 *
 * ```js
 *    @Post('/rest/:entity/getPage')
 *     getPage<T>(@Path("entity") entity: string, @RequestBody() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 *
 * @param paramName 参数名
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function Path(paramName: string) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}_path_params`;
        const pathParams: { [key: string]: number } = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};

        pathParams[paramName] = parameterIndex;

        Reflect.defineMetadata(metadataKey, pathParams, target, propertyKey);
    };
}
