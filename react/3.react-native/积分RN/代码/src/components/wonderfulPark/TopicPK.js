/**
 * Created by liuzhimeng.
 * @date 2018/9/13
 * @description 话题PK
 */

import React, {Component} from 'react'
import {StyleSheet, TouchableWithoutFeedback} from 'react-native'
import Swiper from '@iqiyi/rn-swiper'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {View, Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import {GET_ENV, TOPIC_PK_SHARE_URL} from '../../constants/configs'
import WebImage from '../WebImage'
import {goToLogin, shareSNS} from '../../common/util'
import {getLifeCycleState} from '../topicPk/lifeCycle'
import {changeTotalScore} from '../../actions/TotalScoreActions'
import Modal from '../topicPk/src/Modal'
import {getAvailableReward, getList} from '../topicPk/apis'
import {doVoteTopic, getPkReward} from '../topicPk/buttonPress'
import {changeAvailableScore as changeAvailableScoreAction} from '../../actions/changeAvailableScore'
import TopicBlock from '../topicPk/src/TopicBlock'
import {sendClickPingback, sendBlockPingback} from '../../common/pingback'
import {showToast} from '../../common/QYNativeBridge';
import {
  PARK_PAGE,
  TOPIC_PK_BLOCK,
  getTopicPkButtonCLickPingback,
  getTopicPkCardCLickPingback,
  getTopciPkCardBlock,
  TOPIC_PK_MY_LIST_NOT_POINT_CLICK,
  TOPIC_PK_MY_LIST_HAVE_POINT_CLICK
} from './pingback'

@connect((state = {}) => {
  const {scoreInfo = {}, changeAvailableScore = {}} = state;
  return {
    totalScore: scoreInfo.totalScore,
    plusAvailableScore: changeAvailableScore.score,
    time: changeAvailableScore.time,
  }
}, dispatch => bindActionCreators({
  changeAvailableScoreAction,
  changeTotalScore
}, dispatch), null, {withRef: true})

export default class TopicPk extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!!nextProps.plusAvailableScore && nextProps.time !== prevState.time) {
      return {
        time: nextProps.time,
        totalAvailableScore: prevState.totalAvailableScore + nextProps.plusAvailableScore,
      }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      time: 0,
      totalAvailableScore: 0,
      modalState: {
        modalVisible: false,
        modalMode: 'rule',
        content: {},
        buttonText: '',
      },
      contents: []
    }
    this.topicBlock = {}
  }
  componentDidMount() {
    this.getContents()
    this.getReword()
  }
  render() {
    const {
      modalState: {
        modalVisible,
        modalMode,
        content,
        buttonText,
      },
      contents,
      totalAvailableScore
    } = this.state
    if(!contents || !contents.length) {
      return null
    }
    return (
      <View style={styles.boxWrapper}>
        <View style={styles.titleBox}>
            <Text style={styles.title}>话题PK</Text>
            <TouchableWithoutFeedback style={{flexDirection: 'row'}} onPress={() => { this.gotoTopic(1) }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {!!totalAvailableScore && <WebImage name="red_icon_medal" style={{width: 15, height: 15, marginRight: 3.5}} />}
                    <Text style={{fontSize: 12, color: '#666666'}}>我参与的</Text>
                    <WebImage name="ic_arrow_small" style={{width: 12, height: 12, marginLeft: 2}} />
                </View>
            </TouchableWithoutFeedback>
        </View>
        {
          contents.length > 0 &&
          <Swiper
            height={0.95 * Width}
            loop={false}
            removeClippedSubviews={false}
            paginationStyle={{position: 'absolute', bottom: 7}}
            dotStyle={{backgroundColor: '#CCCCCC', height: 5, width: 5, borderRadius: 2.5}}
            activeDotStyle={{backgroundColor: '#FF6600', height: 5, width: 10, borderRadius: 2.5}}
          >
            {contents.map(this._renderItem)}
          </Swiper>
          // <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginLeft: 15}}>
          //    {contents.map(this._renderItem)}
          // </ScrollView>
        }
        <Modal
          modalVisible={modalVisible}
          mode={modalMode}
          content={content}
          buttonText={buttonText}
          onConfirm={() => this.onModalConfirm(modalMode)}
          onClose={() => this.onModalClose()}
        />
      </View>
    )
  }

  gotoTopicList = () => {
    this.props.goTo('TopicPk', {
      initialPage: 0,
      beforeBack: this.initData
    })
  }
  getReword() {
    getAvailableReward()
      .then((data) => {
        if(data) {
          this.setState({
            totalAvailableScore: data.scores,
          })
        }
      })
  }

  getContents() {
    getList({status: 'RUNNING'})
        .then(({contents = []}) => {
          if(contents && contents.length) {
            this.setState({contents})
          }
        })
  }

  initData = () => {
    this.getContents()
    this.getReword()
  }

  // 打call
  onViewPress({id: optionId}, optionKey, {detail, topicOptions}, index) {
    sendClickPingback(PARK_PAGE, TOPIC_PK_BLOCK, getTopicPkCardCLickPingback(index + 1))
    const {totalScore, isLogin} = this.props

    if(!isLogin) {
      return goToLogin()
    }
    try {
      const {userVoteNumber, limitNumber} = topicOptions
      // 个人投票次数限制
      if(limitNumber && userVoteNumber && parseInt(limitNumber) <= parseInt(userVoteNumber)) {
        return showToast(`投票上限${limitNumber}票，邀请小伙伴来投～`)
      }
    } catch(e) {} // eslint-disable-line
    if(totalScore < detail.price) {
      return showToast(`投票还差${detail.price - totalScore}积分，去赚积分`)
    }

    doVoteTopic(detail, optionId, totalScore)
      .then(({userVoteNumber}) => {
        this.initData()
        this.props.changeTotalScore(0 - parseFloat(detail.price))
        if(userVoteNumber === 1) {
          this.topicBlock[detail.code] && this.topicBlock[detail.code].showShareBubble && this.topicBlock[detail.code].showShareBubble()
        }
        return showToast('投票成功')
      }).catch(() => {
        showToast('活动太火爆了，稍后再试～')
      })
  }

  onButtonPress(item, index) {
    sendClickPingback(PARK_PAGE, TOPIC_PK_BLOCK, getTopicPkButtonCLickPingback(index + 1))
    const {
      topicOptions: {buttonTodo},
      detail: {
        each_reward: eachReward,
        user_vote_number: userVoteNumber
      },
    } = item
    const totalReward = userVoteNumber * eachReward
    // 领取奖励
    if(buttonTodo === 'getReward') {
      getPkReward(item)
        .then(() => {
          this.initData()
          this.props.changeAvailableScoreAction(0 - parseFloat(totalReward))
          this.onChildUpdate({
            modalState: {
              modalVisible: true,
              modalMode: 'reminder',
              content: {
                id: 'getReward',
                title: `${totalReward}积分领取成功`,
                iconName: 'topicpk/modal-get-score',
              },
              buttonText: '邀好友一起赢积分',
            }
          })
        })
    }
  }

  _renderItem = (data, index) => {
    sendBlockPingback(PARK_PAGE, getTopciPkCardBlock(index + 1))
    const item = getLifeCycleState({detail: data, userScore: this.props.totalScore})
    if(item && item.id) {
      return (
        <TouchableWithoutFeedback key={item.id} onPress={this.gotoTopicList} >
            <View style={[{alignItems: 'center'}]}>
              <TopicBlock
                style={[styles.itemWrap]}
                mode={item.mode}
                options={item.topicOptions}
                viewOptions={item.viewOptions}
                buttonOptions={item.buttonOptions}
                onViewPress={(opt, optKey) => this.onViewPress(opt, optKey, item, index)}
                onButtonPress={() => this.onButtonPress(item, index)}
                detail={item.detail}
                period={item.period}
                ref={(topick) => { this.topicBlock[item.id] = topick }}
                index={index}
              />
            </View>
        </TouchableWithoutFeedback>
      )
    }
    return null
  }

  // 跳转话题pk
  gotoTopic = (init) => {
    const {totalAvailableScore} = this.state
    if(init === 0) {
      sendClickPingback('paradise', '400100', 'topic_card')
    }
    // 点击我参与的
    if(init === 1) {
      if(totalAvailableScore) {
        // 有红点状态
        sendClickPingback(PARK_PAGE, TOPIC_PK_BLOCK, TOPIC_PK_MY_LIST_HAVE_POINT_CLICK)
      } else {
        sendClickPingback(PARK_PAGE, TOPIC_PK_BLOCK, TOPIC_PK_MY_LIST_NOT_POINT_CLICK)
      }
    }
    // this.setState({
    //   hideAllModal: true
    // }, () => {
    //   this.props.goTo('TopicPk', {
    //       initialPage: init,
    //       beforeBack: () => {
    //       this.setState({
    //         hideAllModal: false
    //       })
    //     }
    //   })
    // })
    this.props.goTo('TopicPk', {
      initialPage: init,
      beforeBack: this.initData,
      params: {
        from: 'topiccard', // 用于话题pk页面判断是否来源于乐园的话题card
      }
    })
  }

  onChildUpdate({modalState = null} = {}) {
    if(modalState !== null) {
      this.setState({
        modalState: {
          ...this.state.modalState,
          ...modalState,
        }
      })
    }
  }

  onModalConfirm(modalMode) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        modalVisible: false,
      }
    })
    setTimeout(() => {
      if(modalMode === 'reminder') {
        this.goToShare()
      }
    }, 200)
  }

  onModalClose() {
    this.setState({
      modalState: {
        ...this.state.modalState,
        modalVisible: false,
      }
    })
  }

  goToShare() {
    const {contents} = this.state
    if(!contents || !contents.length) return

    const {
      name,
      options: [
        {title: titleA, picture},
        {title: titleB}
      ],
    } = contents[0]
    const options = {
      title: `${titleA} VS ${titleB}`,
      url: TOPIC_PK_SHARE_URL[GET_ENV()],
      text: name,
      shareType: 1,
      pic: picture,
    }

    shareSNS(options)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  navRightWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxWrapper: {
    marginBottom: 15
  },
  titleBox: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  itemWrap: {
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 0.5,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  }
})
