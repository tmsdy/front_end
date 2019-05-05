import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  DeviceEventEmitter
} from 'react-native'
import {
  isLikeX,
  isIOS
} from '@iqiyi/rn-utils'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {
  riskControl
} from '../api'
import NavBar from '../components/DefaultNavBar'
import {CustomEmptyPage} from '../components/EmptyPage'
import {
  getQuestionList,
  getQuestionDetailList,
  getIsShowBubbleFromStory,
  setIsShowBubbleFromStory
} from '../model/question/index'
import WebImage from '../components/WebImage'
import Tips from '../components/question/Tips'
import {getObjectValueSafely, isCurrentPageOnShow, runEventOnce} from '../common/util'
import {LoadMore} from '../components/LoadMore'

import {sendPagePingback} from '../common/pingback'
import {hideLoading} from '../common/QYNativeBridge'
import MedalModal from '../components/question/MedalModal'
import SharePng from '../components/question/SharePng'
import BasePage from '../components/BasePage';
import Qitem from '../components/question/QuestionListItem'
// import {sendQoeMark} from '../qoe'
import BaseConfirmModal from '../components/BaseConfirmModal'
import ReduxUtil from '../common/ReduxUtil'
import NewGuideModal from '../components/question/NewGuideModal'
import {fetchUnreceiveScore} from '../model/question/questionSubmit'
import {setUnreceiveScore} from '../actions/QuestionActions'

// 锚点定位距离偏移
const IOS_DISTANCE = isLikeX() ? 95 : 65
const SCROLL_LESS_DISTANCE = isIOS ? IOS_DISTANCE : 51

interface QuestionListProps{
  updateQid: any;
  updateTime: any;
  unreceiveScore: number;
}

interface QuestionListState{
  scrollQidIndex: number;
  // list: TEST_DATA.contentList,
  loading: boolean;
  isLogin: boolean;
  emptyShowName: string;
  emptyTip: string;
  medal: object;
  list: any[];
  isEnd: boolean;
  contentDisplayEnable: boolean;
  inputBoxEnable: boolean;
  updateQid: any;
  updateTime: any;
  unreceiveScore: number;
}

@(connect(({answerItemDetail, questionInfo}) => {
  const {updateQid = 0, updateTime} = answerItemDetail
  const {unreceiveScore = 0} = questionInfo
  return {
    updateQid,
    updateTime,
    unreceiveScore
  }
},
dispatch => bindActionCreators({
  setUnreceiveScore
}, dispatch),
null,
{withRef: true}) as any)
export default class extends BasePage<QuestionListProps, QuestionListState> {
  pageName = 'hole'

