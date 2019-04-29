	// 底层是按照 ASCII 码大小排序的
    var arr = [ 4,3,5,5,76,2,0,8 ];
    arr.sort();
    console.log( arr ); //0 2 3 4 5 5 76 8 sort默认把这些变成字符串在排序
    
    arr.sort( ( a, b )=>{
        return a - b; //从小到大，如果是b-a就是从大到小
    });
    
    console.log( arr ); //0 2 3 4 5 5 8 76
    
    let arr2 = [
        {num : 5},
        {num : 2},
        {num : 1},
        {num : 4},
        {num : 3}
    ] ;
    
    arr2.sort( ( a, b )=> {
        return a.num - b.num; 
    });
    console.log( arr2 ); 