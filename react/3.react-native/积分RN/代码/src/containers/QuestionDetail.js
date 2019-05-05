import React from 'react'
import {
  View,
  FlatList,
  StatusBar,
  DeviceEventEmitter
} from 'react-native'
import {isIOS} from '@iqiyi/rn-utils'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {riskControl} from '../api'
import QList from '../components/question/QList'
import QuestionTitle from '../components/question/QuestionTitle'
import {BG_GRADIENTVIEW_COLOR} from '../components/question/QuestionConst'
import {CustomEmptyPage} from '../components/EmptyPage'
import {getQuestionDetailList} from '../model/question/index'
import {getMultiDimensionArray, getObjectValueSafely, goToLogin, isCurrentPageOnShow} from '../common/util'
import DetailHeader from '../components/question/DetailHeader'
import InputBox from '../components/question/InputBox'
import {LoadMore} from '../components/LoadMore'
import NoAnswer from '../components/question/NoAnswer'
import {changeAnswerItem} from '../actions/changeQuestionAnswerItem'
import {changeTotalScore} from '../actions/TotalScoreActions'
import {sendPagePingback, sendClickPingback} from '../common/pingback'
import {hideLoading} from '../common/QYNativeBridge'
import MedalModal from '../components/question/MedalModal'
import SharePng from '../components/question/SharePng'
import BasePage from '../components/BasePage'
import WithSafeView from '../components/WithSafeView'
// import {sendQoeMark} from '../qoe'

// 回答成功后数据需要手动填充，避免刷新列表接口，但是总的回答数据增加后，可能会导致分页下一条数据重复，需要和后台讨论
const DEFAULT_EMPTY_ANSWER = {
  isLike: 0,
  avatar: '',
  uname: '',
  likeTotal: 0,
  id: 0,
  qid: 0,
  content: '',
  uid: 0,
  status: 0,
  ctime: 0,
  utime: 0
}

@connect(({answerItemDetail}) => {
  const {updateQid = 0, updateTime} = answerItemDetail
  return {
    updateQid,
    updateTime
  }
}, dispatch => bindActionCreators({changeAnswerItem, changeTotalScore}, dispatch), null, {withRef: true})
export default class extends BasePage {
  pageName = 'holex'

  constructor(props) {
    super(props)
    let bgColor = getObjectValueSafely(this.props, 'navigation.state.params.bgColor')
    this.state = {
      showKeyBoard: getObjectValueSafely(this.props, 'navigation.state.params.showKeyBoard') || getObjectValueSafely(this.props, 'screenProps.showKeyBoard'),
      qid: getObjectValueSafely(this.props, 'navigation.state.params.qid') || getObjectValueSafely(this.props, 'screenProps.qid'),
      openAid: getObjectValueSafely(this.props, 'navigation.state.params.aid'),
      isLogin: global.USER_INFO.isLogin,
      bgColor: bgColor || BG_GRADIENTVIEW_COLOR[Math.floor(Math.random() * 3)],
      emptyShowName: 'loading',
      emptyTip: '',
      medal: {},
      data: {},
      list: [],
      originList: [], // 未加工的原始数据
      isEnd: false,
      contentDisplayEnable: false, // 风控默认是关闭 true 为展示
      inputBoxEnable: false,
      fakeWriteEnable: false, // 假写策略
      updateQid: this.props.updateQid,
      updateTime: this.props.updateTime // 更新时间
    }
    this.loading = false
    this.pageNum = 1
    this.pageSize = 8
    this.isRefreshPageAfterAnswer = false // 判断刷新数据是来自点赞还是 回答

    const navigateFrom = getObjectValueSafely(this.props, 'navigation.state.params.from', '')
    const screenFrom = getObjectValueSafely(this.props, 'screenProps.from', '')

    global.from = navigateFrom || screenFrom || global.from
  }