  constructor(props) {
    super(props)
    this.state = {
      scrollQidIndex: getObjectValueSafely(this.props, 'navigation.state.params.qidIndex') || 0,
      // list: TEST_DATA.contentList,
      loading: true,
      isLogin: global.USER_INFO.isLogin,
      emptyShowName: 'loading',
      emptyTip: '',
      medal: {}, // 所有uid对应的勋章信息
      list: [],
      isEnd: false, // 是否结束
      contentDisplayEnable: false, // 风控默认是关闭 true 为展示
      inputBoxEnable: false,
      updateQid: this.props.updateQid,
      updateTime: this.props.updateTime, // 更新时间
      unreceiveScore: this.props.unreceiveScore
    }
    this.pageNum = 1
    this.pageSize = 10
    this.listener = null
    this.refConfirmModal = ReduxUtil.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {unreceiveScore: _unreceiveScore} = prevState
    const {updateTime, updateQid, unreceiveScore} = nextProps
    // 问题item 有了新的变化需要同步
    if((updateTime > prevState.updateTime) || (unreceiveScore !== _unreceiveScore)) {
      return {
        updateTime,
        updateQid,
        unreceiveScore
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    // 列表页只存在点赞，没有发布，所以如果是当前页面，就不需要刷新
    if(!isCurrentPageOnShow({navigation: this.props.navigation, routeName: 'QuestionList'})) {
      // 问题item 有了新的变化需要同步
      const {updateQid, updateTime} = this.state
      if(updateTime > prevState.updateTime && updateQid) {
        this._getDetailData({qid: updateQid})
      }
    }
  }

  componentDidMount() {
    if(getObjectValueSafely(this.props, 'screenProps.fromshare')) {
      sendPagePingback(this.pageName, {from: 'share'})
    } else {
      sendPagePingback(this.pageName)
    }
    hideLoading()
    isIOS && StatusBar.setBarStyle('dark-content', true)
    this.initData()
    this.listenLogin()
    this.showTipBubble()
    this.isShowNewGuideModal()
  }

  initData = async () => {
    const [riskData, result] = await Promise.all([
      this._getRiskState(),
      this._getDataList()
    ])
    // sendQoeMark('qlistimethree', Date.now() - this.qlistTime)
    if(riskData.contentDisplayEnable) {
      this.setData(result)
    } else {
      this.setState({
        contentDisplayEnable: false,
        inputBoxEnable: false,
        emptyShowName: 'empty',
        emptyTip: 'ops,页面藏起来了'
      })
    }
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    const {list, contentDisplayEnable, inputBoxEnable, emptyShowName, emptyTip, scrollQidIndex, medal, isLogin} = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
        <NavBar
          title="脑洞大赏"
          type="black"
          titleColor="#333333"
          backgroundColor="#ffffff"
          backPress={this._pressBack}

          renderRightView={() => this.renderRightView()}
        />
        <CustomEmptyPage emptyTip={emptyTip} showName={emptyShowName}>
          <FlatList
            data={list}
            initialNumToRender={scrollQidIndex + 2}
            onScrollToIndexFailed={() => {}}
            contentDisplayEnable={contentDisplayEnable}
            inputBoxEnable={inputBoxEnable}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.loadMoreData}
            onEndReachedThreshold={0.1}
            ref={(flatView) => { this.flatView = flatView }}
            renderItem={({item, index}) => {
              return (
                <Qitem
                  scrollTo={this.scrollTo}
                  needScroll={scrollQidIndex === index}
                  item={item}
                  index={index}
                  inputBoxEnable={inputBoxEnable}
                  goTo={this.goTo}
                  medal={medal}
                  openWeb={this.openWeb}
                  answerShare={this.share}
                />
              )
            }}
          />
        </CustomEmptyPage>
        <Tips ref={(tipsrefs) => { this.tipsrefs = tipsrefs }}/>
        {
          isLogin ? <MedalModal /> : null
        }
        {
          list && list.length > 0 ? <SharePng ref={(sharePng) => { this.sharePng = sharePng }}/> : null
        }
        {/* 弹框容器 */}
        <BaseConfirmModal ref={this.refConfirmModal}/>
      </View>
    )
  }

  share = (data) => {
    this.sharePng.share(data)
  }

  _pressBack = () => {
    this.back()
  }

  scrollTo = (offset) => {
    requestAnimationFrame(() => {
      this.flatView && this.flatView.scrollToOffset({offset: offset > SCROLL_LESS_DISTANCE ? offset - SCROLL_LESS_DISTANCE : 0, animated: false})
    })
  }

  renderFooter = () => {
    const {list, isEnd} = this.state
    if(list.length > 0) {
      return <LoadMore allLoaded={isEnd}/>
    }
    return null
  }

  renderRightView = () => {
    const {unreceiveScore} = this.state
    return (
      <TouchableOpacity style={styles.headerRight} activeOpacity={1} onPress={this.showTips}>
        <WebImage name="question/question" style={{width: 43, height: 43}}/>
        {!!unreceiveScore && <WebImage name="question/red_dot" style={styles.redDot}/>}
      </TouchableOpacity>
    )
  }

  showTips = () => {
    // sendClickPingback('hole', '', 'h_refer')
    // this.tipsrefs.showTips(true)
    this.goTo('QuestionSubmit')
  }

  // 云控失败默认展示
  _getRiskState = async () => {
    const data = await riskControl({
      qypid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
    }).then(({contentDisplayEnable, inputBoxEnable}) => {
      // this.hideNativeLoading()
      // sendQoeMark('qlistimetwo', Date.now() - this.qlistTime)
      // this.setState({
      //   contentDisplayEnable,
      //   inputBoxEnable,
      //   emptyShowName: contentDisplayEnable ? 'loading' : 'empty',
      //   emptyTip: contentDisplayEnable ? '空空如也，问题制作中' : 'ops,页面藏起来了'
      // })
      return {
        contentDisplayEnable,
        inputBoxEnable
      }
    }).catch(() => {
      // this.hideNativeLoading()
      // this.setState({contentDisplayEnable: true, inputBoxEnable: true, emptyShowName: 'loading'})
      return {contentDisplayEnable: true, inputBoxEnable: true}
    })
    return data
  }

