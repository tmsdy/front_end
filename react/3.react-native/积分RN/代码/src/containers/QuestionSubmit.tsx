/**
脑洞投稿站
 */

import React from 'react'
import {DeviceEventEmitter, ScrollView, TouchableOpacity} from 'react-native'

import LinearGradient from '@iqiyi/rn-gradient-view'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Text, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import {setUnreceiveScore, setUserSelectPic} from '../actions/QuestionActions'

import px2dp from '../common/px2dp'
import InputBox from '../components/QuestionSubmit/InputBox'
import RuleDetail from '../components/QuestionSubmit/RuleDetail'
import WebImage from '../components/WebImage';
import NavBar from '../components/DefaultNavBar'
import {hideLoading} from '../common/QYNativeBridge'

import BasePage from '../components/BasePage'
import {fetchUnreceiveScore, fetchPublishUserCount} from '../model/question/questionSubmit'
import ReduxUtil from '../common/ReduxUtil'
import BaseConfirmModal from '../components/BaseConfirmModal'


const GRADIENT_START_COLOR = '#FF7F46'
const GRADIENT_END_COLOR = '#FF9E4A'
const INPUT_BOX_WRAPPER_WIDTH = DEVICE_WIDTH - 33
const INPUT_BOX_WRAPPER_HEIGTH = (INPUT_BOX_WRAPPER_WIDTH * 369) / 684

interface QuestionSubmitProps {
  unreceiveScore: number;
}

interface QuestionSubmitState {
  hasAddBgPic: boolean;
  bgPic: string;
  isLogin: boolean;
  imagePath: string;
  publishNum: string;
}

@(connect(
  ({questionInfo}) => {
    const {unreceiveScore} = questionInfo
    return {
      unreceiveScore
    };
  },
  dispatch => bindActionCreators({
    setUnreceiveScore,
    setUserSelectPic
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class QuestionSubmit extends BasePage<QuestionSubmitProps, QuestionSubmitState> {

  public constructor(props) {
    super(props)

    this.state = {
      hasAddBgPic: false,
      bgPic: '',
      isLogin: global.USER_INFO.isLogin,
      publishNum: '0'
    }
    this.refConfirmModal = ReduxUtil.createRef();
  }

  componentDidMount() {
    hideLoading()
    this.getUnreceiveScore()
    this.getPublishNum()
  }

  componentWillUnmount() {
    this.props.setUserSelectPic('')
  }

  render() {
    const {isLogin, publishNum} = this.state
    return (
      <View style={{flex: 1}}>
        <NavBar
          type="black"
          title="脑洞投稿站"
          titleColor="#333333"
          backgroundColor="#ffffff"
          backPress={this.back}
          rightViewWidth={90}
          renderRightView={() => this._renderRightView()}
        />
        <ScrollView style={{flex: 1, paddingBottom: 90}}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            colors={[GRADIENT_START_COLOR, GRADIENT_END_COLOR]}
            style={styles.container}
          >
            <WebImage name="question/submit_title" style={styles.headTitle}>
              <View style={styles.voteNumBox}>
                <Text style={{color: '#ffffff', fontSize: 12}}>{publishNum}<Text style={{color: '#FFA785', fontSize: 12}}>人已经投稿</Text></Text>
              </View>
            </WebImage>

            <InputBox
              openWeb={this.openWeb}
              goTo={this.goTo}
              isLogin={isLogin}
              showConfirmModal={this.showConfirmModal}
              hideConfirmModal={this.hideConfirmModal}
            />
            <WebImage name="question/bottom_dot" style={styles.bottomDot}/>
            <RuleDetail/>

            <WebImage name="question/left_dot" style={styles.leftDot}/>
            <WebImage name="question/cheese" style={styles.cheese}/>
          </LinearGradient>
        </ScrollView>

        {/* 弹框容器 */}
        <BaseConfirmModal ref={this.refConfirmModal}/>
      </View>
    )
  }

  _renderRightView = () => {
    const {unreceiveScore} = this.props
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.gotoMySubmitList} style={styles.rightMenu}>
        <Text style={styles.rightMenuText}>我的投稿</Text>
        {!!unreceiveScore && <WebImage name="question/red_dot" style={styles.redDot}/>}
      </TouchableOpacity>
    )
  }

  listenLogin() {
    this.listener = DeviceEventEmitter.addListener('loginChange', this._loginChange)
  }

  gotoMySubmitList = () => {
    this.goTo('MySubmitList')
  }

  loginChange(isLogin) {
    this.setState({isLogin})
  }

  goToPreview = () => {
    this.goTo('QuestionPreview')
  }

  openSelectPage = () => {
    this.openWeb(JSON.stringify({
      biz_params: {
        biz_params: '',
        biz_statistics: 'from_type=mine&from_subtype=mycirph',
        biz_extend_params: '',
        biz_sub_id: '13',
        biz_dynamic_params: ''
      },
      biz_plugin: 'qiyimp',
      biz_id: '113'
    }))
  }

  getUnreceiveScore = () => {
    fetchUnreceiveScore().then((data) => {
      this.props.setUnreceiveScore(data)
    })
  }

  showConfirmModal = (config) => {
    return this.refConfirmModal.getInstance().then((ref) => {
      ref.queueToShow(config, true)
    });
  };

  hideConfirmModal = () => {
    return this.refConfirmModal.getInstance().then(ref => ref.positiveHide());
  };

  getPublishNum = () => {
    fetchPublishUserCount().then((data) => {
      if(data) {
        this.setState({
          publishNum: data
        })
      }
    }).catch()
  }

}

const styles = global.BaseStyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 90
  },
  headCloud: {
    width: 244,
    height: 92,
    position: 'absolute',
    top: 0,
    alignSelf: 'center'
  },
  inputBoxWrapper: {
    width: INPUT_BOX_WRAPPER_WIDTH,
    height: INPUT_BOX_WRAPPER_HEIGTH,
    alignSelf: 'center'
  },
  cheese: {
    width: 205,
    height: 90,
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  inputBox: {
    width: INPUT_BOX_WRAPPER_WIDTH - 9,
    height: INPUT_BOX_WRAPPER_HEIGTH - 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15
  },
  headTitle: {
    width: DEVICE_WIDTH,
    height: px2dp(170)
  },
  bottomDot: {
    width: 38,
    height: 17
  },
  leftDot: {
    width: 40,
    height: 20
  },
  redDot: {
    width: 23,
    height: 23,
    position: 'absolute',
    right: 0,
    top: 4
  },
  rightMenu: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  rightMenuText: {
    color: '#333333',
    fontSize: 14,
    marginRight: 15
  },
  voteNumBox: {
    backgroundColor: 'rgba(255,54,0,0.5)',
    height: 25,
    borderBottomLeftRadius: 12.5,
    borderTopLeftRadius: 12.5,
    position: 'absolute',
    right: 0,
    top: 15,
    paddingHorizontal: 8,
    justifyContent: 'center'
  }
});
