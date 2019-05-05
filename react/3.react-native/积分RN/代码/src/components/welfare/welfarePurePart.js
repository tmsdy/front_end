/**
 * 福利活动页
 */
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  Text,
  View,
  Image
} from '@iqiyi/rn-ui';
import {
  Width
} from '@iqiyi/rn-utils'
import {filterArray, filterPic} from '../../common/util'
import WebImage from '../../components/WebImage'
import {sendClickPingback} from '../../common/pingback'
import ShadowButton from './shadowButton'
import DefaultImage from '../home/DefaultImage'

export default class extends PureComponent {
  render() {
    return (
      <React.Fragment>
        {
          this._renderGetVip()
        }
        {
          this._renderProduct()
        }
        {
          this._renderRule()
        }
      </React.Fragment>
    )
  }
  openPage(URL, index) {
    sendClickPingback('huixue', 160400, `hx_zy${index + 1}`)
    const {openWeb} = this.props
    openWeb && openWeb(URL)
  }
  // 入口
  _renderGetVip() {
    const {qipuList} = this.props
    return (
      <View style={styles.itemBg} >
        <WebImage style={[styles.itemBgImage, styles.itemBg]} name="912_wefare_item_bg" />
        <WebImage style={styles.itemTitle} name="912_hym"/>
        <View style={styles.getVipContent}>
          <Text style={styles.shareScore}>每天都有机会获得VIP会员，更多活动尽在爱奇艺积分</Text>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 296,
              marginTop: 10
            }}
          >
          {
            qipuList.map((item, index) => {
              return this._renderVipImage(item, index)
            })
          }
          </View>
        </View>
      </View>
    )
  }
  openMorePro = () => {
    const {goTo, partnerCode} = this.props
    goTo && goTo('ShoppingMall', {
      partnerCode
    })
  }
  goToDetail(id, name) {
    const {goTo} = this.props
    goTo && goTo('GoodsDetail', {
      itemId: id,
      name
    })
  }
  _renderVipImage(item, index) {
    const URL = filterArray(item.key_value_pair, 'URL', 'value')
    return (
      <TouchableOpacity key={index} activeOpacity={1} style={styles.iconImage} onPress={() => { this.openPage(URL, index) }}>
        <Image style={styles.iconImage} source={{uri: item.thumbnail_url}} />
      </TouchableOpacity>
    )
  }
  // 规则说明
  _renderRule() {
    return (
      <View style={styles.ruleContent}>
        <View style={styles.ruleTitleContent}>
          <View style={styles.line}/>
          <Text style={{fontSize: 13, color: '#3030B5'}}>规则说明</Text>
          <View style={styles.line}/>
        </View>
        <View style={styles.ruleText}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.textNum}><Text style={styles.text}>1.</Text></View>
            <Text style={styles.text}><Text style={{color: 'transparent'}}>2. </Text>回血包领取条件：积分值低于100，每用户仅可领取1次；</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.textNum}><Text style={styles.text}>2.</Text></View>
            <Text style={styles.text}><Text style={{color: 'transparent'}}>2. </Text>分享得积分规则：好友从你分享出去的页面，点击进入爱奇艺活动页，成功领取积分礼包，你即可领取88积分，每天最多领取10次；</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.textNum}><Text style={styles.text}>3.</Text></View>
            <Text style={styles.text}><Text style={{color: 'transparent'}}>2. </Text>任务翻倍卡规则：领取翻倍卡后3天内有效，仅针对部分任务翻倍，具体时效与翻倍任务可在领取成功后，在任务列表上查看；</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.textNum}><Text style={styles.text}>4.</Text></View>
            <Text style={styles.text}><Text style={{color: 'transparent'}}>2. </Text>若发现作弊行为，爱奇艺有权直接取消相关资格，严重者将进行封号处理。</Text>
          </View>
        </View>
      </View>
    )
  }
  // 产品列表
  _renderProduct = () => {
    const {productList} = this.props
    if(!productList || !productList.length) return null
    return (
      <View style={[styles.itemBg, {marginTop: -(0.7327 * Width - 230)}]}>
        <WebImage style={[styles.itemBgImage, styles.itemBg, {top: 35}]} name="912_wefare_item_bg" />
        <WebImage style={styles.itemTitle} name="101_xfl"/>
        <View style={styles.productContent}>
          <Text style={[styles.shareScore, {marginBottom: 20}]}>热门兑换商品直降价，翻倍卡有效期间无限兑换</Text>
          {
            !!productList && !!productList.length && productList.slice(0, 4).map(this.renderProductItem)
          }
        </View>
        <ShadowButton onPress={this.openMorePro} style={{bottom: 20}} text="查看更多商品"/>
      </View>
    )
  }
  renderProductItem = (item) => {
    const picMap = filterPic(item.photoList);
    const imgUri = picMap.movepic || picMap.smallpic || picMap.largepic || '';
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => { this.goToDetail(item.itemId, item.name) }}>
        <WebImage name="101_qiang" style={styles.pitem}>
          <View style={styles.leftContent}>
            <DefaultImage
              source={imgUri}
              style={styles.leftImage}
              errorImageStyle={styles.leftImage}
            />
            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: '#333',
                  marginTop: 10,
                  fontWeight: '700'
                }}
              >
                {item.title || item.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 10,
                  color: '#FF5C98',
                  marginTop: 5
                }}
              >
                福利价:<Text style={{fontSize: 14, fontWeight: '700'}}> {item.newUserScore}</Text>积分
              </Text>
              <View style={{height: 14, justifyContent: 'center'}}>
                <View style={{height: 14, justifyContent: 'center', position: 'absolute'}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 10,
                      color: '#999999'
                    }}
                  >
                    {item.score}积分
                  </Text>
                  <View style={styles.grayline}/>
                </View>
              </View>
            </View>
          </View>
        </WebImage>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  itemTitle: {
    width: 320,
    height: 30
  },
  itemBg: {
    width: Width,
    minHeight: 0.7327 * Width,
    alignItems: 'center',
    marginTop: 0.067 * Width
  },
  itemBgImage: {
    position: 'absolute',
    left: 0,
    top: -(0.067 * Width),
  },
  iconImage: {
    width: 95,
    height: 120,
  },
  getVipContent: {
    width: 320,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3030B5',
    paddingTop: 11,
    backgroundColor: '#6A64FE',
    height: 175,
    alignItems: 'center',
    paddingHorizontal: 0
  },
  shareScore: {
    color: '#3030B5',
    fontSize: 11,
    fontWeight: '600'
  },
  ruleContent: {
    alignItems: 'center',
    marginBottom: 35,
  },
  ruleText: {
    width: 280,
  },
  ruleTitleContent: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    color: '#3030B5',
    lineHeight: 18.5,
    fontFamily: 'PingFangSC-Regular',
  },
  line: {
    width: 68,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#6A64FE',
    marginHorizontal: 10,
  },
  textNum: {
    position: 'absolute'
  },
  productContent: {
    width: 320,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3030B5',
    paddingTop: 11,
    backgroundColor: '#6A64FE',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingBottom: 40,
    marginBottom: 40,
    minHeight: 0.7327 * Width,
  },
  pitem: {
    width: 275,
    height: 90,
    borderRadius: 7,
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  leftContent: {
    width: 215,
    height: 80,
    flexDirection: 'row',
    overflow: 'hidden',
    flexGrow: 1,
    marginTop: 5
  },
  leftImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginLeft: 5
  },
  grayline: {
    position: 'absolute',
    height: StyleSheet.hairlineWidth,
    left: 0,
    top: 7,
    width: '100%',
    backgroundColor: '#999999'
  }
})
