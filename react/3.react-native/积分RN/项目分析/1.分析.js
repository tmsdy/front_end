/*

1.api/index.ts里面放的都是通用一些的请求
    1）components里面一般都是请求这里的
    2）别的页面用到一些通用的也是引这里

2.model层放的都是对应页面才有的请求，typings里面放model各页面的请求对应的接口类型
    1）model层包一层返回我们要的数据类型，在里面调api层请求然后model层处理数据并返回
        export const fetchPropsProductList = async (
            ...
        ): Promise<FetchPropsProductItem[]> => {
            let resData: FetchPropsProductItem[]
            请求：const {code, data} = await executeTask(requestHeader, requestBody)
            处理数据：...
            返回：return resData
        }
    2）

3.


*/