var point:{
    x:number ,
    y:number ,
    z?:number //表示z可有可无
} ;

point = {x:12 ,y:11} ; //可以
point = {x:12 ,y:11,z:13} ; //可以
point = {x:12} //不行