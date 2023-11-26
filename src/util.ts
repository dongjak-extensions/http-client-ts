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
 * @return {string} 转换后的查询字符串
 */
export const objectToQueryString = (obj: { [key: string]: any }): string => {
    let str = '';
    for (let key in obj) {
        if (str !== '') {
            str += '&';
        }
        str += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }
    return str;
}

