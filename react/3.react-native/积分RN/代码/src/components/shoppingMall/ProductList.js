/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
 *整合页的道具展示
 * */
import React, {Component} from 'react'
import {View, StyleSheet, DeviceEventEmitter} from 'react-native'
import {Image, ActivityIndicator, Text} from '@iqiyi/rn-ui'
import {Width, isIOS} from '@iqiyi/rn-utils'
import QYNewList from '@iqiyi/rn-new-list'
import {DeviceModule} from '@iqiyi/rn-base-modules'
import {executeTask} from '../../api'
import {filterPic, filterArray, blockDownload, goToLogin, roundFun} from '../../common/util'
import {EmptyPage, NetError, LoginContent, CustomEmptyPage} from './EmptyPage'
import DefaultImage from '../home/DefaultImage'
import {sendClickPingback} from '../../common/pingback'
import WebImage from '../WebImage'
import Bottom from '../homePage/Bottom'
import {Operation} from './Operation'

const itemWidth = (Width - 35) / 2
const itemHeight = 225

export default class extends Component {
  constructor(props) {
    super(props)
    // const {allCode, codeIndex} = this.props
    const {taskCode = 'daojuProductList'} = this.props
    this.state = {
      // codeIndex,
      // allCode, // 商品渠道码列表
      loaded: false, // 默认是未加载网络
      data: null,
      showLoginView: taskCode === 'daojuProductAvailable' && !global.USER_INFO.isLogin,
      netInfo: 0 // 0 表示正常，1表示断网，2表示有网但是错误
    }
    this.imageStyle = {height: 90, width: 90}
    this.listener = null
    // this.soledStyle = {top: 22.5, left: 22.5}
  }

