/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
 *首页的道具和卡券列表
 * */
import React, {Component} from 'react'
import {
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import {filterPic} from '../../common/util'
import {sendClickPingback} from '../../common/pingback'
import DefaultImage from './DefaultImage'
import {TOUCH_NONE, TOUCH_LIGHT_MASK} from '../../constants/touchableStyle';
import WebImage from '../WebImage';

const itemWidth = (Width - 36) / 3
export default class extends Component {

  render() {
    const {list, allCode, index} = this.props
    const title = allCode[index + 1].partnerName
    return (
      <React.Fragment>
        <View style={styles.titleContent}>
          <Text style={styles.title}>{title}</Text>
          <TouchableWithoutFeedback {...TOUCH_LIGHT_MASK} onPress={this._press}>
            <View style={{flexDirection: 'row', marginRight: 13, alignItems: 'center'}}>
              <Text style={styles.moreText}>查看更多</Text>
              <WebImage name="912_home_arrow" style={{width: 12, height: 12, marginLeft: 4}} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 10
          }}
        >
          {list.slice(0, 6)
            .map(this.renderItem)}
        </View>
      </React.Fragment>
    )
  }
  _press = () => {
    const {
      goTo, allCode, index, list
    } = this.props
    const code = allCode[index + 1].partnerCode
    sendClickPingback('homeRN', '201200', `${code}_allgoods`);
    // const initialPage = index > -1 ? index + 2 : 0 // 商城前两个tab分别是 热门兑换 和 低价换购 位置固定
    goTo && goTo('ShoppingMall', {
      partnerCode: code,
      initialData: list
    })
  }
    // 点击道具详情
    clickHotItem = (item, index) => {
      const {
        goTo, openWeb, getUrl, allCode
      } = this.props
      const codeIndex = this.props.index + 1
      const code = allCode[codeIndex].partnerCode
      const clickEvent = item.exts && item.exts.filter(e => e.name === 'clickEvent')[0] &&
        item.exts.filter(e => e.name === 'clickEvent')[0].value
      sendClickPingback('homeRN', '201200', `${code}_${index + 1}`);
      if(item.url) {
        const _url = getUrl(item.url)
        openWeb(_url)
      } else if(clickEvent === 'h5') {
        const _url = item.exts.filter(e => e.name === 'h5')[0] &&
          item.exts.filter(e => e.name === 'h5')[0].value
        openWeb(_url)
      } else {
        goTo('GoodsDetail', {
          name: item.name,
          itemId: item.itemId,
          code: allCode[codeIndex].partnerCode
        })
      }
    }
    getColorDefalut = (value) => {
      // 简单匹配颜色。默认是 #号或者rgb开头就算
      if(/^(#|rgb)/.test(value)) {
        return value
      } else {
        return '#fff'
      }
    }
    renderItem = (item, index) => {
      const picMap = filterPic(item.photoList);
      const imgUri = picMap.movepic || picMap.smallpic || picMap.largepic;
      const {productTag} = item;
      return (
        <TouchableHighlight {...TOUCH_NONE} onPress={() => this.clickHotItem(item, index)} style={styles.item} key={index}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
            }}
          >
            <View style={styles.imageContent}>
              <DefaultImage
                source={imgUri}
                style={[styles.image, {opacity: (item.infinity === 0 && item.remain <= 0) ? 0.5 : 1}]}
                errorImageStyle={{
                  height: itemWidth * 0.708,
                  width: itemWidth * 0.708
                }}
              />
              {
                (item.infinity === 0 && item.remain <= 0) &&
                <View style={styles.solded}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 10
                     }}
                  >已兑完
                  </Text>
                </View>
              }
              {!!productTag &&
                <View style={[styles.tagContent, {backgroundColor: this.getColorDefalut(item.productTagColor)}]}>
                  <Text style={{color: '#fff', fontSize: 10}}>{productTag}</Text>
                </View>
            }
            </View>
            <View style={[styles.nameContent, {opacity: (item.infinity === 0 && item.remain <= 0) ? 0.5 : 1}]}>
              <Text
                numberOfLines={1}
                style={{
                fontSize: 14,
                color: '#333'
                }}
              >
                {item.title || item.name}
              </Text>
            </View>
            <View style={[styles.nameContent, {opacity: (item.infinity === 0 && item.remain <= 0) ? 0.5 : 1}]}>
              <Text
                numberOfLines={1}
                style={{
                fontSize: 12,
                color: '#FF5900'
                }}
              >
                {item.credits || item.score}积分
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  titleContent: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
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
    marginBottom: 7,
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
    top: ((itemWidth * 0.8407) - 45) / 2,
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
    justifyContent: 'center',
  },
  moreText: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular'
  }
})
