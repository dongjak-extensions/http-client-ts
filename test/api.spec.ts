import axios, {AxiosResponse} from "axios";
import {
    createApi,
    DefaultApiImpl,
    Get,
    Path,
    Post,
    Body,
    Header,
    objectToQueryString,
    Query,
    Delete,
    FormData
} from "../index";
import * as fs from "fs";


type GetPaymentMethodsForm = {
    gatewayType?: string;
    scene?: string;
};
type ChatRequestBody = {
    msg: string
    sessionId: string
    robotId: string
    files: File[]  | File
}

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


    @Delete('/api/assistant/session/:sessionId')
    deleteSession(@Path("sessionId") sessionId: string): Promise<AxiosResponse> {
        return Promise.resolve() as any;
    }


    @Post("/api/assistant/chat")
    chat(@FormData(["files"]) body: ChatRequestBody): Promise<any> {
        return Promise.resolve() as any;
    }
}

test("testFormData", async () => {
    // const fs = require('fs');

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
    const buffer = fs.readFileSync('C:\\Users\\cruld\\Desktop\\汽车租赁合同.docx');
    const blob = new Blob([buffer], {type: "application/octet-stream"});
    const file = new File([blob], "汽车租赁合同.docx")
    console.log((await carsApi.chat({
        robotId: "1",
        sessionId: "1",
        msg: "hello",
        files: [file]
    })).data)
})
test("deleteSession", async () => {
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
    console.log((await carsApi.deleteSession("thread_wgfBfC1QLaoqAd9Bt1bCFbmn")).data)
})
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
        baseURL: "http://localhost:8084/",
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
