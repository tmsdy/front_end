/**
 * 用户状态信息
*/

import React, {PureComponent} from 'react'
import {
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text,
  Image
} from '@iqiyi/rn-ui'
import {
  Width,
  isIOS
} from '@iqiyi/rn-utils'
import BaseStyleSheet from '../../common/BaseStyleSheet'
import GradientView from '../GradientView'
import TotalScore from '../totalScore/TotalScore'
import WithVerticalSwiper from './WithVerticalSwiper'
import OneKeyStyle from './OneKeyStyle'
import FlowerEnter from './FlowerEnter'
import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../../common/asyncStorage'
import {goToLogin} from '../../common/util/index'
import {getCDNUrl} from '../../constants/configs'
import {sendClickPingback, sendBlockPingback} from '../../common/pingback'

const USER_CONTENT_WIDTH = 0.92 * Width
const IS_SHOW_USER_EXPIRE_SCORE = 'IS_SHOW_USER_EXPIRE_SCORE_)))))'
interface UserInfoState {
  userIcon: string;
  showScoreNotice: boolean;
}

interface UserInfoProps {
  lastPeriodScore: number;
  openWeb?(url: string): void;
  navigate?(name: string, config?: {[key: string]: string}): void;
  completedTasks?: any[];
  isLogin?: boolean;
}

const DEFAULT_ICON = getCDNUrl('default_icon')


export default class UserInfo extends PureComponent<UserInfoProps, UserInfoState> {
  constructor(props) {
    super(props)
    this.state = {
      userIcon: global.USER_INFO.userIcon || DEFAULT_ICON,
      showScoreNotice: false
    }
  }

  componentDidMount() {
    this.isShowScoreNotice().then((showScoreNotice) => {
      sendBlockPingback('pointcenter', '2102')
      this.setState({showScoreNotice})
    })
  }

  render() {
    const {userIcon} = this.state
    const {isLogin} = this.props
    return (
      <React.Fragment>
        <View style={styles.content}>
          <View style={[styles.userContent, isIOS && styles.iosShadow]}>
            <View style={[styles.withBorderRadius, !isIOS && styles.androidShadow]}>
              <View style={styles.user}>
                <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row', flex: 1}} onPress={this.goToScoreDetail}>
                  <Image source={{uri: isLogin ? userIcon : DEFAULT_ICON}} style={styles.avatar}/>
                  <TotalScore from="homePage"/>
                </TouchableOpacity>
                <View style={styles.flowerContent}>
                  {
                    isLogin
                    ? <FlowerEnter navigate={this.props.navigate}/>
                    : (
                      <TouchableOpacity
                        style={[styles.loginBtn, {right: 20}]}
                        onPress={goToLogin}
                        activeOpacity={1}
                      >
                        <GradientView
                          style={styles.loginBtn}
                          startColor="#FF6100"
                          endColor="#FF410F"
                        >
                          <Text style={OneKeyStyle.buttonText}>登录</Text>
                        </GradientView>
                      </TouchableOpacity>
                    )
                  }
                </View>
              </View>
              {
                this.renderBottom()
              }
            </View>
          </View>
        </View>
      </React.Fragment>
    )
  }

  renderBottom = () => {
    const {lastPeriodScore, openWeb, navigate} = this.props
    const {showScoreNotice} = this.state
    // 过期积分展示
    if(lastPeriodScore && showScoreNotice) {
      return (
        <View style={OneKeyStyle.outer}>
          <Text style={OneKeyStyle.noticeText}>{lastPeriodScore}积分将于今年6月1日过期</Text>
          <TouchableOpacity activeOpacity={1} style={OneKeyStyle.noticeButton} onPress={this.clickLastScoreButton}>
            <GradientView
              style={OneKeyStyle.noticeButton}
              startColor="#FF6100"
              endColor="#FF410F"
            >
              <Text style={OneKeyStyle.buttonText}>去查看</Text>
            </GradientView>
          </TouchableOpacity>
        </View>
      )
    }
    return <WithVerticalSwiper openWeb={openWeb} navigate={navigate}/>
  }

  // 每年1月1日0点判断去年过期积分是否为0，若不为0则展示积分过期提醒，
  // 文案“X积分将于今年6月1日过期>>”，点击进入积分明细页面，返回则关闭该提醒
  isShowScoreNotice = async () => {
    let isShowScore = false;
    const current = new Date();
    const showConfigs = ['1/1', '5/26'];

    const data = await getAsyncStoragePromise(IS_SHOW_USER_EXPIRE_SCORE) || {};

    // 为1或者null时，显示
    isShowScore = data.isShow !== 0;

    if(showConfigs.indexOf(`${current.getMonth() + 1}/${current.getDate()}`) >= 0) {
      isShowScore = true;
      // 判断当天是否点击过
      if(data.time) {
        const clickDate = new Date(data.time);
        if(clickDate.getMonth() === current.getMonth() && clickDate.getDate() === current.getDate()) {
          isShowScore = false;
        }
      }
    }
    return isShowScore;
  }

  updateScoreNotice = () => {
    // 用户触发更新的时候才添加time
    saveAsyncStoragePromise(IS_SHOW_USER_EXPIRE_SCORE, {
      isShow: 0,
      time: Date.now()
    });
    this.setState({showScoreNotice: false})
  }

  // 点击积分明细
  goToScoreDetail = () => {
    if(this.props.isLogin) {
      sendClickPingback('pointcenter', '', 'detailbtn')
      this.props.navigate("IntegralDetail")
    } else {
      goToLogin()
    }
  }

  // 点击过期提醒
  clickLastScoreButton = () => {
    if(this.props.isLogin) {
      sendClickPingback('pointcenter', '2102', 'check_2')
      this.props.navigate("IntegralDetail")
      this.updateScoreNotice()
    } else {
      goToLogin()
    }
  }
}

const styles = BaseStyleSheet.create({
  content: {
    flexGrow: 1,
    height: 163,
    alignItems: 'center',
    paddingTop: 10,
  },
  userContent: {
    width: USER_CONTENT_WIDTH,
    minHeight: 95,
    position: 'absolute',
    top: 10,
    // overflow: 'hidden',
  },
  withBorderRadius: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  iosShadow: {
    shadowColor: 'rgb(153,153,153)',
    shadowRadius: 10,
    shadowOpacity: .2,
    shadowOffset: {h: 10, w: 10},
  },
  androidShadow: {
    borderColor: '#E2E2E2',
    borderWidth: BaseStyleSheet.hairlineWidth
  },
  user: {
    flexDirection: 'row',
    height: 95,
    paddingLeft: 15,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  flowerContent: {
    width: .55 * USER_CONTENT_WIDTH,
    height: 95,
    justifyContent: 'center'
  },
  loginBtn: {
    width: 75,
    height: 28,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
})
