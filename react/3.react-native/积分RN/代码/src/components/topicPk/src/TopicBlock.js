/**
 * Created by liuzhimeng.
 * @date 2018/9/14
 * @description 单个话题PK
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import {
  Width,
} from '@iqiyi/rn-utils'

import {GET_ENV, TOPIC_PK_SHARE_URL} from '../../../constants/configs'
import {shareSNS} from '../../../common/util'

import TopicButton from './TopicButton'
import ImageView from './ImageView'
import ChartView from './ChartView'
import {fetchTopicViewCompleteVotes} from '../apis'

import {
  BORDER_COLOR,
  TEXT_COLOR_DEFAULT,
  TEXT_COLOR_PRIMARY,
  TEXT_COLOR_TIPS,
} from '../constants'
import WebImage from '../../WebImage';
import {sendClickPingback} from '../../../common/pingback';

const DEVICE_WIDTH = Width
const BLOCK_WIDTH = DEVICE_WIDTH - 30
const TITLE_WIDTH = BLOCK_WIDTH - 60
const CHART_WIDTH = DEVICE_WIDTH - 50

const ICON_MAP = {
  success: 'topick/success_icon',
  fail: 'topick/fail_icon',
}
export default class TopicBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllNum: false,
      shareBubbleVisible: false
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     shareBubbleVisible: false
    //   })
    // }, 3000);
  }

  render() {
    const {
      mode,
      options: {
        title,
        showButton,
        buttonText,
        userVoteNumber,
        viewCompleteVotes
      },
      viewOptions,
      buttonOptions,
      style,
      voteResult,
    } = this.props
    const {showAllNum} = this.state
    return (
      <View style={[styles.container, style]}>
       {this.renderTopBox()}
        {mode !== 'image' && !!voteResult && <WebImage name={ICON_MAP[voteResult]} style={{width: 69, height: 60, position: 'absolute', right: 0, top: 0}}/>}
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        {mode === 'image'
          ? <ImageView {...viewOptions} userVoteNumber={userVoteNumber} showAllNum={viewCompleteVotes || showAllNum} onPress={(i, k) => this._onPress(i, k)}/>
          : <ChartView {...viewOptions}/>
        }
        {
          this._renderVoteResultBar()
        }
        {/* <View style={[styles.textWrapper, {justifyContent: checkedKey === 0 ? 'flex-start' : 'flex-end'}]}>
          {showCheckedStatus && [0, 1].indexOf(checkedKey) !== -1 && <Text style={styles.checkedText}>已投{userVoteNumber}票</Text>}
        </View> */}
        {showButton
          ? <TopicButton {...buttonOptions} text={buttonText} onPress={() => this.onButtonPress()}/>
          : null
        }
        {this._renderExtra()}
      </View>
    )
  }

  goToShare(props) {
    const {
      options: {
        title,
        picture,
        viewCompleteVotes
      },
      detail,
      viewOptions: {
        lists: [
          {title: titleA},
          {title: titleB}
        ]
      },
      index
    } = props
    const {user_vote_number: userVoteNumber} = detail
    const {showAllNum} = this.state
    const options = {
      title: `${titleA} VS ${titleB}`,
      url: `${TOPIC_PK_SHARE_URL[GET_ENV()]}?id=${encodeURIComponent(detail.code)}`,
      text: title,
      shareType: 1,
      pic: picture,
      dialogTitle: userVoteNumber ? (showAllNum || viewCompleteVotes) ? '分享至' : '分享成功即可查看完整票数' : '分享至'
    }
    if(userVoteNumber) {
      if(showAllNum || viewCompleteVotes) {
        sendClickPingback('topic_list', 'topiccard2_share', `topiccard2_share${parseInt(index) + 1}`)
      } else {
        sendClickPingback('topic_list', 'topiccard_share', `topiccard_share${parseInt(index) + 1}`)
      }
    } else {
      sendClickPingback('topic_list', 'topiccard2_share', `topiccard2_share${parseInt(index) + 1}`)
    }

    shareSNS(options, () => {
      this.fetchToViewAllVotes(detail.code)
    })
  }

  fetchToViewAllVotes(id) {
    const param = {
      topicCode: id
    }
    fetchTopicViewCompleteVotes(param).then(({viewCompleteVotes}) => {
      if(viewCompleteVotes) {
        this.showAllVoteNum()
      }
    }).catch(() => {

    })
  }

  _renderExtra() {
    const {
      options: {
        extra = '',
      },
      period,
      detail
    } = this.props
    if(extra === '' || !extra) {
      return null
    }
    if(typeof extra === 'string') {
      return <Text style={styles.extraWrapper}>{extra}</Text>
    }
    if(period === 'in') {
      return (
        <View style={{backgroundColor: '#FFF8F3', height: 22, borderRadius: 22, paddingVertical: 3.5, marginTop: 7, paddingHorizontal: 10, alignItems: 'center'}}>
          <Text style={[styles.extraWrapper, {marginTop: 0, lineHeight: 15}]}>
          <Text style={styles.extraHighlight}>{detail.price}</Text>
            {extra.map(({id, text}) => {
              return /^hl\|/.test(text)
                ? <Text key={id} style={styles.extraHighlight}>{text.slice(3)}</Text>
                : text
            })}
          </Text>
        </View>
      )
    }
    return (
      <Text style={styles.extraWrapper}>
        {extra.map(({id, text}) => {
          return /^hl\|/.test(text)
            ? <Text key={id} style={styles.extraHighlight}>{text.slice(3)}</Text>
            : text
        })}
      </Text>
    )
  }

  renderTopBox = () => {
    const {
      options: {
        showText,
        buttonText,
        viewCompleteVotes
      },
      detail,
      period,
    } = this.props
    const {shareBubbleVisible} = this.state
    const showRewardIcon = period === 'in' && detail.draw_time - Date.now() < 4 * 60 * 60 * 1000
    const list = showText && /([^:]+)(\d\d:\d\d)([^\d]+)/.exec(buttonText)
    const shareText = viewCompleteVotes ? '分享给好友' : '分享查看完整票数'
    return (
      <View style={styles.topBox}>
        <View style={styles.timeBox}>
          {!!showRewardIcon && <WebImage name="topick/ready_icon" style={{width: 70, height: 17}}/>}
            {!!showText && list.length === 4 && !showRewardIcon &&
              <Text style={[styles.buttonText, {textAlign: 'left'}, !showRewardIcon && {marginLeft: 10}]}>{list[1]}<Text style={{color: '#FF6600'}}>{list[2]}</Text>{list[3]}</Text>
            }
            {!!showText && list.length === 4 && !!showRewardIcon && <Text style={{color: '#FF6600'}}>{list[2]}</Text>}
        </View>
        <View style={styles.shareBox}>
          {!!shareBubbleVisible && period === 'in' &&
            (<View style={styles.bubbleBox}>
              <View style={styles.bubbleWrapper}>
                <Text style={styles.bubbleText}>{shareText}</Text>
              </View>
              <WebImage name="topick/bubble_black" style={{width: 5, height: 13, marginLeft: -1}}/>
             </View>
          )}
          {period === 'in' &&
          <TouchableOpacity activeOpacity={1} onPress={() => this.goToShare(this.props)} style={{position: 'absolute', right: 5}}>
            <WebImage name="topick/share_icon" style={{width: 25, height: 25}}/>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  _renderVoteResultBar = () => {
    const {
      options: {
        checkedKey,
        showCheckedStatus,
        userVoteNumber,
      },
      voteResultOptions,
      voteResult
    } = this.props
    if(!voteResultOptions) {
      return null
    }
    const leftIcon = voteResult === 'success' ? 'topick/blue_arrow' : 'topick/fail_arrow_left'
    const leftColor = voteResult === 'success' ? '#53A2FF' : '#C7C7C7'
    const rightIcon = voteResult === 'success' ? 'topick/red_arrow' : 'topick/fail_arrow'
    const rightColor = voteResult === 'success' ? '#FF72A8' : '#C7C7C7'
    return (
      <View style={styles.voteBar}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.voteNum}>{voteResultOptions.left}<Text style={styles.piaoText}>票</Text></Text>
          {!!showCheckedStatus && [0, 1].indexOf(checkedKey) !== -1 && checkedKey === 0 &&
            <View style={styles.center}>
              <WebImage name={leftIcon} style={{width: 4, height: 6}}/>
              <Text style={[styles.voteText, {backgroundColor: leftColor}]}>已投{userVoteNumber}票</Text>
            </View>}
        </View>
        <View style={{flexDirection: 'row'}}>
          {!!showCheckedStatus && [0, 1].indexOf(checkedKey) !== -1 && checkedKey === 1 &&
            <View style={styles.center}>
              <Text style={[styles.voteText, {backgroundColor: rightColor}]}>已投{userVoteNumber}票</Text>
              <WebImage name={rightIcon} style={{width: 4, height: 6}}/>
            </View>}
            <Text style={styles.voteNum}>{voteResultOptions.right}<Text style={styles.piaoText}>票</Text></Text>
        </View>
      </View>
    )
  }

  _onPress(i, k) {
    this.props.onViewPress(i, k)
  }

  onButtonPress() {
    this.props.onButtonPress()
  }

  showShareBubble = () => {
    this.setState({
      shareBubbleVisible: true
    }, () => {
      setTimeout(() => {
        this.setState({
          shareBubbleVisible: false
        })
      }, 3000)
    })
  }
  showAllVoteNum = () => {
    this.setState({
      showAllNum: true
    })
  }
}

TopicBlock.propTypes = {
  mode: PropTypes.string,
  options: PropTypes.object,
  viewOptions: PropTypes.object,
  buttonOptions: PropTypes.object,
  onViewPress: PropTypes.func,
  onButtonPress: PropTypes.func,
  extra: PropTypes.string,
}

TopicBlock.defaultProps = {
  mode: 'image',
  options: {
    title: '',
    showButton: false,
    showText: false,
    buttonText: '',
    extra: '',
  },
  viewOptions: {},
  buttonOptions: {},
  extra: '',
  onViewPress: () => null,
  onButtonPress: () => null,
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BLOCK_WIDTH,
    marginBottom: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: .5,
    borderColor: BORDER_COLOR,
    backgroundColor: '#ffffff',
  },
  title: {
    maxWidth: TITLE_WIDTH,
    lineHeight: 22,
    marginBottom: 14,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR_DEFAULT,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    height: 20,
    marginTop: 2,
  },
  checkedText: {
    lineHeight: 14,
    fontSize: 10,
    color: '#666666',
  },
  extraWrapper: {
    width: '100%',
    height: 16,
    lineHeight: 12,
    paddingVertical: 2,
    marginTop: 7,
    textAlign: 'center',
    fontSize: 12,
    color: TEXT_COLOR_TIPS,
  },
  extraHighlight: {
    lineHeight: 12,
    paddingVertical: 2,
    fontSize: 12,
    color: TEXT_COLOR_PRIMARY,
  },
  buttonText: {
    lineHeight: 18,
    paddingVertical: 3,
    fontSize: 12,
    color: TEXT_COLOR_TIPS,
    fontFamily: 'PingFangSC-Regular'
  },
  voteNum: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold'
  },
  piaoText: {
    color: '#2A2A2A',
    fontSize: 14,
    fontWeight: '300'
  },
  voteBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    marginTop: 8,
    marginBottom: 10
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  voteText: {
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 16,
    height: 16,
    paddingHorizontal: 4
  },
  topBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: BLOCK_WIDTH,
    alignItems: 'center',
    height: 35
  },
  timeBox: {
    flexDirection: 'row',
    paddingTop: 5,
    alignItems: 'center'
  },
  shareBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bubbleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    right: 35,
    position: 'absolute',
  },
  bubbleWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: 35,
    paddingHorizontal: 15,
    borderRadius: 50
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 35
  }
})