  listenLogin() {
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      this.setState({
          isLogin
        }, () => {
          this._getTotalData()
        })
    })
  }

  _getDataList = async () => {
    try {
      this.loading = true
      const {pageNum, pageSize} = this
      const result = await getQuestionList({pageNum, pageSize})
      this.loading = false
      if(pageNum === 1) {
        return result
      } else {
        this.setData(result)
      }
    } catch(e) {
      this.loading = false
      if(this.pageNum === 1) {
          this.setState({
          list: [],
          emptyShowName: 'empty',
          emptyTip: '空空如也，问题制作中'
        })
      }
    }
  }

  setData(result) {
    const {list} = this.state
    const isFirstPage = this.pageNum === 1
    if(result.code === 'A00000') {
      const {data = {}, medal} = result
      const resultMedal = medal || {}
      const {contentList = [], isEnd} = data
      const newList = list.concat(contentList)
      this.setState({
        contentDisplayEnable: true,
        inputBoxEnable: true,
        list: newList,
        medal: Object.assign(resultMedal, this.state.medal),
        isEnd,
        emptyShowName: newList.length > 0 ? 'content' : 'empty',
      })
    } else if(isFirstPage) {
      this.setState({
        list: [],
        emptyShowName: 'empty',
        emptyTip: '空空如也，问题制作中'
      })
    } else {
      // todo 加载更多时候出错
      this.setState({})
    }
  }

  loadMoreData = () => {
    const {isEnd} = this.state
    if(isEnd || this.loading) return false
    this.pageNum++;
    this._getDataList()
  }

  // 从详情页返回后刷新对应的问题数据
  _getDetailData = async ({qid}) => {
    try {
      const result = await getQuestionDetailList({pageNum: 1, pageSize: 4, qid})
      if(result.code === 'A00000') {
        const {data, medal = {}} = result
        const resultMedal = medal || {}
        const {contentList, isEnd} = data.answerPageList
        if(contentList.length > 0) {
          const {list, medal: _medal} = this.state
          // 找到对应的修改问题进行替换
          for(let i = 0; i < list.length; i++) {
            if(list[i].id === qid) {
              list[i].answerList = contentList
              list[i].hasMore = !isEnd
              break
            }
          }
          /**
           * 本组件继承自PureComponent而非通常的Component，
           * 这意味着如果其props在浅比较中是相等的，则不会重新渲染。
           * 所以请先检查你的renderItem函数所依赖的props数据（包括data属性以及可能用到的父组件的state），
           * 如果是一个引用类型（Object或者数组都是引用类型），
           * 则需要先修改其引用地址（比如先复制到一个新的Object或者数组中），然后再修改其值，否则界面很可能不会刷新。
          */
         const _arry: any[] = JSON.parse(JSON.stringify(list))
          this.setState({
            list: _arry,
            medal: Object.assign(resultMedal, _medal)
          })
        }
      }
    } catch(e) {} // eslint-disable-line
  }

  // 登录回调刷新所有列表
  _getTotalData = async () => {
    if(!this.state.contentDisplayEnable) return false
    try {
      this.loading = true
      const {pageNum, pageSize} = this
      const result = await getQuestionList({pageNum: 1, pageSize: pageSize * pageNum})
      if(result.code === 'A00000') {
        const {data = {}, medal = {}} = result
        const resultMedal = medal || {}
        const {contentList = [], isEnd} = data
        this.setState({
          list: contentList,
          medal: resultMedal,
          isEnd,
        })
      }
      this.loading = false
    } catch(e) {} // eslint-disable-line
  }

  showTipBubble = () => {
    getIsShowBubbleFromStory().then((data) => {
      if(!data) {
        this.tipsrefs.showTips(true)
        setIsShowBubbleFromStory()
      }
    })
  }

  isShowNewGuideModal = () => {
    fetchUnreceiveScore().then((data) => {
      this.props.setUnreceiveScore(data)
      runEventOnce(`question_new_guide${global.USER_INFO.userId}`).then(() => {
        if(data) {
          this.showConfirmModal({
            content: <NewGuideModal
              hide={this.hideConfirmModal}
              goTo={this.goTo}
            />,
            showCloseButton: true,
          })
        }
      })
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
}

const styles = StyleSheet.create({
  headerRight: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redDot: {
    width: 23,
    height: 23,
    position: 'absolute',
    right: 0,
    top: 4
  },
})
