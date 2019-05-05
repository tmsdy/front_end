import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux'
import TabTitle from '../TabTitle'
import Swipe from './Swipe'
import {
  riskControl
} from '../../../api'
import {
  getQuestionList
} from '../../../model/question/index'
import px2dp from '../../../common/px2dp'
import {goToPGC} from '../../../common/util'
import {sendClickPingback, sendBlockPingback} from '../../../common/pingback'
@connect(({answerItemDetail}) => {
  const {updateQid = 0, updateTime} = answerItemDetail
  return {
    updateQid,
    updateTime
  }
}, null, null, {withRef: true})
export default class extends Component {
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
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      contentDisplayEnable: false, // 风控默认是关闭 true 为展示
      inputBoxEnable: false,
      updateQid: this.props.updateQid,
      updateTime: this.props.updateTime // 更新时间
    };
    this.listener = null
  }
  componentDidMount() {
    sendBlockPingback('paradise', '296011')
    this.initData()
    this.listenLogin()
  }
  componentDidUpdate(prevProps, prevState) {
    // 问题item 有了新的变化需要同步
    const {updateQid, updateTime} = this.state
    if(updateTime > prevState.updateTime && updateQid) {
      this._getDataList()
    }
  }
  componentWillUnmount() {
    this.listener && this.listener.remove()
  }
  render() {
    const {contentDisplayEnable, inputBoxEnable, list} = this.state
    if(!contentDisplayEnable || list.length === 0) {
      return null
    }
    return (
      <React.Fragment>
        <View style={styles.containerTitle}>
          <TabTitle
            showLookMore={true}
            title="脑洞大赏"
            onPress={() => { this._lookMore() }}
            renderLookMoreComponent={<Text style={styles.moreText}>更多问题</Text>}
          />
        </View>
        <Swipe
          {...this.props}
          getDataList={this._getDataList}
          inputBoxEnable={inputBoxEnable}
          list={list}
          goToDetail={this.goToDetail}
          _lookMore={this._lookMore}
          goToPGC={this.goPgc}
        />
      </React.Fragment>
    )
  }
  initData = async () => {
    await this._getRiskState()
    this._getDataList()
  }
  // 云控失败默认展示
  _getRiskState = async () => {
    await riskControl({
      qypid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
    }).then(({contentDisplayEnable, inputBoxEnable}) => {
      this.setState({
        contentDisplayEnable,
        inputBoxEnable,
      })
    }).catch(() => {
      this.setState({contentDisplayEnable: true, inputBoxEnable: true})
    })
  }
  _getDataList = async () => {
    try {
      const result = await getQuestionList({pageNum: 1, pageSize: 8})
      if(result.code === 'A00000') {
        const {data = {}} = result
        const {contentList = []} = data
        this.setState({
          list: contentList,
        })
      }
    } catch(e) {
      // 考虑到返回刷新数据可能会请求失败
      this.setState({
        list: this.state.list,
      })
    }
  }
  _lookMore = (qidIndex = 0) => {
    if(!qidIndex) {
      sendClickPingback('paradise', '296011', 'morehole')
    }
    const {goTo} = this.props
    goTo && goTo('QuestionList', {
      qidIndex
    })
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
  listenLogin() {
    this.listener = DeviceEventEmitter.addListener('loginChange', this._getDataList)
  }
}

const styles = StyleSheet.create({
  moreText: {
    height: 45,
    lineHeight: 45,
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
  containerTitle: {
    paddingLeft: px2dp(15),
    paddingRight: px2dp(13),
    marginTop: 25
  }
})
