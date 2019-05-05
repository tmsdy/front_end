import React, {Component} from 'react'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text
} from '@iqiyi/rn-ui';
import {Width, isIOS} from '@iqiyi/rn-utils';
import {executeTask} from '../../api/index'
import {filterPic} from '../../common/util'
import DefaultImage from '../home/DefaultImage'

const itemWidth = (Width - 42) / 2;
const itemHeight = itemWidth * 0.83;

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proList: []
    }
    this.getList()
  }
  render() {
    const {proList} = this.state;
    return (
      <React.Fragment>
        {
          !!proList.length
          &&
          <React.Fragment>
            <View style={styles.titleContent}>
              <Text
                style={{
                  lineHeight: 50, fontSize: 16, color: '#333', marginLeft: 20, fontWeight: 'bold'
                }}
              >
                精品推荐
              </Text>
            </View>
            <View style={styles.content}>
              {
                proList.map(this._renderItem)
              }
            </View>
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
  getList() {
    const {product_id: productId, partner_code: partnerCode} = this.props;
    const requestHeader = {
      task_code: 'daojuProductRecommend',
      timestamp: Date.now(),
    }

    const requestBody = {
      daojuProductRecommend: {
        vertical_code: 'iQIYI',
        platform: isIOS ? '2_22_221' : '2_22_222',
        version: global.COMMON_PARAMS.version,
        user_id: global.USER_INFO.userId,
        product_id: productId,
        partner_code: partnerCode
      }
    }

    executeTask(requestHeader, requestBody).then((d) => {
      if(d.code === 'A00000') {
        this.setState({
          proList: d.data
        })
      }
    })
  }

  goDetail(name, itemId, index) {
    if(index < 10) {
      this.props.recommendPingBack(index)
    }
    const {goTo} = this.props
    goTo && goTo('GoodsDetail', {
      name,
      itemId
    })
  }

  _renderItem = (item, index) => {
    const {
      itemId, name, credits, score, photoList, remain, infinity, productTag
    } = item
    const picMap = filterPic(photoList)
    const uri = picMap.movepic || picMap.smallpic || picMap.largepic || 'http://www.iqiyipic.com/common/fix/h5-aura/iqiyi-logo.png'
    return (
      <TouchableOpacity key={index} activeOpacity={1} onPress={() => { this.goDetail(name, itemId, index) }}>
        <View key={index} style={{width: itemWidth, marginBottom: 9}}>
          <View style={styles.item}>
            <DefaultImage
              source={uri}
              style={{width: 119, height: 119, opacity: (infinity === 0 && remain <= 0) ? 0.5 : 1}}
              errorImageStyle={{
                height: 119,
                width: 119
              }}
            />
            {
              (infinity === 0 && remain <= 0) &&
              <View style={styles.solded}>
                <Text style={{
                  color: '#fff',
                  fontSize: 10
                }}
                >
                已兑完
                </Text>
              </View>
            }
            {
              !!productTag
              &&
              <View style={[styles.tagContent, {backgroundColor: item.productTagColor}]}>
                <Text style={{color: '#fff', fontSize: 10}}>{productTag}</Text>
              </View>
            }
          </View>
          <Text numberOfLines={1} style={styles.title}>{name}</Text>
          <View style={styles.priceBox}>
            <Text style={{color: '#ff6600', fontSize: 12}}>{credits || score}积分</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  titleContent: {
    flex: 1,
    borderTopColor: '#EEE',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FFF',
    height: 50,
    marginTop: 15
  },
  content: {
    width: Width,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    paddingBottom: 23,
  },
  item: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 4,
    backgroundColor: '#fbfbfb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#333',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 7.2,
  },
  priceBox: {
    height: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  solded: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: (itemHeight - 45) / 2,
    left: (itemWidth - 45) / 2,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
