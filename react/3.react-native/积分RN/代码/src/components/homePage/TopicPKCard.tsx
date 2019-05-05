/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 话题PKcard 直接从TopicPK文件拷过来 这些组将内的功能应该放到组件内部实现 引用的时候直接传需要的数据就可以 功能不应该暴露
 * @Date: 2019-04-23 13:30:57
 * @LastEditTime: 2019-04-29 22:23:53
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View} from '@iqiyi/rn-ui';
import {GET_ENV, TOPIC_PK_SHARE_URL} from '../../constants/configs';
import {goToLogin, shareSNS} from '../../common/util';
import {getLifeCycleState} from '../topicPk/lifeCycle';
import {changeTotalScore} from '../../actions/TotalScoreActions';
import Modal from '../topicPk/src/Modal';
import {getAvailableReward} from '../topicPk/apis';
import {doVoteTopic, getPkReward} from '../topicPk/buttonPress';
import {changeAvailableScore as changeAvailableScoreAction} from '../../actions/changeAvailableScore';
import TopicBlock from '../topicPk/src/topicCard/TopicBlock';
import {sendClickPingback, sendBlockPingback} from '../../common/pingback';
import {showToast} from '../../common/QYNativeBridge';
import {DrawBoxData} from '../../typings/apis/homePage';
import {
  PARK_PAGE,
  TOPIC_PK_BLOCK,
  getTopicPkButtonCLickPingback,
  getTopicPkCardCLickPingback,
  getTopciPkCardBlock,
} from '../wonderfulPark/pingback';

