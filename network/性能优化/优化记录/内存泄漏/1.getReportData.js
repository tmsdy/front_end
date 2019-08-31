/*
由于return中保留了当前实例引起的内存泄漏，然后promise里面又需要用到this
所以这里要把function变成箭头函数
function getReportData(x) {
    let that = this
    return new Promise(function (resolve, reject) {
        var param = that.$route.query
        let data = {}
        var from = (that.blockData.currentPage - 1) * that.blockData.pageSize
        if (x != undefined) {
            data = x
        } else {
            data = {
                reportId: param.selected,
                from: from,
                size: that.blockData.pageSize
            }
        }
    }
}
*/