  componentDidMount() {
    this.checkStatus()
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    const {netInfo, showLoginView} = this.state
    if(showLoginView) {
      return <LoginContent onPress={goToLogin} />
    }
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {this._renderContent()}
        {netInfo !== 0 && <NetError netInfo={netInfo} retry={this._retry} />}
      </View>
    )
  }

  listenLogin = () => {
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      if(isLogin) {
        this.setState(
          {
            showLoginView: false
          },
          () => {
            this._init()
          }
        )
      }
    })
  }

  checkStatus = () => {
    const {showLoginView} = this.state
    if(!showLoginView) {
      // 可兑需要登录才能查看
      this._init()
    } else {
      this.listenLogin()
    }
  }

  _renderHeader = () => {
    const {codeIndex} = this.props
    const hasOperation = this.hasOperation()
    return (codeIndex === 0 && hasOperation) && (
      <Operation {...{operationList: this.props.operationList, openWeb: this.props.openWeb, goTo: this.props.goTo}} />
    )
  }

  _renderFooter = () => {
    return <Bottom containerStyle={{marginTop: 25, marginBottom: 15}} content="积分商城合作：tp_park@qiyi.com" showArrow={false} />
  }

  _renderContent = () => {
    const {data, loaded, netInfo} = this.state
    const newData = data ? this.filterData(data) : null

    if(netInfo === 0 && newData && newData.length > 0) {
      let content = null

      if(isIOS) {
        content = <QYNewList dataList={newData} renderRow={this.renderRow} cellHeight={itemHeight} renderHeader={this._renderHeader} renderFooter={this._renderFooter} />
      } else {
        content = <QYNewList dataList={newData} renderRow={this.renderRow} renderHeader={this._renderHeader} renderFooter={this._renderFooter} />
      }

      return content

    }

    if(loaded && netInfo === 0) {
      return this.props.partnerCode === 'kedui' ? <CustomEmptyPage btnOnPress={() => this.props.goTo('HomePage')} /> : <EmptyPage />
    }
    if(netInfo === 0) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator text="内容即将呈现..." />
        </View>
      )
    }
    return null
  }

  _init = () => {
    DeviceModule.getDeviceInfo()
      .then((data) => {
        const {networkType} = data
        this.setState(
          {
            netInfo: networkType === 'disconnect' ? 1 : 0
          },
          () => {
            if(this.state.netInfo !== 1) {
              this._getDaojuItems()
            }
          }
        )
      })
      .catch(() => {
        this._getDaojuItems()
      })
  }

  _retry = () => {
    this.setState(
      {
        loaded: false,
        netInfo: 0
      },
      () => {
        this._init()
      }
    )
  }

  // 获取数据
  _getDaojuItems = () => {
    // const {allCode, codeIndex} = this.state
    const {taskCode = 'daojuProductList', partnerCode: requestCode} = this.props
    const requestBody = {}
    if(taskCode === 'daojuProductList') {
      requestBody[taskCode] = {
        vertical_code: 'iQIYI',
        partner_code: requestCode,
        platform: isIOS ? '2_22_221' : '2_22_222',
        need_ext: true,
        user_id: global.USER_INFO.userId
      }
    } else if(taskCode === 'daojuProductAvailable') {
      requestBody[taskCode] = {
        vertical_code: 'iQIYI',
        partner_tag: '移动端任务中心',
        platform: isIOS ? '2_22_221' : '2_22_222',
        need_ext: true,
        user_id: global.USER_INFO.userId,
        money_type: 'point',
        agentversion: global.COMMON_PARAMS.agentversion,
        appver: global.COMMON_PARAMS.appver
      }
    }
    const requestHeader = {
      task_code: taskCode,
      timestamp: Date.now()
    }
    return executeTask(requestHeader, requestBody)
      .then((data) => {
        if(data.code === 'A00000') {
          // 所有商品都需要屏蔽下载
          this.setState({
            data: blockDownload(data.data),
            loaded: true,
            netInfo: 0
          })
        } else {
          this.setState({
            loaded: true,
            netInfo: 0
          })
        }
      })
      .catch(() => {
        this.setState({
          netInfo: 2
        })
      })
  }

  _press = () => {}

  filterData = (data) => {
    const newLength = Math.ceil(data.length / 2)
    let index = 0
    const newArr = []
    for(index; index < newLength; index++) {
      const item = [
        {
          index: index * 2,
          data: data[index * 2]
        },
        {
          index: index * 2 + 1,
          data: data[index * 2 + 1]
        }
      ]
      newArr.push(item)
    }
    return newArr
  }

  // 点击道具详情
  clickItem = (item, i, index, rowID) => {
    const {goTo, openWeb, partnerCode, codeIndex} = this.props
    const clickEvent = item.exts && item.exts.filter(e => e.name === 'clickEvent')[0] && item.exts.filter(e => e.name === 'clickEvent')[0].value
    let pingbackIndex = 1
    if(isIOS) {
      pingbackIndex = i + 2 * rowID + 1
    } else {
      pingbackIndex = i + 2 * index + 1
    }
    sendClickPingback('allgoods', `11010${codeIndex + 1}`, `all_${partnerCode}_${pingbackIndex}`)
    if(clickEvent === 'h5') {
      const _url = item.exts.filter(e => e.name === 'h5')[0] && item.exts.filter(e => e.name === 'h5')[0].value
      openWeb(_url)
    } else {
      goTo('GoodsDetail', {
        name: item.name,
        itemId: item.itemId,
        code: partnerCode,
        from: 'allgoods'
      })
    }
  }

  // salesNum字段处理
  fotmatSalesNum = (num) => {
    if(!num) return null
    const reg = new RegExp('^(?!00)(?:[0-9]{1,4}|9999)$')
    if(reg.test(num)) return `${num}人已兑`
    return `${roundFun(num / 10000, 2)}万人已兑`
  }

  _renderItem = (item, i, index, rowID) => {
    // 是否售罄
    const solded = item.infinity === 0 && item.remain <= 0
    const goodscor = !!item.exts && filterArray(item.exts, 'goodscor', 'value')
    const scorsize = !!goodscor && JSON.stringify(goodscor) !== '{}' && item.exts.length && filterArray(item.exts, 'scorsize', 'value')
    const size = /(\d+)\*(\d+)/.exec(scorsize.toString())
    const iconWidth = !!size && JSON.stringify(size) !== '{}' && size[1] && parseInt(size[1], 10) / 2
    const iconHeight = !!size && JSON.stringify(size) !== '{}' && size[2] && parseInt(size[2], 10) / 2
    const picMap = filterPic(item.photoList)
    const defaultImage = picMap.movepic || picMap.smallpic
    const movepicStyle = this.imageStyle
    const movepicSoldStyle = this.soledStyle
    // 新增兑换人数字段salesNum
    const fotmatSalesNum = this.fotmatSalesNum(item.salesNum)
    // 是否是新用户（newUser）以及是否配置新用户价格(newUserScore)
    const isNew = item.newUser && item.newUserScore
    // item距离顶部的高度
    const hasItemTop = this.hasItemTop(index)
    const keyIndex = isIOS ? rowID : index
    return (
      <QYNewList.Button
        onPress={() => {
          this.clickItem(item, i, index, rowID)
        }}
        key={`all_shopgoods${i + 2 * keyIndex}`}
      >
        <View style={[styles.item, hasItemTop && {paddingTop: 35 / 2}]}>
          <View style={[styles.imageWrap]}>
            <DefaultImage source={defaultImage} style={[styles.image, {opacity: solded ? 0.5 : 1}, movepicStyle]} errorImageStyle={{height: 63, width: 63}} />
            {!!solded && (
              <View style={[styles.solded, movepicSoldStyle]}>
                <Text style={{color: '#fff', fontSize: 10}}>已兑完</Text>
              </View>
            )}
            {item.productTag ? (
              <View
                style={[
                  {position: 'absolute', bottom: 5, left: 5, borderRadius: 2.5, height: 19, justifyContent: 'center', alignItems: 'center', paddingLeft: 3.5, paddingRight: 3.5},
                  {backgroundColor: item.productTagColor}
                ]}
              >
                <Text style={{color: '#fff', fontSize: 10}}>{item.productTag}</Text>
              </View>
            ) : null}
            {!!goodscor && <Image source={{uri: goodscor}} style={{width: iconWidth, height: iconHeight, position: 'absolute', top: 0, right: 3}} />}
          </View>
          <View style={[styles.nameContent, {opacity: solded ? 0.5 : 1, marginBottom: 3}]}>
            <Text numberOfLines={1} style={{fontSize: 14, color: '#333', textAlign: 'left'}}>
              {item.title || item.name}
            </Text>
          </View>
          <View style={[styles.nameContent, {opacity: solded ? 0.5 : 1}]}>
            {isNew ? (
              <WebImage name="new_user_price_bg" style={{width: 26, height: 14, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 17 / 2, color: '#FFFFFF'}}>福利</Text>
              </WebImage>
            ) : null}
            <Text numberOfLines={1} style={{fontSize: 12, color: '#FF5900'}}>
              {(isNew ? item.newUserScore : null) || item.credits || item.score}积分{item.price ? `+${item.price / 100}元` : ''}
            </Text>
            {fotmatSalesNum ? <Text style={{fontSize: 12, color: '#999'}}>{fotmatSalesNum}</Text> : null}
          </View>
        </View>
      </QYNewList.Button>
    )
  }

  // item是否需要顶部高度
  hasItemTop = (index) => {
    const hasOperation = this.hasOperation()
    if(this.props.codeIndex !== 0) return index === 0 || index === 1
    return !hasOperation
  }

  // 是否有运营位
  hasOperation = () => {
    const {operationList = []} = this.props
    if(operationList.length === 0) return false
    return (operationList[0].length > 0 || operationList[1].length > 0)
  }

  renderRow = ({data = []}, title, index, rowID) => {
    return (
      <View style={styles.container}>
        {data.map((item, i) => {
          if(item.data) {
            return this._renderItem(item.data, i, index, rowID)
          }
          return null
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: Width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 13,
    paddingRight: 13
  },
  imageWrap: {
    width: 170,
    height: 160,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    marginBottom: 4.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: '#F9F9F9'
  },
  item: {
    width: itemWidth,
    paddingBottom: 13,
    alignItems: 'center',
    // backgroundColor:'red'
  },
  borderLeft: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#E3E3E3'
  },
  nameContent: {
    width: itemWidth,
    height: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 7
  },
  solded: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerBox: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
