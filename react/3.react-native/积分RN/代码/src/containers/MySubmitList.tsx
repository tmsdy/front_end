/**
脑洞投稿站
 */

import React from 'react'
import {DeviceEventEmitter, FlatList, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text, View, ActivityIndicator} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import {setUnreceiveScore} from '../actions/QuestionActions'
import GradientBtn from '../components/GradientBtn';
import {getCDNUrl} from '../constants/configs';
import WebImage from '../components/WebImage';
import NavBar from '../components/DefaultNavBar'
import {hideLoading, showToast} from '../common/QYNativeBridge'
import BasePage from '../components/BasePage'
import {fetchMySubmitList, askToReceiveScore} from '../model/question/questionSubmit'
import {SubmitItem} from '../typings/apis/question.d'
import {getObjectValueSafely} from '../common/util';

const GRADIENT_START_COLOR = '#FFA400'
const GRADIENT_END_COLOR = '#FF7E00'
const STATUS_ICON = {
  approved: 'question/adoption_icon',
  review: 'question/review_icon',
  fail: 'question/fail_icon'
}
const STATUS_TEXT = {
  approved: '已采纳',
  review: '审核中',
  fail: '再接再厉'
}
const STATUS_COLOR = {
  approved: '#FF8000',
  review: '#666666',
  fail: '#C6C6C6'
}

const BG_GRADIENTVIEW_COLOR = [
  ['#B06F57', '#CC8469'],
  ['#AA627F', '#C27CA1'],
  ['#8C94C8', '#7079B1']
]

interface MySubmitProps {
  unreceiveScore: number;
  setUnreceiveScore(s: number): void;
}
interface MySubmitState {
  isLogin: boolean;
  submitList: SubmitItem[];
  total: number;
  initLoading: boolean;
}


