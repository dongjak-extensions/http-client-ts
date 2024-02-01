import {IApi, ParamType} from "../IApi";

/**
 * 这个装饰器用于标记一个方法使用`Delete`请求
 * ```js
 *    @Get('/rest/:entity/getPage')
 *     getPage<T>(@Path("entity") entity: string): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 *
 * @param url 请求的路径
 * @param mockOnFail    当请求失败时，使用这个值作为返回值
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function Delete(url: string, mockOnFail?: any) {
    return function (target: IApi, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            return new Promise((resolve, reject) => {
                originalMethod.apply(this, args).then(() => {
                    let finalUrl = target.buildFinalUrl(url, target, propertyKey, ...args)
                    const headers = target.getParametersObj(ParamType.HEADER, target, propertyKey, ...args)
                    const config = target.getClientConfig(target, propertyKey, ...args)
                    if(config&&config.url)  finalUrl= target.buildFinalUrl(config.url  , target, propertyKey, ...args)
                    //@ts-ignore
                    this.getClient().delete(finalUrl, {
                        headers,
                        ...config,
                    }).then((res: any) => {
                        resolve(res)
                    }).catch((e: any) => {
                        if (mockOnFail) {
                            resolve(mockOnFail)
                        } else
                            reject(e)
                    })
                });
            });
        }
    }
}
