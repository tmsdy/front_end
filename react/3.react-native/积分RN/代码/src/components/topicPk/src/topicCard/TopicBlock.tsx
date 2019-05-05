/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 话题PK组件 只是改成TS文件 里面逻辑没有重构
 * @Date: 2019-04-26 15:05:54
 */

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';

import {GET_ENV, TOPIC_PK_SHARE_URL} from '../../../../constants/configs';
import {shareSNS} from '../../../../common/util';

import TopicButton from '../TopicButton';
import ImageView from './ImageView';
import ChartView from '../ChartView';
import {fetchTopicViewCompleteVotes, getAvailableReward} from '../../apis';

import {TEXT_COLOR_DEFAULT, TEXT_COLOR_PRIMARY, TEXT_COLOR_TIPS} from '../../constants';
import WebImage from '../../../WebImage';
import {sendClickPingback} from '../../../../common/pingback';
import px2dp from '../../../../common/px2dp'

const DEVICE_WIDTH = Width;
const BLOCK_WIDTH = DEVICE_WIDTH - 55;
const BLOCK_HEIGHT = 0.95 * BLOCK_WIDTH;
const TITLE_WIDTH = BLOCK_WIDTH - 40;

const ICON_MAP = {
  success: 'topick/success_icon',
  fail: 'topick/fail_icon'
};

interface Options {
  title?: string;
  showButton?: boolean;
  buttonText?: string;
  userVoteNumber?: number;
  viewCompleteVotes?: boolean;
  showText: string;
  checkedKey?: number;
  showCheckedStatus?: boolean;
  extra?: string;
}
interface TopicBlockProps {
  mode?: string;
  options?: Options;
  style?: object;
  viewOptions: any;
  buttonOptions: object;
  voteResult?: string;
  goTo: Function;
  initData?: Function;
  detail?: any;
  period?: string;
  voteResultOptions?: any;
  onButtonPress: Function;
  onViewPress: Function;
  index?: number;
}
interface State {
  showAllNum: boolean;
  shareBubbleVisible: boolean;
  totalAvailableScore: number;
}
export default class TopicBlock extends Component<TopicBlockProps, {}> {
  static defaultProps: TopicBlockProps = {
    mode: 'image',
    options: {
      title: '',
      showButton: false,
      showText: '',
      buttonText: '',
      extra: ''
    },
    viewOptions: {},
    buttonOptions: {},
    onViewPress: () => null,
    onButtonPress: () => null,
    goTo: () => null
  };

  state: State = {
    showAllNum: false,
    shareBubbleVisible: false,
    totalAvailableScore: 0
  };

  componentDidMount() {
    this.getReword();
  }

  render() {
    const {
      mode,
      options: {title, showButton, buttonText, userVoteNumber, viewCompleteVotes},
      viewOptions,
      buttonOptions,
      style,
      voteResult
    } = this.props;
    const {showAllNum} = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.gotoTopic}>
        <View style={[styles.container, style]}>
          {this._renderNewTopBox()}
          {mode !== 'image' && !!voteResult && <WebImage name={ICON_MAP[voteResult]} style={{width: 69, height: 60, position: 'absolute', right: 0, top: 0}} />}
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {mode === 'image' ? (
            <ImageView {...viewOptions} userVoteNumber={userVoteNumber} showAllNum={viewCompleteVotes || showAllNum} onPress={(i, k) => this._onPress(i, k)} />
          ) : (
            <ChartView {...viewOptions} />
          )}
          {this._renderVoteResultBar()}
          {showButton ? <TopicButton {...buttonOptions} text={buttonText} onPress={() => this.onButtonPress()} /> : null}
          {this._renderExtra()}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // 跳转话题pk
  gotoTopic = () => {
    const {totalAvailableScore} = this.state;
    this.props.goTo
      && this.props.goTo('TopicPk', {
        beforeBack: this.props.initData,
        initialPage: totalAvailableScore ? 1 : 0
      });
  };

