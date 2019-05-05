/*
  积分乐园福利  道具后台数据
*/
import React, {Component} from 'react'
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  View,
  Text,
  Image
} from '@iqiyi/rn-ui'
import Swiper from '@iqiyi/rn-swiper-new'
import {Width as width} from '@iqiyi/rn-utils'
import {getAuctionDetail, getCurrentAttender} from '../../api'
import {getAuctionInfo, countdown} from './GetGotoUrl'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'
import TabTitle from './TabTitle'
import {filterPic, getObjectValueSafely} from '../../common/util'
import GradientView from '../GradientView'
import {GET_ENV, QiangPaiURL} from '../../constants/configs'
import {AUCTION_BLOCK, AUCTION_CLICK, PARK_PAGE} from './pingback'

const statusText = ['即将开始', '出价中', '开奖中', '下一轮']
class NoticeText extends Component {
  render() {
    const {item} = this.props
    return (
      <View style={styles.textWrapper}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <Text style={styles.nickname} numberOfLines={1}>{item.nickname} 已出价</Text>
      </View>
    )
  }
}
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countTime: {
        hour: '00',
        minute: '00',
        second: '00'
      }, // 倒计时
      contStatus: 0, // 倒计时状态
      auctionCode: this.props.auctionCode,
      open: true,
      attendedUsers: [], // 进行中的竞拍用户
      auctionData: {} // 当前竞拍信息
    }
  }

  componentDidMount() {
    sendBlockPingback(PARK_PAGE, AUCTION_BLOCK)
    this._getAuctionDetail(true)
    this._getCurrentList()
  }

  render() {
    const {hour, minute, second} = this.state.countTime
    const {contStatus, open, auctionData, attendedUsers} = this.state
    if(!auctionData || !auctionData.code) {
      return null
    }
    const name = getObjectValueSafely(auctionData, 'item.name', '')
    const photos = getObjectValueSafely(auctionData, 'item.photos', [])
    const picMap = filterPic(photos);
    const imgUri = picMap.smallpic || picMap.largepic || picMap.sharepic;
    if(open) {
      return (
        <View style={styles.containerTitle}>
          <TabTitle title="心跳抢拍"/>
          <View style={styles.auctionBox}>
              <TouchableOpacity style={styles.timeBox} activeOpacity={1} onPress={this.goToAuction}>
                <Image style={styles.rewardImage} source={{uri: imgUri}}/>
                <View style={styles.rewardTime}>
                  <Text style={styles.rewardName}>{name}</Text>
                  <View style={styles.itemTimeBox}>
                      <Text style={{color: '#333', fontSize: 14}}>{statusText[contStatus]}  </Text>
                      <Text style={styles.hour}>{hour}</Text>
                      <Text style={styles.colon}> : </Text>
                      <Text style={styles.hour}>{minute}</Text>
                      <Text style={styles.colon}> : </Text>
                      <Text style={styles.hour}>{second}</Text>
                  </View>
                </View>
                <GradientView style={styles.joinButton} startColor="#FFA400" endColor="#FF7E00">
                  <Text style={{fontSize: 14, color: '#fff'}}>去参与</Text>
                </GradientView>
              </TouchableOpacity>
              {
              !!attendedUsers.length &&
              <View style={styles.rewardUserContent}>
                <Swiper
                  loop={true}
                  autoplay={true}
                  height={30}
                  removeClippedSubviews={false}
                  showsPagination={false}
                  horizontal={false}
                >
                {attendedUsers.map((item) => {
                  return <NoticeText key={item} item={item} />
                })}
                </Swiper>
                <View style={styles.mask}/>
              </View>
              }
          </View>
        </View>
      )
    }
   return null
  }

  _getAuctionDetail = (isopen) => {
    const param = {
      typeCode: 'point',
      code: this.state.auctionCode,
      userId: global.USER_INFO.userId,
      authCookie: global.USER_INFO.authCookie
    }
    getAuctionDetail(param).then((data) => {
      this.setState({
        auctionData: data
      })
      const timer = setInterval(() => {
        const countInfo = getAuctionInfo(data)
        let open = false
        if(countInfo.state === -1) {
          open = false
          this.setState({ // 已经结束的竞拍不展示入口
            open
          })
          clearInterval(timer)
        } else {
          open = isopen
          this.setState({ // 已经结束的竞拍不展示入口
            open
          })
        }
        const time = countdown(countInfo.time)
        this.setState({
          countTime: time,
          contStatus: countInfo.state
        })
      }, 1000)
    })
  }

  _getCurrentList = () => {
    const param = {
      code: this.state.auctionCode
    }
    getCurrentAttender(param).then((d) => {
      if(d.attended_users && d.attended_users.length) {
        this.setState({
          attendedUsers: d.attended_users
        })
      }
    }).catch()
  }

  goToAuction = () => {
    sendClickPingback(PARK_PAGE, AUCTION_BLOCK, AUCTION_CLICK)
    const url = `${QiangPaiURL[GET_ENV()]}?code=${encodeURIComponent(this.state.auctionCode)}&from=paradise`
    this.props.openWeb(url)
  }
}

const styles = StyleSheet.create({
  containerTitle: {
    paddingHorizontal: 15,
  },
  auctionBox: {
    width: width - 30,
    height: 100,
    alignItems: 'center',
    marginBottom: 11,
    backgroundColor: '#fff',
    paddingTop: 9,
  },
  timeBox: {
    flexDirection: 'row',
    height: 55,
    alignItems: 'center'
  },
  rewardImage: {
    width: 80,
    height: 55,
    borderRadius: 7
  },
  rewardTime: {
    flex: 1,
    marginLeft: 15,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  joinButton: {
    height: 30,
    width: 70,
    borderRadius: 6
  },
  rewardName: {
    fontSize: 16,
    color: '#333',
    lineHeight: 19
  },
  time: {
    fontFamily: 'PingFangSC-Regular',
  },
  itemTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
    height: 20,
  },
  hour: {
    color: '#111',
    fontSize: 16,
    fontWeight: 'bold'
  },
  colon: {
    color: 'rgba(51,51,51,0.92)',
    lineHeight: 14,
    fontSize: 14,
    fontWeight: 'bold'
  },
  rewardUserContent: {
    height: 30,
    width: width - 30,
    backgroundColor: '#FFF9F7',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 7.5
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  textWrapper: {
    flexDirection: 'row',
    paddingLeft: 3.5,
    alignItems: 'center',
    flex: 1
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 10
  },
  nickname: {
    color: '#666',
    fontSize: 10
  }
})
