/*
1.加空格：
    1）参数的逗号后：
         <OrderListProps, OrderListState>
        {fetchUserOrders, fetchOrderDetail}

    2）=> 的前后

    3）(){}之间：
        if(data.size < size) {
            loadMore = false
        }

    4）

2.接口的key的:后面有空格，结尾有分号
    newUrl: string;

3. Type assertion on object literals is forbidden, use a type annotation instead
    正确：onChangeTab = (param: {i: number}) => {}
    错误：onChangeTab = (param = {} as {i: number}) => {}

    正确：orderDetailInfo: {} as unknown as OrderDetailInfo,
    错误：orderDetailInfo: {} as OrderDetailInfo,
    
4.缺少分号：Expected a semicolon
    正确：as {data: any; message: string}
    错误：as {data: any, message: string}

*/