  listenLogin = () => {
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      this.setState({
        isLogin
      }, () => {
        this._getTotalData()
      })
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {updateTime, updateQid} = nextProps
    // 问题item 有了新的变化需要同步
    if(updateTime > prevState.updateTime) {
      return {
        updateTime,
        updateQid
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    // 详情页点赞 不需要刷新全部数据，发布回答成功后刷新全部数据
    if(!isCurrentPageOnShow({navigation: this.props.navigation, routeName: 'QuestionDetail'}) || this.isRefreshPageAfterAnswer) {
      this.isRefreshPageAfterAnswer = false
      // 问题item 有了新的变化需要同步
      const {updateQid, updateTime} = this.state
      if(updateTime > prevState.updateTime && updateQid) {
        this._getTotalData()
      }
    }
  }

  componentDidMount() {
    sendPagePingback(this.pageName)
    hideLoading()
    isIOS && StatusBar.setBarStyle('dark-content', true)
    this.initData()
    this.listenLogin()
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  initData = async () => {
    const [riskData, result] = await Promise.all([
      this._getRiskState(),
      this._getDataList()
    ])
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

  render() {
    const {data, list, inputBoxEnable, emptyShowName, emptyTip, bgColor, qid, isLogin, showKeyBoard} = this.state

    return (
      <WithSafeView>
        <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
          <CustomEmptyPage emptyTip={emptyTip} showName={emptyShowName}>
            {list.length > 0
              ? (
                <FlatList
                  ListHeaderComponent={
                    <QuestionTitle fromDetail="detail" index={0} item={data} bgColor={bgColor} inputBoxEnable={inputBoxEnable} onPress={this._pressButton} />
                  }
                  style={{flex: 1}}
                  data={list}
                  renderItem={this._renderItem}
                  ListFooterComponent={this.renderFooter}
                  onEndReached={this.loadMoreData}
                  onEndReachedThreshold={0.1}
                  onScroll={this._onScroll}
                  scrollEventThrottle={100}
                />
              )
              : (
                <View>
                  <QuestionTitle fromDetail="detail" index={0} item={data} bgColor={bgColor} inputBoxEnable={inputBoxEnable} onPress={this._pressButton} />
                  <NoAnswer onPress={this._pressButton} />
                </View>
              )}
          </CustomEmptyPage>
          {!!data.content && (
            <InputBox
              ref={(inputBox) => {
                this.inputBox = inputBox
              }}
              inputBoxEnable={inputBoxEnable}
              showKeyBoard={showKeyBoard}
              qid={qid}
              data={data}
              isLogin={isLogin}
              afterAnswerSuccess={this.afterAnswerSuccess}
            />
          )}
          {data.content
            ? (
              <DetailHeader
                onPress={this._pressButton}
                inputBoxEnable={inputBoxEnable}
                questionTitle={data.content}
                pressBack={this._pressBack}
                ref={(detailHeader) => {
                  this.detailHeader = detailHeader
                }}
              />
            )
            : (
              <DetailHeader
                onPress={null}
                inputBoxEnable={false}
                questionTitle="脑洞大赏"
                pressBack={this._pressBack}
                ref={(detailHeader) => {
                  this.detailHeader = detailHeader
                }}
              />
            )}
          {!!isLogin && <MedalModal />}
          {!!data.content && (
            <SharePng
              ref={(sharePng) => {
                this.sharePng = sharePng
              }}
            />
          )}
        </View>
      </WithSafeView>
    )
  }

  share = ({
    isLike,
    uname,
    content,
    likeTotal
  }) => {
    const {data} = this.state
    this.sharePng.share({
      isLike,
      uname,
      content,
      likeTotal,
      userSelfName: global.USER_INFO.userName,
      userSelfAvatar: global.USER_INFO.userIcon,
      questionTitle: data.content,
      wxaCode: data.wxaCode,
      qid: data.id
    })
  }

  _pressButton = () => {
    this._answer()
    sendClickPingback('holex', '', 'answer')
  }

  _pressBack = () => {
    this.back()
  }

  renderFooter = () => {
    const {list, isEnd} = this.state
    if(list.length > 0) {
      return (
        <View style={{paddingBottom: 70, backgroundColor: '#f2f2f2'}}>
          <LoadMore allLoaded={isEnd} noMoreText="没有回答了，抢答补充吧！" />
        </View>
      )
    }
    return null
  }

  _onScroll = ({nativeEvent}) => {
    const {y} = nativeEvent.contentOffset
    if(this.detailHeader) {
      if(y <= 0) {
        return this.detailHeader.setHeaderTop(0)
      }
      if(y >= 80) {
        return this.detailHeader.setHeaderTop(y - 80)
      }
    }
  }

  // 直接弹出键盘回答问题
  // showKeyBoardDirect = () => {
  //   if(this.state.showKeyBoard && !this.directAlreadyShow && isCurrentPageOnShow({navigation: this.props.navigation, routeName: 'QuestionDetail'})) {
  //     this.directAlreadyShow = true
  //     this._answer()
  //   }
  // }

  _answer = () => {
    if(!this.state.isLogin) {
      return goToLogin()
    }
    this.inputBox && this.inputBox.showInput()
  }

  _renderItem = ({item}) => {
    const {bgColor, contentDisplayEnable, inputBoxEnable, medal, openAid} = this.state
    return (
      <QList
        data={item}
        openWeb={this.openWeb}
        from="detail"
        bgColor={bgColor}
        contentDisplayEnable={contentDisplayEnable}
        inputBoxEnable={inputBoxEnable}
        medal={medal}
        share={this.share}
        openAid={openAid}
      />
    )
  }

  // 云控失败默认展示
  _getRiskState = async () => {
    const data = await riskControl({
      qypid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
    }).then(({contentDisplayEnable, inputBoxEnable, fakeWriteEnable}) => {
      this.setState({
        contentDisplayEnable,
        inputBoxEnable,
        fakeWriteEnable
      })
      return {
        contentDisplayEnable
      }
    }).catch(() => {
      return {contentDisplayEnable: true, inputBoxEnable: true, fakeWriteEnable: true}
    })
    return data
  }

  loadMoreData = () => {
    const {isEnd} = this.state
    if(isEnd || this.loading) return false
    this.pageNum++;
    this._getDataList()
  }

  _getDataList = async () => {
    try {
      this.loading = true
      const {pageNum, pageSize} = this
      const result = await getQuestionDetailList({pageNum, pageSize, qid: this.state.qid})
      // sendQoeMark('d', Date.now() - this.qlistTime)

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
    const {originList, medal: originMedal} = this.state
    const isFirstPage = this.pageNum === 1
    if(result.code === 'A00000') {
      /*
        不使用 const {data, medal = {}} = result 是因为后台 在medal可能返回null
        ES6内部使用严格相等运算符（===），判断一个位置是否有值。
        所以，如果一个数组成员不严格等于undefined，默认值是不会生效的。
      */
      const {data, medal} = result
      const resultMedal = medal || {}
      const {isEnd, contentList} = data.answerPageList
      const newOriginList = originList.concat(contentList)
      // console.log(newOriginList.length , data.answerPageList.contentList)
      this.setState({
        originList: newOriginList,
        list: getMultiDimensionArray(newOriginList, newOriginList.length),
        medal: Object.assign(resultMedal, originMedal),
        data,
        isEnd,
        emptyShowName: 'content',
        contentDisplayEnable: true,
        inputBoxEnable: true,
      }, () => {
        this.loading = false
      })
      // sendQoeMark('steta', Date.now() - this.qlistTime)
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

  // 成功发布回答 后加到首赞后
  afterAnswerSuccess = ({qid, content, firstAnswer, needFake, id}) => {
    const {changeAnswerItem: changeAnswerItemProps, changeTotalScore: changeScore} = this.props
    // 假写
    if(needFake) {
      this.copyData({qid, content, id})
    } else {
      this.isRefreshPageAfterAnswer = true
      changeAnswerItemProps && changeAnswerItemProps({updateQid: qid, content})
    }
    // 初次回答才加积分
    if(firstAnswer && changeScore) {
      changeScore(2)
    }
  }

  // 容错：数据刷新失败，就假写一条当前发送的数据信息，可能会造成分页不准确，有重复数据
  copyData = ({qid, content, id}) => {
    const {medal} = this.state

    if(!this.state.fakeWriteEnable) return false
    const {userId} = global.USER_INFO
    DEFAULT_EMPTY_ANSWER.uname = global.USER_INFO.userName
    DEFAULT_EMPTY_ANSWER.uid = userId
    DEFAULT_EMPTY_ANSWER.avatar = global.USER_INFO.userIcon
    DEFAULT_EMPTY_ANSWER.qid = qid
    DEFAULT_EMPTY_ANSWER.id = id
    DEFAULT_EMPTY_ANSWER.content = content
    const {originList} = this.state
    originList.splice(1, 0, DEFAULT_EMPTY_ANSWER)
    this.setState({
      originList,
      medal: Object.assign({userId}, medal),
      list: getMultiDimensionArray(originList, originList.length)
    })
  }

  // 成功发布回答后获取当前所有数据
  _getTotalData = async () => {
    if(!this.state.contentDisplayEnable) return false
    try {
      this.loading = true
      const {pageNum, pageSize} = this
      const result = await getQuestionDetailList({pageNum: 1, pageSize: pageSize * pageNum, qid: this.state.qid})
      if(result.code === 'A00000') {
        const {data, medal} = result
        const resultMedal = medal || {}
        const {isEnd, contentList} = data.answerPageList
        const newOriginList = contentList
        // console.log(newOriginList.length , data.answerPageList.contentList)
        this.setState({
          originList: newOriginList,
          list: getMultiDimensionArray(newOriginList, newOriginList.length),
          data,
          isEnd,
          medal: resultMedal,
          emptyShowName: 'content',
        })
      }
      this.loading = false
    } catch(e) {
      this.loading = false
    }
  }
}
