/*
由于return中保留了当前实例引起的内存泄漏，然后promise里面又需要用到this
所以这里要把function变成箭头函数
function getReportData(x) {
    let that = this
    return new Promise(function (resolve, reject) {
        var param = that.$route.query
        that...
    }
}
=>
function getReportData(x) {
    return new Promise( (resolve, reject) => {
        var param = that.$route.query
        that...
    }
}
*/
