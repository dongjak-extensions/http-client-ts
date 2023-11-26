# 简介
用``ts``写的声明式http客户端
```ts

class TestApi implements Api {

    // @ts-ignore
    @Post('rest/zm_used_car/list')
    submitToStoreArrangement(@RequestBody() _data: {}): Promise<any> {
        return undefined as any
    }
}


const Axios = axios.create({
    baseURL: "http://localhost:8081/",
    timeout: 1000 * 10,
    responseType: 'json',
})
//await Axios.get("http://localhost:8081")
const carsApi = createApi(TestApi, Axios)
// console.log(carsApi)
const res = await carsApi.submitToStoreArrangement({
    "pageNo": 1,
    "pageSize": 10
})
```
