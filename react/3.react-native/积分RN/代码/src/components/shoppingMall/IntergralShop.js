/**
 * Created by kerwinliu on 2018/7/3.
 */
/*
 *商城数据
 * */
import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import {Text, ActivityIndicator} from '@iqiyi/rn-ui'
import {Width, isIOS} from '@iqiyi/rn-utils'
import {DeviceModule} from '@iqiyi/rn-base-modules'
import QYNewList from '@iqiyi/rn-new-list'
import {getIntegralShopping} from '../../api'
import {goToDianShangDetail} from '../../common/util'
import {EmptyPage, NetError} from './EmptyPage'
import DefaultImage from '../home/DefaultImage'
import {sendClickPingback} from '../../common/pingback'
import Bottom from '../homePage/Bottom'

const itemWidth = (Width - 35) / 2
const itemHeight = 215.5
const NewListButton = QYNewList.Button

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false, // 默认是未加载网络
      data: null,
      netInfo: 0 // 0 表示正常，1表示断网，2表示有网但是错误
    }
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {this._renderChildren()}
        {this.state.netInfo !== 0 && <NetError netInfo={this.state.netInfo} retry={this._retry} />}
      </View>
    )
  }

  _renderChildren = () => {
    const {data, loaded, netInfo} = this.state
    const newData = data ? this.filterData(data) : null

    if(netInfo === 0 && newData && newData.length > 0) {
      if(isIOS) return <QYNewList dataList={newData} renderRow={this.renderRow} cellHeight={itemHeight} renderFooter={this._renderFooter}/>
      return <QYNewList dataList={newData} renderRow={this.renderRow} renderFooter={this._renderFooter}/>
    }
    if(loaded && netInfo === 0) {
      return <EmptyPage />
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

  init = () => {
    DeviceModule.getDeviceInfo()
      .then((data) => {
        const {networkType} = data
        const netInfo = networkType === 'disconnect' ? 1 : 0

        this.setState({netInfo}, () => {
          if(this.state.netInfo !== 1) {
            this._getData()
          }
        })
      })
      .catch(() => {
        this._getData()
      })
  }

  _retry = () => {
    this.setState(
      {
        loaded: false,
        netInfo: 0
      },
      () => {
        this.init()
      }
    )
  }

  // 获取数据
  _getData = () => {
    getIntegralShopping()
      .then((data) => {
        if(data.code === 'A00000') {
          this.setState({
            data: data.data,
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
  _goToDetailPage = (itemId, i, index, rowId) => {
    const {partnerCode} = this.props;
    sendClickPingback('allgoods', '110102', isIOS ? `all_${partnerCode}_${i + 2 * rowId + 1}` : `all_${partnerCode}_${i + 2 * index + 1}`);
    this.props.openWeb(goToDianShangDetail(itemId))
  }

  _renderItem = (item, i, index, rowId) => {
    const hasItemTop = this.hasItemTop(index)
    return (
      <NewListButton
        onPress={() => {
          this._goToDetailPage(item.itemIdStr, i, index, rowId)
        }}
        key={`all_shopgoods${i + 2 * rowId}`}
      >
        <View style={[styles.item, hasItemTop && {paddingTop: 35 / 2}]}>
          <View style={[styles.imageWrap]}>
            <DefaultImage source={item.showImage} style={styles.image} errorImageStyle={styles.image} />
          </View>
          <View style={[styles.nameContent, {marginBottom: 3}]}>
            <Text numberOfLines={1} style={{fontSize: 14, color: '#333', textAlign: 'left'}}>
              {item.title || item.name}
            </Text>
          </View>
          <View style={styles.nameContent}>
            <Text numberOfLines={1} style={{fontSize: 12, color: '#FF5900'}}>
              {item.newUserScore || item.scoreValue}积分{item.discount ? `可抵${item.discount / 100}元` : ''}
            </Text>
          </View>
        </View>
      </NewListButton>
    )
  }

   // item是否需要顶部高度
   hasItemTop = (index) => {
    return index === 0
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

  _renderFooter = () => {
    return <Bottom containerStyle={{marginTop: 25, marginBottom: 15}} content="积分商城合作：tp_park@qiyi.com" showArrow={false} />
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
    position: 'relative'
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: '#F9F9F9'
  },
  item: {
    width: itemWidth,
    paddingBottom: 13,
    alignItems: 'center'
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
