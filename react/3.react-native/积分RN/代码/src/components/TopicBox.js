/**
 * 话题 PK 弹窗
 */
import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { View, Text, Image, ActivityIndicator } from '@iqiyi/rn-ui'
import WebImage from '../components/WebImage'
import ConfirmModal from '../components/ConfirmModal'
import { showToast } from '../common/QYNativeBridge'
import { getTopicInfo, voteTopic, getTopicReward } from '../api'
import { sendBlockPingback, sendClickPingback } from '../common/pingback'
import {TOPIC_PK, GET_ENV} from '../constants/configs'

const H5 = 'http://h5.m.iqiyi.com/static/topicpk/square/index'

const getTimeLeft = (ts) => {
  const ONE_DAY = 24 * 3600 * 1000
  const ONE_HOUR = 3600 * 1000
  const ONE_MINUTE = 60 * 1000
  const ONE_SECOND = 1000
  const now = Date.now()
  if (ts > now) {
    if ((ts - now) / ONE_DAY >= 1) {
      return `${Math.floor((ts - now) / ONE_DAY)}天`
    } else if ((ts - now) / ONE_HOUR >= 1) {
      return `${Math.floor((ts - now) / ONE_HOUR)}小时`
    } else if ((ts - now) / ONE_MINUTE >= 1) {
      return `${Math.floor((ts - now) / ONE_MINUTE)}分钟`
    }
    return `${(ts - now) / ONE_SECOND}秒`
  }
  return 0
}

export default class extends Component {
  state = {
    isLoading: true,
    topic: null,
    user_option_code: null,
    btnTxt: '',
    btnTxtSuccess: '',
    showGetRewardButton: false,
  }

