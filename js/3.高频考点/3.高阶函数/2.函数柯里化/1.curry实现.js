/*
1.柯里化行为规范
    1）逐步接收参数，并缓存供后期计算使用
    2）不立即计算，延后执行
    3）符合计算的条件，将缓存的参数，统一传递给执行方法

*/

var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]

function curry(fn){
    return function judge(...args){
        if(args.length === fn.length){ // fn("a", "b", "c")
            return fn(...args)
        }else{
            return function(arg){
                return judge(...args, arg)
            }
        }
    }
}




