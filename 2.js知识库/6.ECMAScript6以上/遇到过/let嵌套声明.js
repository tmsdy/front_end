let a = 1 ;
    arr = [1,2,3] ;

    for(let a =0 ; a<2 ;a++){//正常没报错
        console.log(a) // 报错 a未定义
        let a = 7 ;
        console.log(a)
    } ;

    arr.forEach(item => {
        let a = 1 ;//不报错
        item += a ;//不改变arr数组
        console.log(item) ;
    });
    console.log(arr)