/*

箭头函数也不能滥用，滥用的多了可读性就差了
不要用的地方：
    1.构造函数声明
    2.较长多语句函数表达式
    3.需要词法名称标识符（递归等）函数

this问题：

var controller = {
    makeRequest: (...)=>{ //这里的this是指向window的
        this.helper(...)
    },
    helper:(...)=>{

    }
}

 */