// 1.匹配搜索
filteredCustomerArray() {
    return this.customerArray.filter((item, i) => {
        return item.custName.search(this.searchText) != -1
    })
}