  _renderVoteResultBar = () => {
    const {
      options: {checkedKey, showCheckedStatus, userVoteNumber},
      voteResultOptions,
      voteResult
    } = this.props;
    if(!voteResultOptions) {
      return null;
    }
    const leftIcon = voteResult === 'success' ? 'topick/blue_arrow' : 'topick/fail_arrow_left';
    const leftColor = voteResult === 'success' ? '#53A2FF' : '#C7C7C7';
    const rightIcon = voteResult === 'success' ? 'topick/red_arrow' : 'topick/fail_arrow';
    const rightColor = voteResult === 'success' ? '#FF72A8' : '#C7C7C7';
    return (
      <View style={styles.voteBar}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.voteNum}>
            {voteResultOptions.left}
            <Text style={styles.piaoText}>票</Text>
          </Text>
          {!!showCheckedStatus && [0, 1].indexOf(checkedKey) !== -1 && checkedKey === 0 && (
            <View style={styles.center}>
              <WebImage name={leftIcon} style={{width: 4, height: 6}} />
              <Text style={[styles.voteText, {backgroundColor: leftColor}]}>已投{userVoteNumber}票</Text>
            </View>
          )}
        </View>
        <View style={{flexDirection: 'row'}}>
          {!!showCheckedStatus && [0, 1].indexOf(checkedKey) !== -1 && checkedKey === 1 && (
            <View style={styles.center}>
              <Text style={[styles.voteText, {backgroundColor: rightColor}]}>已投{userVoteNumber}票</Text>
              <WebImage name={rightIcon} style={{width: 4, height: 6}} />
            </View>
          )}
          <Text style={styles.voteNum}>
            {voteResultOptions.right}
            <Text style={styles.piaoText}>票</Text>
          </Text>
        </View>
      </View>
    );
  };

  showShareBubble = () => {
    this.setState(
      {
        shareBubbleVisible: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            shareBubbleVisible: false
          });
        }, 3000);
      }
    );
  };

  showAllVoteNum = () => {
    this.setState({
      showAllNum: true
    });
  };

  onButtonPress() {
    this.props.onButtonPress();
  }

  _onPress(i, k) {
    this.props.onViewPress(i, k);
  }

  _renderExtra() {
    this.props.options.extra.slice;
    const {
      options: {extra = ''},
      period,
      detail
    } = this.props;
    if(extra === '' || !extra) {
      return null;
    }
    if(typeof extra === 'string') {
      return <Text style={styles.extraWrapper}>{extra}</Text>;
    }
    return (
      <View style={{width: '100%', alignItems: 'center', marginTop: px2dp(12), flexDirection: 'row', justifyContent: 'space-between'}}>
        <View />
        <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: 12, color: '#333', alignSelf: 'center'}}>
          {period === 'in' && detail.price}
          {period === 'in' && (extra as any).slice(0, 1).map(({text}) => {
            return /^hl\|/.test(text) ? text.slice(3) : text;
          })}
          {this.getText()}
        </Text>
        {this._renderShare()}
      </View>
    )
  }

  fetchToViewAllVotes(id) {
    const param = {
      topicCode: id
    };
    fetchTopicViewCompleteVotes(param)
      .then(({viewCompleteVotes}) => {
        if(viewCompleteVotes) {
          this.showAllVoteNum();
        }
      })
      .catch(() => {});
  }

  goToShare(props) {
    const {
      options: {title, picture, viewCompleteVotes},
      detail,
      viewOptions: {
        lists: [{title: titleA}, {title: titleB}]
      },
      index
    } = props;
    const {user_vote_number: userVoteNumber} = detail;
    const {showAllNum} = this.state;
    const options = {
      title: `${titleA} VS ${titleB}`,
      url: `${TOPIC_PK_SHARE_URL[GET_ENV()]}?id=${encodeURIComponent(detail.code)}`,
      text: title,
      shareType: 1,
      pic: picture,
      /* eslint no-nested-ternary: off */
      dialogTitle: userVoteNumber ? (showAllNum || viewCompleteVotes ? '分享至' : '分享成功即可查看完整票数') : '分享至'
    };
    if(userVoteNumber) {
      if(showAllNum || viewCompleteVotes) {
        sendClickPingback('topic_list', 'topiccard2_share', `topiccard2_share${parseInt(index) + 1}`);
      } else {
        sendClickPingback('topic_list', 'topiccard_share', `topiccard_share${parseInt(index) + 1}`);
      }
    } else {
      sendClickPingback('topic_list', 'topiccard2_share', `topiccard2_share${parseInt(index) + 1}`);
    }

    shareSNS(options, () => {
      this.fetchToViewAllVotes(detail.code);
    });
  }

  // 新的顶部信息
  _renderNewTopBox() {
    return (
      <View style={styles.newTopBox}>
        <View style={styles.newTopBoxLeft}>
          <WebImage name="topicpk/pkicon" style={{width: 15, height: 15}} />
          <Text style={{fontFamily: 'PingFangSC-Semibold', fontSize: 14, color: '#333', marginLeft: 5}}>话题PK</Text>
          <View style={{width: 0.5, height: 11, backgroundColor: '#eee', marginHorizontal: 5}} />
          {this._renderTopExtra()}
        </View>
        <TouchableOpacity onPress={() => this.gotoTopic()}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {!!this.state.totalAvailableScore && <WebImage name="topicpk/red-dot" style={{width: 23, height: 23}} />}
            <WebImage name="topicpk/pkmore" style={{width: 7, height: 12}} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //
  _renderTopExtra() {
    const {
      options: {extra = ''},
      period = ''
    } = this.props;
    const formatExtra = period === 'in' ? extra.slice(1) : extra
    if(extra === '' || !extra) {
      return null;
    }
    if(typeof extra === 'string') {
      return <Text style={styles.extraWrapper}>{extra}</Text>;
    }
    return (
      <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: 12, color: '#999'}}>
        {(formatExtra as any).map(({text}) => {
          return /^hl\|/.test(text) ? text.slice(3) : text;
        })}
      </Text>
    );
  }

  getText() {
    const {
      options: {showText, buttonText}
    } = this.props;
    const list = showText && /([^:]+)(\d\d:\d\d)([^\d]+)/.exec(buttonText);
    if(!!showText && list.length === 4) {
      return list[0];
    }
    return ''
  }

  _renderShare() {
    const {
      options: {viewCompleteVotes},
      period
    } = this.props;
    const {shareBubbleVisible} = this.state;
    const shareText = viewCompleteVotes ? '分享给好友' : '分享查看完整票数';
    return (
      <View style={styles.shareBox}>
        {!!shareBubbleVisible && period === 'in' && (
          <View style={styles.bubbleBox}>
            <View style={styles.bubbleWrapper}>
              <Text style={styles.bubbleText}>{shareText}</Text>
            </View>
            <WebImage name="topick/bubble_black" style={{width: px2dp(7), height: px2dp(13), marginLeft: -1}} />
          </View>
        )}
        {period === 'in' && (
          <TouchableOpacity activeOpacity={1} onPress={() => this.goToShare(this.props)}>
            <WebImage name="topick/share_icon" style={{width: px2dp(25), height: px2dp(25)}} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
  // 是否显示小红点

  getReword() {
    getAvailableReward().then(data => {
      if(data) {
        this.setState({
          totalAvailableScore: data.scores
        });
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: BLOCK_WIDTH,
    height: BLOCK_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 0.5,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 0
    }
  },
  title: {
    maxWidth: px2dp(TITLE_WIDTH),
    height: px2dp(46),
    lineHeight: 23,
    marginBottom: px2dp(15),
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR_DEFAULT
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    height: 20,
    marginTop: 2
  },
  checkedText: {
    lineHeight: 14,
    fontSize: 10,
    color: '#666666'
  },
  extraWrapper: {
    width: '100%',
    height: 16,
    lineHeight: 12,
    paddingVertical: 2,
    marginTop: 7,
    textAlign: 'center',
    fontSize: 12,
    color: TEXT_COLOR_TIPS
  },
  extraHighlight: {
    lineHeight: 12,
    paddingVertical: 2,
    fontSize: 12,
    color: TEXT_COLOR_PRIMARY
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    position: 'absolute'
  },
  bubbleWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: px2dp(35),
    paddingHorizontal: 15,
    borderRadius: 50
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 35
  },
  newTopBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: px2dp(50)
  },
  newTopBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  topText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999'
  }
});
