import axios, {
    AxiosAdapter,
    AxiosHeaders,
    AxiosPromise,
    AxiosResponse,
    InternalAxiosRequestConfig
} from "axios";
// @ts-ignore
import settle from "axios/unsafe/core/settle";
// @ts-ignore
import buildURL from "axios/unsafe/helpers/buildURL";
// @ts-ignore
import buildFullPath from "axios/unsafe/core/buildFullPath";
// @ts-ignore
import utils from "axios/unsafe/utils";

const {isUndefined, isFormData} = utils;

/**
 *
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
function isStandardBrowserEnv(): boolean {
    let product;
    if (
        typeof navigator !== "undefined" &&
        ((product = navigator.product) === "ReactNative" ||
            product === "NativeScript" ||
            product === "NS")
    ) {
        return false;
    }

    return typeof window !== "undefined" && typeof document !== "undefined";
}


export const fetchAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig): AxiosPromise => {
    const request = createRequest(config);
    const promises: Promise<any>[] = [getResponse(request, config)];

    if (config.timeout && config.timeout > 0) {
        promises.push(
            new Promise((res) => {
                setTimeout(() => {
                    const message = config.timeoutErrorMessage
                        ? config.timeoutErrorMessage
                        : "timeout of " + config.timeout + "ms exceeded";
                    res(createError(message, config, "ECONNABORTED", request));
                }, config.timeout);
            }),
        );
    }

    const data = await Promise.race(promises);
    return new Promise((resolve, reject) => {
        if (data instanceof Error) {
            reject(data);
        } else {
            // @ts-ignore
            Object.prototype.toString.call(config.settle) === "[object Function]"
                // @ts-ignore
                ? config.settle(resolve, reject, data)
                : settle(resolve, reject, data);
        }
    });
}

export const fetchResponseToAxiosResponse = async (fetchResponse: Response, config?: InternalAxiosRequestConfig, request?: any) => {
    const headers: Record<string, any> = {}
    fetchResponse.headers.forEach((value, key) => {
        headers[key] = value;
    })


    const response: AxiosResponse = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: AxiosHeaders.from(headers),
        config: config ?? {} as InternalAxiosRequestConfig,
        request: request,
        data: fetchResponse.body
    };

    if (fetchResponse.status >= 200 && fetchResponse.status !== 204 && config) {

        switch (config.responseType) {
            case "arraybuffer":
                response.data = await fetchResponse.arrayBuffer();
                break;
            case "blob":
                response.data = await fetchResponse.blob();
                break;
            case "json":
                response.data = await fetchResponse.json();
                break;
            case "stream":
                response.data = fetchResponse.body
                break
            default:
                response.data = await fetchResponse.text();
                break;
        }
    }

    return response
}

/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
async function getResponse(request: Request, config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    let fetchResponse: Response;
    try {
        fetchResponse = await fetch(request);
    } catch (e) {
        return createError("Network Error", config, "ERR_NETWORK", request);
    }

    // const mirror = fetchResponse.clone()

    return fetchResponseToAxiosResponse(fetchResponse, config, request);
}

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config: InternalAxiosRequestConfig) {
    const headers = new Headers(config.headers);

    // HTTP basic authentication
    if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password
            ? decodeURI(encodeURIComponent(config.auth.password))
            : "";
        headers.set("Authorization", `Basic ${btoa(username + ":" + password)}`);
    }

    const method = (config.method ?? "get").toUpperCase();
    const options: any = {
        headers: headers,
        method,
    };
    if (method !== "GET" && method !== "HEAD") {
        options.body = config.data;

        // In these cases the browser will automatically set the correct Content-Type,
        // but only if that header hasn't been set yet. So that's why we're deleting it.
        if (isFormData(options.body) && isStandardBrowserEnv()) {
            headers.delete("Content-Type");
        }
    }
    /*if (config.mode) {
        options.mode = config.mode;
    }
    if (config.cache) {
        options.cache = config.cache;
    }
    if (config.integrity) {
        options.integrity = config.integrity;
    }
    if (config.redirect) {
        options.redirect = config.redirect;
    }
    if (config.referrer) {
        options.referrer = config.referrer;
    }*/
    // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used
    if (!isUndefined(config.withCredentials)) {
        options.credentials = config.withCredentials ? "include" : "omit";
    }

    const fullPath: string = buildFullPath(config.baseURL, config.url);
    const url = buildURL(fullPath, config.params, config.paramsSerializer);

    // Expected browser to throw error if there is any wrong configuration value
    return new Request(url, options);
}

/**
 * Note:
 *
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 *
 *
 *
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function createError(message: string, config: InternalAxiosRequestConfig, code: string, request: Request, response?: any) {
    if (axios.AxiosError && typeof axios.AxiosError === "function") {

        return new axios.AxiosError(
            message,
            // @ts-ignore
            axios.AxiosError[code],
            config,
            request,
            response,
        );
    }

    const error = new Error(message);
    return enhanceError(error, config, code, request, response);
}

/**
 *
 * Note:
 *
 *   This function is for backward compatible.
 *
 *
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
function enhanceError(error: any, config: any, code: any, request: any, response: any) {
    error.config = config;
    if (code) {
        error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: this.config,
            code: this.code,
            status:
                this.response && this.response.status ? this.response.status : null,
        };
    };
    return error;
}
