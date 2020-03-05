//让异步操作顺序进行
runAsync1()
    .then((res) => {
        console.log(res);
        return runAsync2();
    })
    .then((res) => {
        console.log(res);
        return runAsync3();
    })
    .then((res) => {
        console.log(res);
    });

function runAsync1() {
    var p = new Promise(function (resolve, reject) {
        //做一些异步操作
        setTimeout(function () {
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;
}
function runAsync2() {
    var p = new Promise(function (resolve, reject) {
        //做一些异步操作
        setTimeout(function () {
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });
    return p;
}
function runAsync3() {
    var p = new Promise(function (resolve, reject) {
        //做一些异步操作
        setTimeout(function () {
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });
    return p;
}