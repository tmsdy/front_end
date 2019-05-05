/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 话题PKcard 直接从TopicPK文件拷过来 这些组将内的功能应该放到组件内部实现 引用的时候直接传需要的数据就可以 功能不应该暴露
 * @Date: 2019-04-23 13:30:57
 * @LastEditTime: 2019-04-24 15:50:25
 */

import React, {Component} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {View, Text, Image} from '@iqiyi/rn-ui';
import SwiperCardStyles from './SwiperCardStyles'
import WebImage from '../WebImage'
import px2dp from '../../common/px2dp'
import GradientView from '../GradientView'
import BaseStyleSheet from '../../common/BaseStyleSheet'
import {goToPGC} from '../../common/util/index'
import ScaleAnimation from '../Animation/ScaleAnimation'
import {sendClickPingback, sendBlockPingback} from '../../common/pingback'

interface AnswerProps {
  item: {
    [key: string]: any;
  };
  goTo(pageName: string, config: any): void;
  openWeb(url: string): void;
  totalScore?: number;
}

@(connect(
  (state = {}) => {
    const {questionInfo = {}} = state;
    return {
      totalScore: questionInfo.unreceiveScore
    };
  },
  null,
  null,
  {withRef: true}
) as any)
export default class AnswerCard extends Component<AnswerProps, {}> {
  static defaultProps = {
    item: {}
  }

  render() {
    const {
      item = {}
    } = this.props;
    if(!item) return null;
    return (
      <TouchableWithoutFeedback key={item.id} onPress={this._viewDetail}>
        <View style={SwiperCardStyles.boxWrapper}>
          <View style={styles.questionInner}>
            {this._renderNewTopBox()}
            <View style={SwiperCardStyles.contentView}>
              <Text style={SwiperCardStyles.title} numberOfLines={2}>{item.content}</Text>
            </View>
            {
              item.answerList[0]
              ? this.renderFirstAnswer(item.answerList[0])
              : this.renderNoAnswer()
            }
            <ScaleAnimation>
              <TouchableWithoutFeedback style={styles.buttomButton} onPress={() => { this._answer({showKeyBoard: true}) }}>
                <View style={[styles.buttomButton, {marginTop: px2dp(21)}]}>
                  <GradientView style={[styles.buttomButton, styles.buttomButtonGrad]} startColor="#FF410F" endColor="#FF6100">
                    <Text style={styles.answerButtonText}>我要抢答</Text>
                  </GradientView>
                </View>
              </TouchableWithoutFeedback>
            </ScaleAnimation>
            <Text style={styles.count}>
              {item.answerCount}人已回答该题领积分
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderFirstAnswer = (data) => {
    return (
      <GradientView startColor="#FFFBFB" endColor="#FFF7EB" style={styles.hotCont}>
        <TouchableWithoutFeedback style={styles.answerTextContent} onPress={() => { this.goPgc(data) }}>
          <View style={styles.answerTextContent} numberOfLines={2}>
            <Text style={styles.answerText}>{data.content}</Text>
            <Image source={{uri: data.avatar}} style={styles.avatar}/>
          </View>
        </TouchableWithoutFeedback>
        <WebImage name="homepage/answer_hot" style={styles.hot} />
        <WebImage name="homepage/fire" style={styles.fire} />
      </GradientView>
    )
  }

  renderNoAnswer = () => {
    return (
      <TouchableWithoutFeedback onPress={() => { this._answer({showKeyBoard: true}) }}>
        <GradientView startColor="#FFFBFB" endColor="#FFF7EB" style={styles.hotCont}>
          <Text style={styles.noAnswerText}>还没有脑洞哦 ，抢答领积分吧</Text>
          <WebImage name="homepage/noanswer" style={[styles.fire, styles.noAnswerIcon]} />
        </GradientView>
      </TouchableWithoutFeedback>
    )
  }

  _lookMore = () => {
    sendClickPingback('pointcenter', '', 'answer_more')
    const {index} = this.props.item
    const {goTo} = this.props
    goTo && goTo('QuestionList', {
      qidIndex: index
    })
  }

  _viewDetail = () => {
    // const {item} = this.props
    this._answer({showKeyBoard: false})
  }

  _answer = ({showKeyBoard = true}) => {
    if(showKeyBoard) {
      sendClickPingback('pointcenter', '', 'answer_call')
    }
    const {item} = this.props
    this.goToDetail(item.id, showKeyBoard)
  }

  goToDetail = (qid, showKeyBoard) => {
    const {goTo} = this.props
    goTo && goTo('QuestionDetail', {
      qid,
      showKeyBoard
    })
  }

  goPgc = ({uid}) => {
    const {openWeb} = this.props;
    goToPGC({openWeb, uid})
  }


  // 新的顶部信息
  _renderNewTopBox() {
    return (
      <TouchableWithoutFeedback onPress={this._lookMore}>
        <View style={SwiperCardStyles.newTopBox}>
          <View style={SwiperCardStyles.newTopBoxLeft}>
            <WebImage name="homepage/answer_qot" style={{width: 15, height: 15}} />
            <Text style={{fontFamily: 'PingFangSC-Semibold', fontSize: 14, color: '#333', marginLeft: 5}}>脑洞大赏</Text>
            <View style={{width: 0.5, height: 11, backgroundColor: '#eee', marginHorizontal: 5}} />
            <Text style={SwiperCardStyles.extraWrapper}>答题赢积分</Text>
          </View>
          <View style={SwiperCardStyles.iconButton}>
              {!!this.props.totalScore && <WebImage name="topicpk/red-dot" style={{width: 23, height: 23}} />}
              <WebImage name="topicpk/pkmore" style={{width: 7, height: 12}} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = BaseStyleSheet.create({
  questionInner: {
    paddingHorizontal: 22,
    alignItems: 'center'
  },
  hotCont: {
    width: px2dp(275),
    height: px2dp(80),
    borderRadius: px2dp(5),
    justifyContent: 'center'
  },
  hot: {
    width: px2dp(75),
    height: px2dp(30),
    position: 'absolute',
    top: 0,
    left: 0
  },
  answerText: {
    color: '#666',
    fontSize: px2dp(14),
    lineHeight: px2dp(20),
  },
  answerTextContent: {
    paddingLeft: px2dp(25),
    maxWidth: px2dp(253)
  },
  fire: {
    width: px2dp(75),
    height: px2dp(40),
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  avatar: {
    width: px2dp(20),
    height: px2dp(20),
    borderRadius: px2dp(10),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0
  },
  buttomButton: {
    width: px2dp(200),
    height: px2dp(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttomButtonGrad: {
    borderRadius: px2dp(50)
  },
  answerButtonText: {
    fontSize: 16,
    color: '#fff'
  },
  count: {
    fontSize: 12,
    color: '#999',
    marginTop: px2dp(12)
  },
  noAnswerText: {
    fontSize: px2dp(14),
    color: '#ff9d81'
  },
  noAnswerIcon: {
    width: px2dp(53.5),
    height: px2dp(51),
  }
});