interface TopicBlockProps {
  goTo: Function;
  item: DrawBoxData;
  totalScore: number;
  isLogin: boolean;
  changeTotalScore?: Function;
  changeAvailableScoreAction?: Function;
  count: number;
  fetchData: Function;
  itemWidth: number;
  itemHeight: number;
}
@(connect(
  (state = {}) => {
    const {scoreInfo = {}, changeAvailableScore = {}} = state;
    return {
      totalScore: scoreInfo.totalScore,
      plusAvailableScore: changeAvailableScore.score,
      time: changeAvailableScore.time
    };
  },
  dispatch =>
    /* eslint implicit-arrow-linebreak: off */
    bindActionCreators(
      {
        changeAvailableScoreAction,
        changeTotalScore
      },
      dispatch
    ),
  null,
  {withRef: true}
) as any)
export default class TopicPk extends Component<TopicBlockProps, {}> {
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!!nextProps.plusAvailableScore && nextProps.time !== prevState.time) {
      return {
        contents: nextProps.item,
        curIndex: nextProps.item.index,
        time: nextProps.time,
        totalAvailableScore: prevState.totalAvailableScore + nextProps.plusAvailableScore
      };
    }
    if(nextProps.contents !== prevState.contents) {
      return {
        contents: nextProps.item,
        curIndex: nextProps.item.index
      };
    }
    return null;
  }

  state = {
    time: 0,
    totalAvailableScore: 0,
    modalState: {
      modalVisible: false,
      modalMode: 'rule',
      content: {},
      buttonText: ''
    },
    contents: {},
    curIndex: 0
  };

  topicBlock = {};
  componentDidMount() {
    this.getReword();
  }

  render() {
    const {
      modalState: {modalVisible, modalMode, content, buttonText},
      contents = {},
      curIndex
    } = this.state;
    if(!contents) return null;
    return (
      <View>
        {this._renderItem(contents, curIndex)}
        <Modal
          modalVisible={modalVisible}
          mode={modalMode}
          content={content}
          buttonText={buttonText}
          onConfirm={() => this.onModalConfirm(modalMode)}
          onClose={() => this.onModalClose()}
        />
      </View>
    );
  }

  initData = () => {
    this.props.fetchData();
    this.getReword();
  };

  _renderItem = (data, index) => {
    sendBlockPingback(PARK_PAGE, getTopciPkCardBlock(index + 1));
    const item = getLifeCycleState({detail: data, userScore: this.props.totalScore});
    if(item && item.id) {
      return (
        <TopicBlock
          key={item.id}
          goTo={this.props.goTo}
          style={[styles.itemWrap]}
          mode={item.mode}
          options={item.topicOptions}
          viewOptions={item.viewOptions}
          buttonOptions={item.buttonOptions}
          onViewPress={(opt, optKey) => this.onViewPress(opt, optKey, item, index)}
          onButtonPress={() => this.onButtonPress(item, index)}
          detail={item.detail}
          period={item.period}
          ref={topick => {
            this.topicBlock[item.id] = topick;
          }}
          index={index}
          initData={this.initData}
        />
      );
    }
    return null;
  };

  getReword() {
    getAvailableReward().then(data => {
      if(data) {
        this.setState({
          totalAvailableScore: data.scores
        });
      }
    });
  }

  onChildUpdate({modalState = null} = {}) {
    if(modalState !== null) {
      this.setState({
        modalState: {
          /* eslint react/no-access-state-in-setstate: off */
          ...this.state.modalState,
          ...modalState
        }
      });
    }
  }

  // 打call
  onViewPress({id: optionId}, optionKey, {detail, topicOptions}, index) {
    sendClickPingback(PARK_PAGE, TOPIC_PK_BLOCK, getTopicPkCardCLickPingback(index + 1));
    const {totalScore, isLogin} = this.props;

    if(!isLogin) {
      return goToLogin();
    }
    try {
      const {userVoteNumber, limitNumber} = topicOptions;
      // 个人投票次数限制
      if(limitNumber && userVoteNumber && parseInt(limitNumber) <= parseInt(userVoteNumber)) {
        return showToast(`投票上限${limitNumber}票，邀请小伙伴来投～`);
      }
    } catch (e) {} // eslint-disable-line
    if(totalScore < detail.price) {
      return showToast(`投票还差${detail.price - totalScore}积分，去赚积分`);
    }

    doVoteTopic(detail, optionId, totalScore)
      .then(({userVoteNumber}) => {
        this.initData();
        this.props.changeTotalScore(0 - parseFloat(detail.price));
        if(userVoteNumber === 1) {
          this.topicBlock[detail.code] && this.topicBlock[detail.code].showShareBubble && this.topicBlock[detail.code].showShareBubble();
        }
        return showToast('投票成功');
      })
      .catch(() => {
        showToast('活动太火爆了，稍后再试～');
      });
  }

  onButtonPress(item, index) {
    sendClickPingback(PARK_PAGE, TOPIC_PK_BLOCK, getTopicPkButtonCLickPingback(index + 1));
    const {
      topicOptions: {buttonTodo},
      detail: {each_reward: eachReward, user_vote_number: userVoteNumber}
    } = item;
    const totalReward = userVoteNumber * eachReward;
    // 领取奖励
    if(buttonTodo === 'getReward') {
      getPkReward(item).then(() => {
        this.initData();
        this.props.changeAvailableScoreAction(0 - parseFloat(totalReward as any));
        this.onChildUpdate({
          modalState: {
            modalVisible: true,
            modalMode: 'reminder',
            content: {
              id: 'getReward',
              title: `${totalReward}积分领取成功`,
              iconName: 'topicpk/modal-get-score'
            },
            buttonText: '邀好友一起赢积分'
          }
        });
      });
    }
  }

  onModalConfirm(modalMode) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        modalVisible: false
      }
    });
    setTimeout(() => {
      if(modalMode === 'reminder') {
        this.goToShare();
      }
    }, 200);
  }

  onModalClose() {
    this.setState({
      modalState: {
        ...this.state.modalState,
        modalVisible: false
      }
    });
  }

  goToShare() {
    const {contents} = this.state;
    if(!contents) return;

    const {
      name,
      options: [{title: titleA, picture}, {title: titleB}]
    } = contents[0];
    const options = {
      title: `${titleA} VS ${titleB}`,
      url: TOPIC_PK_SHARE_URL[GET_ENV()],
      text: name,
      shareType: 1,
      pic: picture
    };

    shareSNS(options);
  }
}

const styles = StyleSheet.create({
  itemWrap: {
    marginBottom: 0
  }
});
