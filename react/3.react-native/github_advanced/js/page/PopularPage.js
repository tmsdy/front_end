import React, { Component } from 'react';
import { FlatList, ActivityIndicator ,StyleSheet, Text, View ,RefreshControl} from 'react-native';
import {connect} from 'react-redux'
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'
import actions from '../action/index'
import NavigationUtil from '../navigator/NavigationUtil'
import PopularItem from '../common/PopularItem'
// import Toast from 'react-native-easy-toast'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = '#678'

type Props = {};
export default class PopularPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.tabNames = ["前端", "后端", "大数据", "人工智能", "区块链", "其他"]
  }
  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props=>
          <PopularTabPage //便于传参给每个tab对应的页面
              {...props}
              tabLabel={item}
            />,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }
  render() {
    
    const TopTabNavigator = createMaterialTopTabNavigator(
      this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          scrollEnabled: true, //设置可以滚动
          style: {
            backgroundColor: '#999'
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }
    )
    let TopTabContainer = createAppContainer(TopTabNavigator)
    return  <TopTabContainer />
  }
}
const pageSize = 10 ;//设置常量防止修改
class PopularTab extends Component<Props> {
  constructor(props){
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
  }
  componentDidMount() {
    this.loadData()
  }
  loadData(loadMore){
    let {onRefreshPopular,onLoadMorePopular} = this.props
    let storeName = this.storeName
    let url = this.genFetchUrl(storeName)
    let store  = this._store()
    if(loadMore){
      // debugger
      console.log(storeName,store)
      onLoadMorePopular(storeName,++store.pageIndex,pageSize,store.items,callback=>{
        // this.refs.toast.show('没有更多了')
        console.log('没有更多了')
      })
    }else{
      // debugger
      onRefreshPopular(storeName,url,pageSize)
    }
    
  }
  /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    // console.log(store)
    if (!store) {
        store = {
            items: [],
            isLoading: false,
            pageIndex: 1 ,
            hideLoadingMore: true,//默认隐藏加载更多
        }
    }
    return store;
  }
  genFetchUrl(key){
    return URL+key+QUERY_STR
  }
  renderItem(data){
    const {item} = data
    return <PopularItem 
            items={item}
            onSelect={()=>{
              NavigationUtil.goPage({
                projectModels: item
              }, 'DetailPage')
            }}
          />
  }
  genIndicator(){
    return this._store().hideLoadingMore
      ? null
      : <View style={styles.indicatorContainer}>
        <ActivityIndicator 
          style={styles.indicator}
          />
          <Text>正在加载更多</Text>
      </View>
  }
  render() {
    const { popular } = this.props
    // let store = popular[this.storeName] //动态获取store
    let store = this._store()
    // console.log(store)
    if(!store) {
      store = {
        items: [],
        isLoading: false
      }
    }
    return (
      <View style={styles.container}>
        <FlatList 
          data={store.projectModels}
          renderItem={data=>this.renderItem(data)}
          keyExtractor={item=>""+item.id}
          refreshControl={
            <RefreshControl 
              title={'Loading'}
              titleColor={TITLE_COLOR}
              colors={[TITLE_COLOR]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={TITLE_COLOR}
              />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached = {()=>{
            console.log('触底了')
            if(this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
              this.loadData(true)
            },100)
          }}
          onEndReachedThreshold={0.5}
        />
        {/* <Toast ref={'toast'} position={'center'}/> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  popular: state.popular
})
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName,url,pageSize) => dispatch(actions.onRefreshPopular(storeName,url,pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack))
})
// connect可以这样灵活运用
const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab) //高阶函数

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {

  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});