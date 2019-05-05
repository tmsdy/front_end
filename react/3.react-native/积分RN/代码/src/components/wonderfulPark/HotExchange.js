/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
 * 道具后生活精选
 * */
import React, {PureComponent} from 'react'
import {StyleSheet, TouchableHighlight, View} from 'react-native'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {Text} from '@iqiyi/rn-ui'
import {BASE_URL, GET_ENV} from '../../constants/configs'
import DefaultImage from '../home/DefaultImage'
import {createUrl, filterPic, lessText} from '../../common/util'
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle'
import {sendClickPingback} from '../../common/pingback'
import {getDaojuData} from '../../model/wonderfulPark'
import TabTitle from './TabTitle'
import {CONTENT_PADDING_HORIZONTAL} from './constants'
import {getHotExchangeClickPingback, HOT_EXCHANGE_BLOCK, HOT_EXCHANGE_LOOK_MORE_CLICK, PARK_PAGE} from './pingback'

const itemWidth = (DEVICE_WIDTH - 36) / 3
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      partnerCode: ''
    }
  }

  componentDidMount() {
    // get礼包专区
    this._getDaojuData()
  }

  render() {
    return !this.state.list.length ? null : (
      <React.Fragment>
        <View style={styles.titleWrapper}>
          <TabTitle showLookMore={true} title="超值热兑" onPress={this._press} />
        </View>
        <View style={styles.container}>
          <View style={styles.inner}>
            {this.state.list.map((item, index) => {
              const picMap = filterPic(item.photoList)
              const source = picMap.movepic || picMap.smallpic
              return (
                <TouchableHighlight {...TOUCH_LIGHT_MASK} onPress={() => this.goToDetail(item, index)} style={styles.item} key={item.itemId}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <View style={styles.imageContent}>
                      <DefaultImage
                        source={source}
                        style={[styles.image, {opacity: item.infinity === 0 && item.remain <= 0 ? 0.5 : 1}]}
                        errorImageStyle={{
                          height: itemWidth * 0.708,
                          width: itemWidth * 0.708
                        }}
                      />
                      {item.infinity === 0 && item.remain <= 0 && (
                        <View style={styles.solded}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 10
                            }}
                          >
                            已兑完
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={[styles.nameContent, {opacity: item.infinity === 0 && item.remain <= 0 ? 0.5 : 1}]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          color: '#333'
                        }}
                      >
                        {lessText(item.title || item.name)}
                      </Text>
                    </View>
                    <View style={[styles.nameContent, {opacity: item.infinity === 0 && item.remain <= 0 ? 0.5 : 1}]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: '#FF5900'
                        }}
                      >
                        {item.credits || item.score}积分{item.price ? `+${item.price / 100}元` : ''}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        </View>
      </React.Fragment>
    )
  }

  getUrl(url) {
    const params = {
      uid: global.USER_INFO.userId,
      credits: this.state.totalScore,
      timestamp: Date.now(),
      appKey: 'basic_h5',
      dbredirect: url
    }
    const exemptUrl = `${BASE_URL.community[GET_ENV()]}/score/exemptLogin`
    return createUrl(exemptUrl, params)
  }

  // 基偶数样式不同
  getDiyStyle = (index) => {
    if(index % 2 !== 0) {
      return {
        backgroundColor: '#f9f9f9'
      }
    }
  }

  goToDetail = (item, index) => {
    sendClickPingback(PARK_PAGE, HOT_EXCHANGE_BLOCK, getHotExchangeClickPingback(index + 1))
    const clickEvent = item.exts && item.exts.filter(e => e.name === 'clickEvent')[0] && item.exts.filter(e => e.name === 'clickEvent')[0].value

    if(item.url) {
      const _url = this.getUrl(item.url)
      this.props.openWeb(_url)
    } else if(clickEvent === 'h5') {
      const _url = item.exts.filter(e => e.name === 'h5')[0] && item.exts.filter(e => e.name === 'h5')[0].value

      this.props.openWeb(_url)
    } else {
      this.props.goTo('GoodsDetail', {
        name: item.name,
        itemId: item.itemId,
        code: this.state.partnerCode
      })
    }
  }

  _press = () => {
    sendClickPingback(PARK_PAGE, HOT_EXCHANGE_BLOCK, HOT_EXCHANGE_LOOK_MORE_CLICK)
    this.props.goTo('ShoppingMall', {
      initialPage: 0
    })
  }

  _getDaojuData = async () => {
    const {list, partnerCode} = await getDaojuData()
    this.setState({list, partnerCode})
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10
  },
  titleWrapper: {
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopColor: '#F9F9F9',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#F9F9F9'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 20
  },
  item: {
    width: itemWidth,
    marginHorizontal: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7
  },
  moreButton: {
    backgroundColor: '#F9F9F9',
    width: 230,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 17
  },
  imageContent: {
    width: itemWidth,
    height: itemWidth * 0.8407,
    marginBottom: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 4
  },
  image: {
    width: itemWidth * 0.708,
    height: itemWidth * 0.708
  },
  nameContent: {
    width: itemWidth,
    height: 18,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  solded: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: (itemWidth * 0.8407 - 45) / 2,
    left: (itemWidth - 45) / 2,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tagContent: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    borderRadius: 2.5,
    height: 19,
    paddingHorizontal: 3.5,
    justifyContent: 'center'
  },
  moreText: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular'
  }
})
