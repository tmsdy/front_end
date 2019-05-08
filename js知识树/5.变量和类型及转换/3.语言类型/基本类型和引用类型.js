/*

js变量：
    基本类型值：undefined,null,boolean,number,string **按值访问**，因为可以操作保存在变量中实际的值
    引用类型值：可能由多个值构成的对象，js语言不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间
            所以是在操作对象的引用而不是实际对象。为此引用类型值是按引用访问的

*/
// 动态添加属性   ----------------------------
// 引用类型：可添加
    var person = new Object() ;
    person.name = "feifei" ;
    console.log(person.name) ; //feifei

// 基本类型：不可添加
    var name = "feifei" ;
    name.age = 27 ;
    console.log(name.age) //undifined

// 复制变量值   ----------------------------
// 引用类型 obj1和obj2都指向同一个对象(堆中)，改变一个，另一个也会改变
    var obj1 = new Object() ;
    var obj2 = obj1 ;
    obj1.name = "feifei" ;
    console.log(obj2.name) ; //feifei

// 基本类型 num1和num2完全独立，互不影响
    var num1 = 5 ;
    var num2= num1 ;
    num1 = 12 ;
    console.log(num2) ; //5
