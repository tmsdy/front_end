import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, RefreshControl } from 'react-native'
import { px2dp, scaleY, SCREEN_WIDTH, SCREEN_HEIGHT, isIOS } from '~/libs/utils'
import Api from '~/libs/api'
import { BaseURL } from '~/libs/config'
import { Drawer, Toast } from '@ant-design/react-native'
import MyIcons from '~/Icon'
import http from '~/libs/http'
import TouchItem from '~/components/TouchItem'
import CompRedux from './CompRedux'

interface Props {
}

interface State {
    showOff: boolean,
    total: number,
    refreshing: boolean,
    from: number,
    pageSize: number,
    kehuList: any,
    searchVal: string
}

export default class DrawerSelect extends Component<Props, State> {
    drawer: any
    state: State = {
        showOff: false,
        refreshing: true,
        total: 10,
        from: 0,
        pageSize: 20,
        kehuList: [],
        searchVal: ''
    }

    constructor(props: Props) {
        super(props)
    }

    componentDidMount() {
        CompRedux.subscribe('DrawerSelect', ({ showOff }) => {
            this.setState({ showOff }, async () => {
                if (showOff) {
                    this.drawer && this.drawer.openDrawer()
                    let list = await this.getKehuList()
                    this.setState({
                        refreshing: false,
                        kehuList: list
                    })
                }
            })
        })
    }

    setStateAsync = (state: any) => {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    onOpenChange = (showOff: boolean) => {
        if (!showOff) {
            CompRedux.close()
            this.setState({
                showOff: false,
                total: 10,
                from: 0,
                pageSize: 20
            })
        }
    }

    onChangeText = (text: string) => {
        this.setState({
            searchVal: text
        })
    }

    comfirmSearch = () => {
        // console.log('comfirmSearch')
        let { searchVal } = this.state
        this.getKehuList(searchVal)
            .then(list => {
                console.log('list==', list)
                this.setState({
                    from: 0,
                    kehuList: list
                })
            })
    }

    comfirmSelect(item) {
        CompRedux.select(item)
        this.drawer && this.drawer.closeDrawer()
    }

    async getKehuList(keywords?: string) {
        let { from, pageSize } = this.state
        // console.log(from)
        let data = {
            moduleCode: 'BF001',
            order: 'desc',
            from: from,
            size: pageSize,
            sort: 'createDate',
            searchType: 'list',
            keywords: ''
        }
        if (keywords) {
            data.keywords = keywords
            data.from = 0
        }
        this.setState({
            refreshing: true,
        })
        return http.get(BaseURL + Api.v2.document_generalOperate_get, data).then((res) => {
            // console.log(res)
            if (res.code === '0') {
                this.setState({
                    from: from + pageSize,
                    total: res.data.totalNum,
                    refreshing: false
                })
                return res.data.list
            } else {
                Toast.fail(res.msg)
                return []
            }
        })
    }

    async onEndReached() {
        let { total, kehuList, from, pageSize } = this.state
        if (total <= kehuList.length || from < pageSize) {
            return
        } else {
            await this.setStateAsync({
                refreshing: true
            })
            let list = await this.getKehuList()
            this.setState({
                refreshing: false,
                kehuList: [...kehuList, ...list]
            })
            this.forceUpdate()
        }
    }

    renderItem = ({ item }) => {
        return <TouchItem pressColor="#fff" key={item.custId}
            onPress={this.comfirmSelect.bind(this, item)}>
            <View style={styles.kehuItem}>
                <Text style={styles.black14}>{item.custName}</Text>
            </View>
        </TouchItem>
    }

    ListFooterComponent = () => {
        let { kehuList, total } = this.state
        return (
            kehuList && kehuList.length > 10 && total <= kehuList.length ?
                <View style={styles.noData}>
                    <Text style={styles.gray12}>没有更多了</Text>
                </View> : null
        )
    }

    async _onRefresh() {
        // console.log('_onRefresh')
    }

    render() {
        let { showOff, refreshing, kehuList } = this.state
        // console.log('showOff==', showOff)
        const sidebar = (
            <View style={styles.drawerWrapper}>
                <View style={styles.inputWrapper}>
                    <MyIcons name="sousuo" style={styles.searchIcon} />
                    <TextInput style={styles.inputItem} placeholder="搜索"
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.comfirmSearch}
                        returnKeyType="search"
                    />
                </View>
                <FlatList
                    data={kehuList}
                    refreshing={true}
                    onEndReached={this.onEndReached.bind(this)}
                    renderItem={this.renderItem}
                    ListEmptyComponent={<Text style={styles.black14}>什么都没有了</Text>}
                    ListFooterComponent={this.ListFooterComponent}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor={"#ffffff"}
                            onRefresh={this._onRefresh}
                        />
                    }
                />
            </View>
        );
        return (
            <View style={showOff ? styles.container : { display: 'none' }} >
                <Drawer
                    sidebar={sidebar}
                    position="right"
                    open={false}
                    onOpenChange={this.onOpenChange}
                    drawerRef={el => (this.drawer = el)}
                    drawerBackgroundColor="#ccc"
                >
                </Drawer>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT - (isIOS ? px2dp(63 * scaleY) : px2dp(86)),
        width: SCREEN_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.4)',
        position: 'absolute',
        bottom: 0,
        zIndex: 300
    },
    drawerWrapper: {
        paddingLeft: px2dp(16),
        paddingRight: px2dp(8),
        paddingBottom: px2dp(110),
        height: SCREEN_HEIGHT,
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    inputItem: {
        flex: 1,
        padding: 0,
        marginLeft: px2dp(4),
        marginRight: px2dp(16),
    },
    inputWrapper: {
        height: px2dp(40),
        fontSize: px2dp(16),
        borderRadius: px2dp(44),
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px2dp(10),
    },
    searchIcon: {
        fontSize: px2dp(18),
        marginLeft: px2dp(16)
    },
    kehuItem: {
        height: px2dp(50),
        borderBottomWidth: px2dp(1),
        borderBottomColor: 'rgba(246,246,246,1)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    noData: {
        height: px2dp(60),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gray12: {
        fontSize: px2dp(12),
        color: '#909399'
    },
    black14: {
        color: '#323233'
    },
})