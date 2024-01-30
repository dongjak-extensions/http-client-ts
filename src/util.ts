/**
 * 把一个对象转换成查询字符串
 *
 * ```js
 *
 * const obj = {
 *    name: 'dongjak',
 *    age: 18
 *    }
 * objectToQueryString(obj)
 *
 * // name=dongjak&age=18
 * ```
 * @param obj 要转换的对象
 * @param rootStr 根字符串
 * @return {string} 转换后的查询字符串
 */
export const objectToQueryString = (obj: { [key: string]: any }, rootStr = ""): string => {
    Object.keys(obj).filter(k=> obj[k]).forEach(key=>{
        if (rootStr !== ''  ) {
            rootStr += '&';
        }

        if (obj[key] instanceof Object) {
            rootStr += objectToQueryString(obj[key]);
        } else if (obj[key]) {
            rootStr += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
        }
    })


    return rootStr;
}

