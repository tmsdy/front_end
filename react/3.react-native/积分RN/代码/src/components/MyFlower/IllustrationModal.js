/**
 * Created by liuzhimeng.
 * @date 2019-04-04
 * @description 图鉴弹窗
 */

import React, {PureComponent} from 'react'
import {ScrollView, TouchableOpacity} from 'react-native'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {View, Text} from '@iqiyi/rn-ui'
import {Width, Height} from '@iqiyi/rn-utils'

import {switchHistoryGardenMode, setIllustration, switchShowReplantBox} from '../../actions/GardenDetailActions'
import {fetchFlowerIllustration} from '../../model/MyFlower'
import {GARDEN_ENUM} from '../../constants/IntegralEnum'
import {sendClickPingback, sendBlockPingback} from '../../common/pingback'

import HalfScreenModal from './HalfScreenModal'
import WebImage from '../WebImage'
import IllustrationItem from './IllustrationItem'

@connect(
  ({gardenDetail}) => {
    const {isMasterMode, masterGardenMode, friendGardenMode} = gardenDetail
    const gardenMode = isMasterMode ? masterGardenMode : friendGardenMode

    return {gardenMode}
  },
  dispatch => bindActionCreators({
    switchHistoryGardenMode,
    setIllustration,
    switchShowReplantBox
  }, dispatch),
  null,
  {withRef: true},
)
export default class IllustrationModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      illList: [],
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const {illList} = this.state

    return (
      <HalfScreenModal
        hideConfirmModal={this.props.hideConfirmModal}
        showHeader={true}
        headerIcon="flower/icon-map"
        title="图鉴"
      >
        <View style={{flex: 1}}>
          <ScrollView horizontal={true} bounces={false} showsHorizontalScrollIndicator={false}>
            {!!illList.length && illList.map(this.renderListItem)}
            {this.renderProducting()}
          </ScrollView>
        </View>
      </HalfScreenModal>
    )
  }

  renderListItem = (item, index) => {
    const {channelCode = '', completes, planting} = item
    const containerStyle = {
      marginLeft: index === 0 ? 17 : 10
    }

    // 已经种成功的花跳转到图鉴页面
    if(completes) {
      return (
        <View key={channelCode} style={[styles.itemBox, containerStyle]}>
          {this.renderFront(item)}
        </View>
      )
    }

    // 正在培育中的花 || 未获得的花
    if(planting || (!item.completes && !item.planting)) {
      return <IllustrationItem key={channelCode} item={item} containerStyle={containerStyle}/>
    }

    return null
  }

  renderFront = (item) => {
    const picName = IllustrationItem.getFrontBackGroundPic(item)
    return (
      <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => this.goToIllustration(item)}>
        <WebImage name={picName} style={styles.flowerImage}>
          {item.planting && (
            <View style={styles.frontPlantStatusBox}>
              <Text style={styles.frontPlantStatusText}>培育中</Text>
            </View>
          )}
        </WebImage>
        <View style={styles.frontBottomBox}>
          <Text style={styles.frontFlowerName} numberOfLines={1}>{item.name}</Text>
          {!!item.completes && <Text style={styles.frontPlantNum}>已养成{item.completes}次</Text>}
        </View>
      </TouchableOpacity>
    )
  }

  renderProducting = () => {
    return (
      <View style={[styles.itemBox, {marginRight: 17, backgroundColor: '#EFEFEF'}]}>
        <View style={{flex: 1}}>
          <WebImage name="producting_rose" style={styles.flowerImage} />
          <View style={[styles.frontBottomBox, {backgroundColor: '#FFC99B'}]}>
            <Text style={styles.frontFlowerName} numberOfLines={1}>???</Text>
            <Text style={styles.frontPlantNum}>新品研发中</Text>
          </View>
        </View>
      </View>
    )
  }

  fetchData = () => {
    fetchFlowerIllustration().then((data) => {
      this.setState({illList: data})
    })
  }

  goToIllustration = (item) => {
    const block = item.channelCode === GARDEN_ENUM.CHANNEL_CODE.Rose ? 'result_rose' : 'result_money'
    const rseat = item.channelCode === GARDEN_ENUM.CHANNEL_CODE.Rose ? 'book_rose' : 'book_money'

    sendBlockPingback('flower_page', block)
    sendClickPingback('flower_page', 'book', rseat)

    this.props.hideConfirmModal().then(() => {
      this.props.setIllustration(item)
      this.props.switchHistoryGardenMode(item.channelCode);
      this.props.switchShowReplantBox(false)
    })
  }

}

const styles = BaseStyleSheet.create({
  frontPlantStatusBox: {
    width: 40,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  frontPlantStatusText: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center'
  },
  frontBottomBox: {
    height: 47,
    backgroundColor: '#FF9D44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  frontFlowerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    marginLeft: 10,
    maxWidth: 60
  },
  frontPlantNum: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    marginRight: 10
  },
  itemBox: {
    width: 135,
    height: 207,
    alignSelf: 'center',
    borderRadius: 10,
    marginLeft: 10,
    overflow: 'hidden',
  },
  flowerImage: {
    width: 135,
    height: 160
  },
  illContainer: {
    width: Width,
    height: Height,
    position: 'absolute',
    alignSelf: 'center'
  }
})
