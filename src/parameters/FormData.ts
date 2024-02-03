import {IApi, ParamType} from "../IApi";


export type FormDataParameter = {
    parameterIndex: number
    fileProps: string[]
}

/**
 * 这个装饰器用于修饰一个参数,在提交时会转换成[FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)然后使用`application/x-www-form-urlencoded`格式提交
 * ```js
 *    @Post('/rest/getPage')
 *     getPage<T>(@FormData() queryPayload: IQueryPayload): Promise<JsonResponse<IPage<T>>> {
 *         return undefined as any
 *     }
 * ```
 *
 * @author dongjak
 * @since 1.0
 * @date 2023/10/18
 */
export function FormData(fileProps: string[] = ["files", "file"]) {
    return function (target: IApi, propertyKey: string | symbol, parameterIndex: number) {
        const metadataKey = `${propertyKey.toString()}${ParamType.FORM_DATA}`;
        let formDataParameter: FormDataParameter = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || {};
        formDataParameter.parameterIndex = parameterIndex;
        formDataParameter.fileProps = fileProps;
        Reflect.defineMetadata(metadataKey, formDataParameter, target, propertyKey);
    };
}
