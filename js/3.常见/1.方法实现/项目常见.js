// 1.匹配搜索
const filteredCustomerArray = () => {
    return this.customerArray.filter((item, i) => {
        return item.custName.search(this.searchText) != -1
    })
}