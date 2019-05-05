/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
 * 积分商城
 * */
import React from 'react'
import {View, TouchableHighlight, StatusBar} from 'react-native'
import {connect} from 'react-redux';
import ScrollTabView, {ScrollableTabBar} from '@iqiyi/rn-scroll-tab-view-beta'
import {Text} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'

import BasePage from '../components/BasePage'
import NavBar from '../components/DefaultNavBar'
import BaseStyleSheet from '../common/BaseStyleSheet'

import ProductList from '../components/shoppingMall/ProductList'
import IntergralShop from '../components/shoppingMall/IntergralShop'

import {executeTask} from '../api/index'
import {hideLoading} from '../common/QYNativeBridge'
import {sendPagePingback, sendClickPingback} from '../common/pingback'
import {TOUCH_TEXT_ACTIVE} from '../constants/touchableStyle'
import {formatQipuData} from '../common/util'

const TAB_WIDTH = 64 + 12.5 * 2

@(connect(({scoreInfo}) => ({totalScore: scoreInfo.totalScore}), null) as any)
export default class ShoppingMall extends BasePage {
  pageName = 'allgoods'

  constructor(props) {
    super(props)
    const {params}: any = this.props.navigation.state || {}
    this.state = {
      initialPage: (params && params.initialPage) || 0,
      initialData: (params && params.initialData) || [],
      initialCode: (params && params.partnerCode) || null, // 通过编码匹配序号
      allCode: [],
      operationList: [],
      hideTabLine: params && params.initialPage === 0
    }
  }

  componentDidMount() {
    isIOS && StatusBar.setBarStyle('dark-content', true)
    sendPagePingback(this.pageName, {score: this.props.totalScore})
    this.getData()
    hideLoading()
  }

  getData = async () => {
    try {
      const [data1, data2] = await Promise.all([this.getShopMallData(), this.getDaojuQudaoCode()])
      const operationList = this.handleData1(data1)
      const result = this.handleData2(data2)
      this.setState({operationList, ...result})
    } catch(error) {
      //
    }
  }

  handleData1(data) {
    const {resource_container: list = []} = data
    return formatQipuData(list) || []
  }

  handleData2(param = {}) {
    const {code = '', data = []}: any = param
    const {initialCode} = this.state
    if(code === 'A00000' && !!data.length) {
      if(initialCode) {
        const index = data
          .map((item) => {
            return item.partnerCode
          })
          .indexOf(initialCode)
        return {allCode: data, initialPage: index > 0 ? index + 1 : 0}
      }
      return {allCode: data}
    }
  }

  getDaojuQudaoCode = () => {
    const requestHeader = {
      task_code: 'daojuPartnerList',
      timestamp: Date.now()
    }
    const requestBody = {
      daojuPartnerList: {
        vertical_code: 'iQIYI',
        tag: '移动端任务中心'
      }
    }
    return executeTask(requestHeader, requestBody)
  }

  // 获取积分商城运营位数据
  getShopMallData() {
    const requestHeader = {
      task_code: 'qipu_page_shopmall',
      timestamp: Date.now()
    }
    return executeTask(requestHeader)
  }

  // 兑换记录页
  _goToHistory = () => {
    this.goTo('MyGain')
  }

  _renderRightView = () => {
    return (
      <View style={{height: 44, justifyContent: 'center'}}>
        <TouchableHighlight {...TOUCH_TEXT_ACTIVE} onPress={this._goToHistory}>
          <Text style={{color: '#666', fontSize: 14}}>我的收获</Text>
        </TouchableHighlight>
      </View>
    )
  }

  sendPingback = (param) => {
    const index = param.i
    // from 10.3.5 优化tab 点击（gongteng）
    sendClickPingback('allgoods', `11010${index + 1}`, `allgoods_tab${index + 1}`)
  }

  render() {
    const {initialPage, allCode, initialData, operationList, hideTabLine} = this.state
    const params = {
      openWeb: this.openWeb,
      goTo: this.goTo,
      initialData,
      operationList
    }
    if(allCode && !allCode.length) {
      return null
    }
    if(allCode && !allCode.length) {
      return null
    }
    return (
      <View style={{flex: 1}}>
        <NavBar title="积分商城" backPress={this.back} backgroundColor="#fff" titleColor="#333" type="black" renderRightView={this._renderRightView} rightViewWidth={70} />
        <ScrollTabView
          initialPage={initialPage}
          scrollWithoutAnimation={true}
          style={{
            flex: 1,
            backgroundColor: '#fff'
          }}
          onChangeTab={(param) => {
            this.setState({hideTabLine: param.i === 0})
            this.sendPingback(param)
          }}
          renderTabBar={() => {
            return (
              <ScrollableTabBar
                initialPage={initialPage}
                tabsContainerStyle={{}}
                tabStyle={styles.tabStyle}
                textStyle={{fontSize: 16}}
                activeTextColor="#FF7E00"
                inactiveTextColor="#333333"
                style={[styles.tabBarStyle, hideTabLine && {borderBottomWidth: 0}]}
                underlineWidth={12}
                underlineStyle={{
                  width: 12,
                  height: 3,
                  borderRadius: 8.5,
                  backgroundColor: '#FF7E00',
                  marginBottom: 8,
                  marginLeft: (TAB_WIDTH - 12) / 2
                }}
              />
            )
          }}
        >
          <ProductList tabLabel="为你精选" {...params} partnerCode={allCode[0].partnerCode} allCode={allCode} codeIndex={0} />
          <IntergralShop tabLabel="积分购物" {...params} partnerCode="gouwu" />
          {allCode.slice(1, allCode.length).map((item, index) => {
            return (
              <ProductList
                type={item.partnerCode}
                tabLabel={item.partnerName}
                {...params}
                allCode={allCode}
                codeIndex={index + 2}
                partnerCode={item.partnerCode}
                key={item.partnerCode}
              />
            )
          })}
          <ProductList tabLabel="我能兑换" {...params} partnerCode="kedui" allCode={allCode} codeIndex={1} taskCode="daojuProductAvailable"/>

        </ScrollTabView>
      </View>
    )
  }
}

const styles = BaseStyleSheet.create({
  tabStyle: {
    width: TAB_WIDTH,
    height: 54,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: 0,
    paddingRight: 0,
  },
  tabBarStyle: {
    borderColor: '#EEEEEE',
    borderWidth: 0,
    paddingLeft: 2.5,
    borderBottomWidth: 1,
    height: 55,
    backgroundColor: '#ffffff'
  }
})
