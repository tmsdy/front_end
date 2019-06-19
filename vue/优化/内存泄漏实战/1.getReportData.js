/*
由于return中保留了当前实例引起的内存泄漏，然后promise里面又需要用到this
所以这里要把function变成箭头函数
*/
function getReportData(x) {
    // let that = this
    return new Promise(function (resolve, reject) {
        var param = this.$route.query
        let data = {}
        var from = (this.blockData.currentPage - 1) * this.blockData.pageSize
        if (x != undefined) {
            data = x
        } else {
            data = {
                reportId: param.selected,
                from: from,
                size: this.blockData.pageSize
            }
        }
    }
}