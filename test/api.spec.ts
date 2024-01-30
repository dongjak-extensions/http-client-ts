import axios, {AxiosResponse} from "axios";
import {createApi, DefaultApiImpl, Get, Path, Post, Body, Header, objectToQueryString, Query} from "../index";

type GetPaymentMethodsForm = {
    gatewayType?: string;
    scene?: string;
};

class TestApi extends DefaultApiImpl {

    // @ts-ignore
    @Post('/rest/zm_used_car/getPage')
    getPage(@Body() _data: {}, @Header("occasion") _occasion: string = "default"): Promise<any> {
        return Promise.resolve()
    }

    @Get('/enum/:key/getOptions')
    getOptions(@Path("key") key: string, @Header("occasion") _occasion: string = "default"): Promise<any> {
        return Promise.resolve()
    }

    @Get('/unified_pay/methods')
    getMethods(@Query("form") form: GetPaymentMethodsForm): Promise<AxiosResponse> {
        return Promise.resolve() as any;
    }
}

test("getMethods", async () => {
    const Axios = axios.create({
        baseURL: "http://localhost:8084/",
        timeout: 1000 * 10,
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMzI3MTk3Njg1OSIsImlhdCI6MTcwNjU1NzUzMSwiZXhwIjoxNzA3MTYyMzMxfQ.ABGXugPtycUSH8UOa7zjYetv7ZuTiTLEueG5tBr11jk"
        },
        responseType: 'json',
    })
    //await Axios.get("http://localhost:8084/unified_pay/methods")
    const carsApi = createApi(TestApi, Axios)
    console.log(await carsApi.getMethods({
        gatewayType: "WECHATPAY"
    }))
})
test("objectToQueryString", async () => {
    expect(objectToQueryString({
        a: 1,
        b: undefined,
        c: {
            d: 1
        }
    })).toBe("a=1&d=1")

    expect(objectToQueryString({
        username: "dongjak",
        password: "123456"
    })).toBe("username=dongjak&password=123456")
})
test('simpleFunction returns correct value', async () => {
    // expect(1==1);
    const Axios = axios.create({
        baseURL: "http://localhost:8082/",
        timeout: 1000 * 10,
        responseType: 'json',
    })
    //await Axios.get("http://localhost:8081")
    const carsApi = createApi(TestApi, Axios)
    //const carsApi = new TestApi(Axios)
    //console.log(carsApi.getClient())
    console.log(await carsApi.getPage({
        "pageNo": 1,
        "pageSize": 10
    }, "1111"))
    console.log(await carsApi.getOptions("color"))
});
