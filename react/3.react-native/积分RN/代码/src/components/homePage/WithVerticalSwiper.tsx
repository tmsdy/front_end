/**
 * 通知栏容器
 *  */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Text
} from '@iqiyi/rn-ui'
import Swiper from '@iqiyi/rn-swiper-new'
import OneKey from './OneKey'
import OneKeyStyle from './OneKeyStyle'
import ShowNextAnimation from '../Animation/ShowNextAnimation'
import ReduxUtil from '../../common/ReduxUtil'
import {fetchHomePageNotice} from '../../model/homePage/index'
import WebImage from '../WebImage'
import {QipuDataItem, NoticeData} from '../../typings/apis/homePage'
import {sendClickPingback, sendBlockPingback} from '../../common/pingback'

interface NoticeItemType extends QipuDataItem, NoticeData {}

interface VerticalSwiperProps {
  completedList?: any[];
  openWeb?(url: string): void;
  navigate?(name: string, config: {[key: string]: string}): void;
}

interface VerticalSwiperState {
  billboard: QipuDataItem[];
  notice: NoticeData[];
}

@(connect(({homePage}) => {
  return {
    completedList: homePage.homePageTaskData.completedList
  }
}, null, null, {withRef: true}) as any)
export default class extends PureComponent<VerticalSwiperProps, VerticalSwiperState> {

  private nextAnimation: any = ReduxUtil.createRef();

  constructor(props) {
    super(props)
    this.state = {
      billboard: [], // 公告
      notice: [] // 通知
    }
  }

  componentDidMount() {
    this.getNoticeAndBoard()
  }

  render() {
    const {completedList} = this.props
    const {billboard, notice} = this.state
    const hasNotice = billboard.length > 0 || notice.length > 0
    const hasCompleted = completedList && completedList.length > 0
    if(hasCompleted) {
      return (
        <ShowNextAnimation style={OneKeyStyle.borderTop} ref={this.nextAnimation}>
          {this.renderOneKey()}
          {hasNotice ? this.renderSwiper(true) : null}
        </ShowNextAnimation>
      )
    }
    if(hasNotice) {
      return (
        <View style={OneKeyStyle.borderTop}>
          {this.renderSwiper(false)}
        </View>
      )
    }
    return null
  }

  public showNextNotice = (cb?: Function) => {
    this.nextAnimation.getInstance().then(ref => {
      ref.showNext().then(() => {
        cb && cb()
      }).catch(() => {
        cb && cb()
      })
    })
  }

  // 一键领取任务
  private renderOneKey = () => {
    const {completedList} = this.props
    if(completedList.length > 0) {
      return <OneKey showNext={this.showNextNotice}/>
    }
    return null
  }

  // 通知和系统公告
  private renderSwiper = (renderOnlyOne: boolean) => {
    const {billboard, notice} = this.state
    const {completedList} = this.props
    if(!billboard.length && !notice.length) return null
    // swiper 有bug，需要合并数组渲染
    const list: NoticeItemType[] = [].concat(billboard, notice)

    // 有滑动的情况下只需要渲染一条通知滑动展示
    // 确保 Swiper 只会被render一次，因为android上多次render效果不好
    if(renderOnlyOne) {
      return (
        <React.Fragment>
          {this.renderItem(list[0], 0)}
        </React.Fragment>
      )
    }
    return (
      <View style={{height: 40}}>
        <Swiper
          loop={true}
          autoplay={!completedList || !completedList.length}
          height={40}
          removeClippedSubviews={false}
          showsPagination={false}
          horizontal={false}
        >
          {list.map(this.renderItem)}
        </Swiper>
      </View>
    )
  }

  private renderItem = (item: NoticeItemType, index: number) => {
    if(!item) return null
    if(item.productId) {
      return this.renderSwiperNoticeItem(item, index)
    }
    return this.renderSwiperBoardItem(item)
  }

  // 公告信息
  private renderSwiperBoardItem = (item: QipuDataItem) => {
    return (
      <TouchableOpacity style={OneKeyStyle.outer} key={item.entityId} activeOpacity={1} onPress={() => { this.clickBoard(item.entityUrl) }}>
        <Text style={OneKeyStyle.noticeText} numberOfLines={1}>{item.properTitle}</Text>
        <View style={OneKeyStyle.textButton}>
          <Text style={OneKeyStyle.noticeButtonText}>去查看</Text>
          <WebImage name="icon/triangle-right" style={OneKeyStyle.noticeIcon}/>
        </View>
      </TouchableOpacity>
    )
  }

  // 兑换通知信息
  private renderSwiperNoticeItem = (item: NoticeData, index) => {
    return (
      <TouchableOpacity style={OneKeyStyle.outer} key={item.productId + index} activeOpacity={1} onPress={() => { this.openDetail(item.productId) }}>
        <Text style={OneKeyStyle.noticeText} numberOfLines={1}>
          {item.nickName} 刚兑换了 {item.name}
        </Text>
        <View style={OneKeyStyle.textButton}>
          <Text style={OneKeyStyle.noticeButtonText}>去查看</Text>
          <WebImage name="icon/triangle-right" style={OneKeyStyle.noticeIcon}/>
        </View>
      </TouchableOpacity>
    )
  }

  openDetail = (itemId) => {
    sendClickPingback('pointcenter', '2104', 'check_4')
    const {navigate} = this.props
    navigate('GoodsDetail', {
      itemId
    })
  }

  clickBoard = (entityUrl) => {
    sendClickPingback('pointcenter', '2103', 'check_3')
    this.props.openWeb(entityUrl)
  }

  private getNoticeAndBoard = async () => {
    try {
      const {billboard, notice} = await fetchHomePageNotice()
      this.setState({billboard, notice})
      // didmount 里面只会执行一次，可以做block投递
      if(billboard && billboard.length > 0) {
        sendBlockPingback('pointcenter', '2103')
      }
      if(notice && notice.length > 0) {
        sendBlockPingback('pointcenter', '2104')
      }
    } catch(e) {
      throw e
    }
  }
}
