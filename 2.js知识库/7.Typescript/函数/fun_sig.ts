function ajax(
    url:string,
    success:(res:string,code:number)=>void, //接收两个参数并且无返回值(函数签名)
    error:(code:number)=>void)
{

}

ajax(
    '1.txt',
    function(str:string,code:number){

    },
    function(code:number){

    }
)