  componentDidMount() {
    this.getData().catch(() => {
      sendBlockPingback('homeRN', 900300)
      this.props.viewMore(TOPIC_PK[GET_ENV()])
    })

    const { btnTxtSuccess, topic } = this.state
    if (btnTxtSuccess && !topic.user_reward_given) {
      this.timer = setInterval(() => {
        const countdown = getTimeLeft(topic.draw_time)
        if (countdown) {
          this.setState({
            btnTxtSuccess: `打Call成功，还有${countdown}揭晓答案`
          })
        } else {
          clearInterval(this.timer)
          this.getData()
        }
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  getData = () => {
    return getTopicInfo().then((data) => {
      const topic = data
      this.setState({
        topic,
        isLoading: false
      })
      this._renderBtn(topic)
    })
  }

  _renderBtn = (topic) => {
    //  未投票，已过期
    if (!topic.user_option_code && !getTimeLeft(topic.end_time)) {
      return this.setState({
        btnTxtSuccess: '打Call已结束'
      })
    }
    let str = ''
    // 已投票，已开奖
    if (topic.user_option_code) {
      this.setState({
        user_option_code: topic.user_option_code
      })

      if (topic.win_option_code) {
        if (topic.user_reward_given) {
          str = `已领取${topic.each_reward}积分`
        } else if (topic.user_option_code === topic.win_option_code) {
          str = `领取${topic.each_reward}积分`
          this.setState({
            showGetRewardButton: true
          })
        } else {
          str = '好遗憾，未猜中'
        }
      } else if (getTimeLeft(topic.end_time)) {
        str = `打Call成功，还有${getTimeLeft(topic.draw_time)}揭晓答案`
      } else {
        str = `打Call已结束，还有${getTimeLeft(topic.draw_time)}揭晓答案`
      }
    }

    this.setState({
      btnTxtSuccess: str,
    })
  }

  selectOption = (o) => {
    const { option_code } = o
    this.setState({
      user_option_code: option_code
    })
  }

  _getReward = () => {
    const { code } = this.state.topic
    const params = {
      topicCode: code
    }

    getTopicReward(params).then((data) => {
      if (data.getRewardSuccessfully) {
        showToast('领取奖励成功')
        this.getData()
      } else {
        showToast('领取奖励失败')
      }
    }).catch(err => showToast('领取奖励失败'))
  }

  // 话题打CALL投票
  vote = () => {
    sendClickPingback('homeRN', 900200, 'topic_pop_call')
    const { user_option_code } = this.state

    if (!user_option_code) {
      sendBlockPingback('home_choose')
      return showToast('请选择你要打call的一方')
    }

    const { code, price, draw_time } = this.state.topic

    if (price > this.props.totalScore) {
      sendBlockPingback('home_lackpoint')
      return showToast('积分不足，快去做任务吧')
    }

    const params = {
      topicCode: code,
      optionCode: user_option_code,
    }

    this.setState({
      btnTxt: '打Call中...'
    })

    voteTopic(params).then((data) => {
      if (data.voteSuccessfully) {
        this.getData()
      }
    }).catch(() => {
      sendBlockPingback('home_callfail')
      showToast('打Call失败，请稍候重试')
      this.setState({
        btnTxt: ''
      })
    })
  }

  // 更多话题
  _viewMore = () => {
    sendClickPingback('homeRN', 900200, 'topic_pop_more')
    this.props.viewMore(H5)
  }

  _renderOptions = () => {
    const { options } = this.state.topic
    return (
      <React.Fragment>
        {options.map((o, index) => (
          <TouchableOpacity
            key={o.title}
            activeOpacity={1}
            onPress={() => this.selectOption(o)}
          >
            <View
              style={[
                styles.pic_box,
                {
                  transform: [
                    {skewX: (index === 0 ? '-6deg' : '0deg')},
                    {perspective: 1000}
                  ]
                }
              ]}
            >
              <Image
                source={{uri: o.picture || 'http://www.iqiyipic.com/common/fix/h5-aura/iqiyi-logo.png'}}
                style={[
                  styles.pic,
                  {
                    transform: [
                      {skewX: (index === 0 ? '6deg' : '-6deg')},
                      {perspective: 1000}
                    ]
                  }
                ]}
              />
            </View>
          </TouchableOpacity>
        ))
      }
      </React.Fragment>
    )
  }

  _renderResult = () => {
    const { options, user_option_code, win_option_code } = this.state.topic
    const totalNumber = options.reduce((a, b) => a.vote_number + b.vote_number)
    const firstPercent = (options[0].vote_number * 100 / totalNumber).toString().split('.')[0]

    return (
      <React.Fragment>
        {options.map((o, index) => (
          <View key={o.title} style={styles.result_box}>
            {
              <Text
                style={
                  o.option_code === (win_option_code || user_option_code) ?
                  styles.win_txt
                  :
                  styles.lose_txt
                }
              >
                {index === 0 ? firstPercent : 100 - firstPercent}%
              </Text>
            }
            {
              (user_option_code === win_option_code) && (o.option_code === win_option_code) &&
              <WebImage name="victory" style={styles.win_icon} />
            }
            {
              (!user_option_code) && (o.option_code === win_option_code) &&
              <WebImage name="victory" style={styles.win_icon} />
            }
            {
              (user_option_code === o.option_code) &&  win_option_code && (o.option_code !== win_option_code) &&
              <WebImage name="loser" style={styles.win_icon} />
            }
          </View>
        ))}
      </React.Fragment>
    )
  }

  _renderCheckBox = () => {
    const { user_option_code, btnTxtSuccess, topic } = this.state
    return (
      <React.Fragment>
        {topic.options.map((o, index) => (
          <TouchableOpacity
            key={o.title}
            activeOpacity={1}
            onPress={() => this.selectOption(o)}
          >
            <View
              style={[
                styles.check_wrap,
                {backgroundColor: btnTxtSuccess ? 'rgba(0,0,0,.4)' : 'rgba(0,0,0,.8)'}
              ]}
            >
            {!btnTxtSuccess && <View style={styles.checkbox} />}
            {
              (!!btnTxtSuccess &&
              (topic.user_option_code === o.option_code ||
              topic.win_option_code === o.option_code)) &&
              <Text style={styles.o_title_win}>{o.title}</Text>
            }
            {
              (!!btnTxtSuccess &&
              (topic.user_option_code !== o.option_code &&
              topic.win_option_code !== o.option_code)) &&
              <Text style={styles.o_title_lose}>{o.title}</Text>
            }
            {
              !btnTxtSuccess &&
              <Text style={styles.o_title}>{o.title}</Text>
            }
            {
              !btnTxtSuccess && user_option_code === o.option_code &&
              <WebImage name="selected" style={styles.select_icon} />
            }
            </View>
          </TouchableOpacity>
        ))}
      </React.Fragment>
    )
  }

  _renderButton = () => {
    const {
      topic,
      btnTxt,
      btnTxtSuccess,
      showGetRewardButton,
    } = this.state
    if (showGetRewardButton) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._getReward}
          style={styles.topic_btn}
        >
          <Text style={styles.btn_txt}>{btnTxtSuccess}</Text>
        </TouchableOpacity>
      )
    } else if (btnTxtSuccess && !showGetRewardButton) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={null}
          style={styles.topic_btn_success}
        >
          <Text style={styles.btn_txt_success}>{btnTxtSuccess}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.vote}
        style={styles.topic_btn}
      >
        <Text style={styles.btn_txt}>{btnTxt || `${topic.price}积分打CALL`}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      isLoading,
      topic,
      btnTxt,
      btnTxtSuccess,
      showGetRewardButton,
    } = this.state
    const {
      topicModalVisible,
      hideTopicModal,
    } = this.props
    return (
      <ConfirmModal
        modalVisible={topicModalVisible}
        showCloseButton
        cancelFn={hideTopicModal}
      >
        {
          isLoading ?
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#0BBE06" text="正在努力加载"/>
          </View>
          :
          (
          <WebImage name="pk_board" style={styles.topicWrapper} >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
              style={styles.scroll_wrapper}
            >
              <WebImage name="topic_title" style={styles.topic_title}>
                <Text style={styles.title_txt} numberOfLines={2}>{topic.name}</Text>
              </WebImage>
              <View style={styles.topic_box} >
                <View style={styles.o_wrap}>
                  {this._renderOptions()}
                </View>
                <View style={styles.r_wrap}>
                  {!!btnTxtSuccess && this._renderResult()}
                </View>
                <View style={styles.c_wrap}>
                  {this._renderCheckBox()}
                </View>
                <View style={[styles.line, { transform: [{skewX: '-6deg'}, {perspective: 1000}]}]} />
                <WebImage name="pk_small" style={styles.pk_icon} />
              </View>
              <View style={styles.topic_desc}>
                <Text style={styles.desc_title}>
                  胜方瓜分<Text style={{color: '#F8E71C'}}>{topic.total_reward}</Text>积分
                </Text>
                <View style={{marginTop: 50, paddingHorizontal: 15}}>
                  <Text style={styles.desc_txt} numberOfLines={8}>
                    活动说明：{topic.description}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <View style={styles.topic_bottom}>
              {
                this._renderButton()
              }
              <TouchableOpacity
                activeOpacity={1}
                onPress={this._viewMore}
              >
                <Text style={[styles.topic_more, {color: btnTxtSuccess ? '#F8E71C' : '#ffffff'}]}>更多话题PK→</Text>
              </TouchableOpacity>
            </View>
          </WebImage>
          )
        }
      </ConfirmModal>
    )
  }
}

