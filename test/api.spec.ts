import axios from "axios";
import {createApi, DefaultApiImpl, Get, Path, Post, RequestBody, RequestHeader} from "../index";

class TestApi extends DefaultApiImpl {

    // @ts-ignore
    @Post('/rest/zm_used_car/getPage')
    getPage(@RequestBody() _data: {}, @RequestHeader("occasion") _occasion: string = "default"): Promise<any> {
        return Promise.resolve( )
    }

    @Get('/enum/:key/getOptions')
    getOptions( @Path("key") key:string, @RequestHeader("occasion") _occasion: string = "default"): Promise<any> {
        return Promise.resolve()
    }
}

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
    }, "1111") )
    console.log(await carsApi.getOptions("color")    )
});
