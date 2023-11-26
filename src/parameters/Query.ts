/**
 * 这个装饰器用于定义一个查询参数
 *
 * ```js
 *    @Post('/rest/getPage')
 *     getPage<T>(@Query("entity") entity: string, @RequestBody() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 * @param paramName 参数名
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function Query(paramName: string) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}_query_params`;
        const queryParams: { [key: string]: number } = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};

        queryParams[paramName] = parameterIndex;

        Reflect.defineMetadata(metadataKey, queryParams, target, propertyKey);
    };
}