const styles = StyleSheet.create({
  loadingBox: {
    width: 315,
    height: 443,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicWrapper: {
    width: 315,
    height: 443,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scroll_wrapper: {
    flex: 1,
    height: 200,
  },
  topic_title: {
    width: 282,
    height: 53.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  title_txt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3738CF',
  },
  topic_box: {
    width: 312,
    height: 150,
    marginTop: 25,
    marginLeft: -8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  o_wrap: {
    width: 312,
    height: 150,
    flexDirection: 'row',
  },
  r_wrap: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 0,
    flexDirection: 'row',
  },
  c_wrap: {
    width: 304,
    height: 30,
    flexDirection: 'row',
    position: 'absolute',
    left: 8,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  result_box: {
    flex: 1,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  win_icon: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: 4,
    left: 10,
  },
  win_txt: {
    fontSize: 30,
    fontWeight: '700',
    color: '#F8E71C',
    backgroundColor: 'transparent',
  },
  lose_txt: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  line: {
    width: 6,
    height: 150,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 157,
  },
  pk_icon: {
    width: 46,
    height: 39.5,
    position: 'absolute',
    top: 55.25,
    left: 133,
  },
  topic_desc: {
    marginTop: 8,
  },
  desc_title: {
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginTop: 15,
  },
  desc_txt: {
    fontSize: 13,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  topic_bottom: {
    width: 315,
    height: 140,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topic_btn: {
    width: 207,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8E71C',
    borderRadius: 50,
  },
  topic_btn_success: {
    width: 266,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(231,225,253,0.93)',
    borderRadius: 50,
  },
  btn_txt_success: {
    fontSize: 15,
    fontWeight: '600',
    color: '#463EC3'
  },
  btn_txt: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6B2250'
  },
  topic_more: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  pic_box: {
    width: 156,
    height: 150,
    overflow: 'hidden',
  },
  pic: {
    width: 156,
    height: 150,
    marginLeft: 8
  },
  check_wrap: {
    width: 152,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  o_title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  o_title_win: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8E71C',
    backgroundColor: 'transparent',
  },
  o_title_lose: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#6444D4',
    position: 'absolute',
    top: 6,
    left: 18,
  },
  select_icon: {
    position: 'absolute',
    width: 21,
    height: 16,
    top: 6,
    left: 19,
  }
})