@(connect(
  ({questionInfo}) => {
    const {unreceiveScore} = questionInfo
    return {
      unreceiveScore
    };
  },
  dispatch => bindActionCreators({
    setUnreceiveScore
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class MySubmitList extends BasePage<MySubmitProps, MySubmitState> {

  public constructor(props) {
    super(props)

    this.state = {
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
      submitList: [],
      total: 0, // 用户总的投稿数量
      initLoading: true,
    }

    this.requestLock = false;
    this.pageSize = 10; // 每页获取的数量
    this.pageNum = 1; // 当前页号 从1开始
    this.totalSubmitCount = 0; // 总的好友数
    this.isEnd = false; // 是否还有下一页数据
  }

  componentDidMount() {
    hideLoading()
    this.getSubmitList(false)
  }

  render() {
    const {total, submitList, initLoading} = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <NavBar
          type="black"
          title="我的投稿"
          titleColor="#333333"
          backgroundColor="#ffffff"
          rightViewWidth={55}
          backPress={this.back}
        />
        <View style={styles.topBox}>
          <WebImage uri={global.USER_INFO.userIcon || getCDNUrl('default_icon')} style={styles.userIcon}/>
          <Text>已投{total}次</Text>
        </View>
        {initLoading ? (
          <View
            style={{
              flex: 1,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator text="内容即将呈现..."/>
          </View>
        ) : (
          this.renderList()
        )}
      </View>
    )
  }

  renderList = () => {
    const {submitList} = this.state
    if(submitList.length) {
      return (
        <FlatList
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={submitList}
          renderItem={this.renderSubmitItem}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )
    }
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        <Text style={{fontSize: 14, color: '#999999', marginTop: 138}}>没找到内容 T^T，快去开脑洞吧!</Text>
        <GradientBtn
          startColor={GRADIENT_END_COLOR}
          endColor={GRADIENT_START_COLOR}
          btnStyle={{paddingHorizontal: 78, paddingVertical: 11, height: 40, borderRadius: 20, marginTop: 20}}
          press={this.goToSubmit}
        >
          <Text style={{color: '#ffffff', fontSize: 16, textAlign: 'center'}}>我要投稿</Text>
        </GradientBtn>
      </View>
    )
  }

  renderSubmitItem = ({item}) => {
    const {content, pic, timeText, scoreType, type, id} = item
    const iconName = STATUS_ICON[getObjectValueSafely(item, 'type', 'review')]
    const text = STATUS_TEXT[getObjectValueSafely(item, 'type', 'review')]
    const statusColor = STATUS_COLOR[getObjectValueSafely(item, 'type', 'review')]
    return (
      <View style={{paddingTop: 15}}>
          <View style={styles.itemBox}>
            <WebImage uri={pic} style={styles.itemPic}>
              <View style={[styles.statusBar, {backgroundColor: statusColor}]}>
                <WebImage name={iconName} style={{width: 11, height: 11}}/>
                <Text style={{fontSize: 11, color: '#ffffff', marginLeft: 5}}>{text}</Text>
              </View>
            </WebImage>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => this.gotoDetail(item)} activeOpacity={1}>
                <Text style={{color: '#333333', fontSize: 14}} numberOfLines={2}>{content}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => this.gotoDetail(item)} activeOpacity={1}>
                  <Text style={{color: '#999999', fontSize: 11}}>{timeText}</Text>
                </TouchableOpacity>
                {scoreType === 'unreceive' && type === 'approved' && (
                  <GradientBtn
                    startColor={GRADIENT_START_COLOR}
                    endColor={GRADIENT_END_COLOR}
                    btnStyle={styles.btnStyle}
                    press={() => this.getRewardScore(id)}
                  >
                    <Text style={{color: '#ffffff', fontSize: 12, textAlign: 'center'}}>领取200积分</Text>
                  </GradientBtn>
                )}
                {scoreType === 'receive' && type === 'approved' && (
                 <Text style={{color: '#999999', fontSize: 12, textAlign: 'center'}}>已领取200积分</Text>
                )}
              </View>
            </View>
          </View>
      </View>
    )
  }

  getSubmitList = (isAppend) => {
    const {submitList} = this.state
    this.pageNum = isAppend ? this.pageNum + 1 : 1;
    if(this.requestLock || (submitList.length >= this.totalSubmitCount && this.pageNum > 1) || this.isEnd) {
      return;
    }
    this.requestLock = true;
    fetchMySubmitList(this.pageSize, this.pageNum).then(({contentList, total, isEnd}) => {
      this.setState({
        initLoading: false
      })
      if(contentList && contentList.length) {
        if(!isAppend) {
          this.setState({
            submitList: []
          });
        }
        const _submitList = submitList.concat(contentList)
        this.setState({
          submitList: _submitList,
          total
        })
        this.totalSubmitCount = total;
        this.requestLock = false;
        this.isEnd = isEnd
      }
    }).catch(() => {
      this.setState({
        initLoading: false
      })
    })
  }

  onEndReached = () => {
    this.getSubmitList(true)
  }

  getRewardScore = (id) => {
    if(!id) {
      showToast('网络异常，稍后再试~')
    }
    askToReceiveScore(id).then(() => {
      const {submitList} = this.state
      const {unreceiveScore} = this.props
      const _item = submitList.find(fv => fv.id === id)
      if(_item) {
        _item.scoreType = 'receive'
      }
      this.setState({
        submitList: [].concat(submitList)
      })
      this.props.setUnreceiveScore(unreceiveScore - 1)
    }).catch(() => {
      showToast('请稍后再试~')
    })
  }

  goToSubmit = () => {
    this.navigate('QuestionSubmit')
  }

  listenLogin() {
    this.listener = DeviceEventEmitter.addListener('loginChange', this._loginChange)
  }

  _loginChange = (isLogin) => {
    this.setState({isLogin}, () => {
      this.init()
    })
  }

  gotoDetail = (item) => {
    // 问题状态：0启用，1禁用
    if(item.status === 0) {
      this.goTo('QuestionDetail', {
        bgColor: BG_GRADIENTVIEW_COLOR[Math.floor(Math.random() * 3)],
        qid: item.id,
        showKeyBoard: false
      })
    } else if(item.status === 1) {
      showToast('此投稿问题已下线~')
    }
  }

}

const styles = global.BaseStyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 90
  },
  leftDot: {
    width: 46.5,
    height: 27.5,
    marginTop: 6
  },
  headCloud: {
    width: 244,
    height: 92,
    position: 'absolute',
    top: 0,
    alignSelf: 'center'
  },
  cheese: {
    width: 205,
    height: 90,
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  btnStyle: {
    height: 30,
    paddingHorizontal: 12.5,
    paddingVertical: 7,
    borderRadius: 15
  },
  itemBox: {
    width: DEVICE_WIDTH,
    paddingHorizontal: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  itemPic: {
    width: 120,
    height: 86,
    marginRight: 13
  },
  statusBar: {
    width: 120,
    height: 18.5,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 91,
    paddingLeft: 13.5,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 0.5
  },
  userIcon: {
    width: 55,
    height: 55,
    marginRight: 10,
    borderRadius: 27.5
  }
});
