async onEndReached() {
    let { total, fileList, pageN, refreshing } = this.state
    if (total <= fileList.length) { //initData时候会走这里
        return
    } else {
        console.log('处理 onEndReached', total, fileList, pageN)
        await this.setStateAsync({
            refreshing: true,
            pageN: pageN + 1
        })
        let list = await this.getList()
        this.setState({
            refreshing: false,
            fileList: [...fileList, ...list]
        })
        this.forceUpdate()
    }
}
renderFileItem = ({ item, index }) => {
    return jsx
}
<FlatList
    style={styles.fileList}
    data={fileList} //传入的数据列表
    refreshing={true} //支持refreshControl
    keyExtractor={({ fileSize, createDate }) => fileSize ? fileSize + createDate : createDate}// key
    onEndReached={this.onEndReached.bind(this)} //触底加载更多
    renderItem={this.renderFileItem} //渲染的每一个Item
    ListEmptyComponent={this.ListEmptyComponent} //没有数据的展示
    ListFooterComponent={this.ListFooterComponent} //底部没数据的展示
    onEndReachedThreshold={0.1} // 距离底部占屏幕高度的10%时候触发触底事件
    refreshControl={ // 刷新加载控件
        <RefreshControl
            refreshing={refreshing}
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor={"#ffffff"}
            onRefresh={this._onRefresh} //下拉刷新
        />
    }
/>