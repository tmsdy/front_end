/** *
 * 我的收获页面
 */
import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import ScrollTabView, {ScrollableTabBar} from '@iqiyi/rn-scroll-tab-view-beta'
import {Text, Touchable} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import {GET_ENV, FeedBack, Helper} from '../constants/configs'
import NavBar from '../components/DefaultNavBar'
import OrderList from '../components/MyGain/OrderList'
import WebImage from '../components/WebImage'
import {hideLoading} from '../common/QYNativeBridge'
import BasePage from '../components/BasePage';
import {sendPagePingback} from '../common/pingback';

export default class MyGain extends BasePage<{}, {}> {

  pageName = 'integral_gains'

  state = {

  }

  componentDidMount() {
    hideLoading()
    sendPagePingback(this.pageName);
  }

  componentWillUnmount() {
    // this.hardwareBackSubscription && this.hardwareBackSubscription.remove();
  }

  _state = {
    // 使用状态（1：未使用，2：已使用）
    productStatusList: [
      {
        productStatus: 1,
        tabName: '未使用',
        id: 1
      },
      {
        productStatus: 2,
        tabName: '已使用',
        id: 2
      }
    ]
  }

  // 跳转反馈页面
  _goToFeedBack() {
    const feedbackUrl = FeedBack[GET_ENV()]
    this.openWeb(feedbackUrl)
  }

  // 兑换记录地址url
  getHelperUrl() {
    return `${Helper[GET_ENV()]}`
  }

  _goToConvertRecord = () => {
    const url = this.getHelperUrl()
    this.openWeb(url)
  }

  _renderRemindInfo = () => {
    return (
      <View style={styles.remindInfo}>
        <TouchableOpacity onPress={() => this._goToConvertRecord()}>
          <Text style={styles.remindText}>
            {'找不到已有的兑换记录？点这里 >'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderScrollTabView() {
    const {productStatusList} = this._state
    return (
      <ScrollTabView
        scrollWithoutAnimation={true}
        style={{
          flex: 1,
          backgroundColor: '#fff'
        }}
        onChangeTab={this.onChangeTab}
        renderTabBar={this.renderTabBar}
      >
        {productStatusList.map((item) => {
          const props = {
            productStatus: item.productStatus,
            openWeb: this.openWeb,
            goTo: this.goTo
          }
          return (
            <OrderList
              ref={(ref) => {
                this.orderListRef = ref
              }}
              {...props}
              tabLabel={item.tabName}
              key={item.id}
            />
          )
        })}
      </ScrollTabView>
    )
  }

  onChangeTab = (param: {i: number}) => {
    const productStatus = param.i === 0 ? 1 : 2
    const type = 'changeTab'
    if(this.orderListRef && this.orderListRef.isChangeUsedTab) {
      // 没有切换到过已使用tab(切换到已使用tab1次以上) 不执行次方法
      this.orderListRef.onRefresh(type, productStatus)
    }
  }

  renderTabBar = () => {
    return (
      <ScrollableTabBar
        textStyle={{fontSize: 16, fontWeight: 'normal', marginBottom: 4}}
        activeTextColor="#FF6600"
        inactiveTextColor="#333333"
        tabsContainerStyle={{width: (Width - 70)}}
        style={styles.tabBarStyle}
        tabStyle={styles.tabStyle}
        underlineWidth={12}
        underlineStyle={{
          width: 12,
          height: 3,
          borderRadius: 8.5,
          backgroundColor: '#FF7E00',
          marginBottom: 15 / 2,
          marginLeft: (Width - 94) / 4
        }}
      />
    )
  }

  // 头部左边视图
  _renderLeftView() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.headerLeft}
        onPress={() => this.back()}
      >
        <WebImage name="back" style={styles.headerLeftIcon} />
      </TouchableOpacity>
    )
  }

  // 头部中间视图
  _renderCenterView = () => {
    return (
      <View style={styles.headerCenter}>
        <Text style={styles.headerCenterText}>我的收获</Text>
      </View>
    )
  }

  // 头部右边视图
  _renderRightView() {
    return (
      <View style={{height: 44, justifyContent: 'center'}}>
        <Touchable onPress={() => this._goToFeedBack()}>
          <Text style={styles.headerRight}>反馈</Text>
        </Touchable>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <NavBar
          title="我的收获"
          backPress={this.goBack}
          backgroundColor="#FF7E00"
          titleColor="#FFFFFF"
          renderLeftView={() => this._renderLeftView()}
          renderCenterView={() => this._renderCenterView()}
          renderRightView={() => this._renderRightView()}
        />
        {this._renderRemindInfo()}
        {this._renderScrollTabView()}
      </View>
    )
  }

goBack = () => {
    try {
      const showVipCardModalIfNeeded = this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.showVipCardModalIfNeeded
      showVipCardModalIfNeeded && showVipCardModalIfNeeded()
    } catch(e) {
  // do nothing
    }
    this.back()
  }

  setupBackPress() {
    this.goBack()
  }
}

const styles = StyleSheet.create({
  headerCenter: {
    alignItems: 'center'
  },
  headerCenterText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#FFFFFF'
  },
  headerRight: {
    color: '#fff',
    fontSize: 14
  },
  remindInfo: {
    height: 35,
    justifyContent: 'center',
    paddingLeft: 15,
    backgroundColor: '#FFF7EA'
  },
  remindText: {
    fontSize: 12,
    color: '#FF7E00'
  },
  tabStyle: {
    height: 45,
    width: (Width - 70) / 2,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: 0,
    paddingRight: 0,
  },
  tabBarStyle: {
    borderColor: '#E3E3E3',
    borderWidth: 0,
    paddingLeft: 35,
    paddingRight: 35,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 45,
    backgroundColor: '#ffffff'
  },
  headerLeft: {
    paddingLeft: 15
  },
  headerLeftIcon: {
    width: 11,
    height: 20
  }
})
