/**
 * Created by liuzhimeng.
 * @date 2018/9/13
 * @description 话题列表
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DeviceEventEmitter, FlatList, SectionList, StyleSheet} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {CustomEmptyPage} from '../EmptyPage'
import TopicBlock from './src/TopicBlock'
import {withPagination} from '../mixins/withPagination'
import {getLifeCycleState} from './lifeCycle'
import {getNetInfo} from './helpers'
import {getList, getMyList, getTopickDetail} from './apis'
import {BG_COLOR_DEFAULT} from './constants'
import {getUserInfo} from '../../api'
import {doVoteTopic, getPkReward} from './buttonPress'
import {changeTotalScore, setTotalScore} from '../../actions/TotalScoreActions'
import {changeAvailableScore} from '../../actions/changeAvailableScore'
import {cloneByJSON, goToLogin} from '../../common/util'
import {SectionHeader} from './src/Snippets'
import {showToast} from '../../common/QYNativeBridge';

const PAGE_STATE = {
  offset: 0,
  limit: 10,
}
const INIT_TOPIC_SECTIONS = [
  {
    id: 'in',
    title: '进行中',
    iconName: '',
    data: [],
  },
  {
    id: 'before',
    title: '即将开始',
    iconName: 'topicpk/pink',
    data: [],
  },
  {
    id: 'after',
    title: '往期揭晓',
    iconName: 'topicpk/pink',
    data: [],
  },
]

const WithFlatList = withPagination(FlatList, {pageState: PAGE_STATE})
const WithSectionList = withPagination(SectionList, {pageState: PAGE_STATE})

@connect((state = {}) => {
  const {
    scoreInfo = {},
    changeAvailableScore: _changeAvailableScore = {},
  } = state
  return {
    totalScore: scoreInfo.totalScore,
    availableScore: _changeAvailableScore.score,
  }
}, dispatch => bindActionCreators({
  setTotalScore,
  changeTotalScore,
  changeAvailableScore,
}, dispatch), null, {withRef: true})

export default class TopicList extends Component {
  static propTypes = {
    type: PropTypes.string,
    onUpdate: PropTypes.func,
  }

  static defaultProps = {
    type: 'all',
    onUpdate: () => null,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
      emptyShowName: 'loading', // 页面状态 loading/empty/content
      total: 0,
      topicList: [],
      topicSections: cloneByJSON(INIT_TOPIC_SECTIONS),
    }

    this.listener = null
    this.topicBlock = {}
    PAGE_STATE.groupName = this.props.groupName
  }

  componentDidMount() {
    this.onRefresh()
    this._listenLogin((isLogin) => {
      this.setState({isLogin})
      this.onRefresh('display')
    })
  }

  componentWillUnmount() {
    this.listener.remove()
    this.listener = null
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomEmptyPage
          loginTip="登录查看参与的话题"
          emptyTip="还没有参与过话题哦"
          showName={this.state.emptyShowName}
          retry={() => this.onRefresh('display')}
        >
          {this.props.type === 'all'
            ? (
              <WithSectionList
                total={this.state.total}
                onEndBack={d => this.onEndBack(d)}
                sections={this.state.topicSections}
                renderSectionHeader={({section}) => <SectionHeader {...section}/>}
                ListFooterComponent={this._renderFooter}
                renderItem={params => this._renderItem(params)}
                keyExtractor={this._keyExtractor}
                initialNumToRender={10}
                stickySectionHeadersEnabled={false}
              />
            )
            : (
              <WithFlatList
                total={this.state.total}
                onEndBack={d => this.onEndBack(d)}
                data={this.state.topicList}
                renderItem={params => this._renderItem(params)}
                ListFooterComponent={this._renderFooter}
                keyExtractor={this._keyExtractor}
                style={styles.flatListContainer}
              />
            )}
        </CustomEmptyPage>
      </View>
    )
  }

  _keyExtractor = item => item.id

  _renderItem = ({item, index, section = {}}) => (
    <TopicBlock
      key={item.code}
      mode={item.mode}
      options={item.topicOptions}
      viewOptions={item.viewOptions}
      buttonOptions={item.buttonOptions}
      onViewPress={(opt, optKey) => this.onViewPress(opt, optKey, item, index, section)}
      onButtonPress={() => this.onButtonPress(item, index)}
      voteResultOptions={item.voteResultOptions}
      voteResult={item.voteResult}
      period={item.period}
      detail={item.detail}
      ref={(topick) => { this.topicBlock[item.id] = topick }}
      index={index}
    />
  )

  _renderFooter = () => (
    <Text style={styles.listFooter}>没有更多了</Text>
  )

  _getSectionKey = (period) => {
    if(period === 'in') return 0
    return period === 'before' ? 1 : 2
  }

  _listenLogin(cb) {
    const _this = this
    this.listener = DeviceEventEmitter.addListener(
      'loginChange',
      isLogin => cb.call(_this, isLogin),
    )
  }

  /**
   * 获取全部话题列表
   * @param pageState 请求参数
   * @param refresh 是否刷新重置列表
   * @returns {Promise}
   * @private
   */
  _getList(pageState = PAGE_STATE, refresh = false) {
    return getList(pageState)
      .then(({contents = [], total = 0}) => {
        const nextTopicSections = refresh ? cloneByJSON(INIT_TOPIC_SECTIONS) : this.state.topicSections

        if(contents && contents.length) {
          for(let i = 0; i < contents.length; i++) {
            const detail = contents[i]
            const _detail = getLifeCycleState({detail, userScore: this.props.totalScore}, {type: this.props.type})
            // console.log('全部话题 |', _detail)
            let key = this._getSectionKey(_detail.period)
            if(key >= nextTopicSections.length) {
              key = nextTopicSections.length - 1
            }
            if(nextTopicSections[key]) {
              nextTopicSections[key].data.push(_detail)
            }
          }
          if(refresh) {
            this.props.onUpdate({firstItem: contents[0]})
          }
        }

        const topicSections = [].concat(nextTopicSections.filter(i => !!i.data.length))
        const showEmpty = topicSections.reduce((previous, current) => previous + current.data.length, 0)
        this.setState({
          total,
          emptyShowName: !showEmpty ? 'empty' : '',
          topicSections,
        })
      })
      .catch(() => {
        this.props.toSendPagePingback('fail')
        this.setState({emptyShowName: 'networkError'})
      })
  }

  /**
   * 获取我参数的话题列表
   * @param pageState 请求参数
   * @param refresh 是否刷新重置列表
   * @returns {Promise}
   * @private
   */
  _getMyList(pageState = PAGE_STATE, refresh = false) {
    const {isLogin} = this.state
    if(!isLogin) {
      this.setState({emptyShowName: 'login'})
      return
    }
    return getMyList(pageState)
      .then(({contents = [], total = 0}) => {
        const {topicList} = this.state
        let nextTopicList = refresh ? [] : topicList

        if(contents && contents.length) {
          nextTopicList = nextTopicList.concat(contents.map((detail) => {
            const _detail = getLifeCycleState({detail}, {type: this.props.type})
            // console.log('我参与的 |', _detail)
            return _detail
          }))
        }

        this.setState({
          total,
          emptyShowName: !nextTopicList.length ? 'empty' : '',
          topicList: nextTopicList,
        })
        return nextTopicList
      })
      .catch(() => this.setState({emptyShowName: 'networkError'}))
  }

  // 获取用户积分
  _getUserInfo = () => {
    return getUserInfo({needExpire: 1})
      .then((data) => {
        // console.log('_getUserInfo', data)
        const {totalScore} = data[0]
        this.props.setTotalScore(totalScore);
      })
      .catch(err => Promise.reject(err))
  }

  /**
   * 获取数据（根据 props.type 判断是全部话题列表还是我参与的话题列表）
   * @param pageState {object}
   * @param refresh {boolean}
   */
  getData(pageState, {refresh = false} = {}) {
    getNetInfo()
      .then(() => {
        this._getUserInfo()
        this.props.type === 'my'
          ? this._getMyList(pageState, refresh)
          : this._getList(pageState, refresh)
      })
      .catch(() => {
        this.setState({emptyShowName: 'networkBroken'})
      })
  }

  onRefresh(type = 'silent') {
    if(type === 'display') {
      this.setState({emptyShowName: 'loading'})
    }
    this.getData(PAGE_STATE, {refresh: true})
  }

  /**
   * 滚动到列表底部是触发的回调
   * @param pageState {object} 接口参数，包含 offset, limit
   * @param loadAll {boolean} 是否已加载全部
   */
  onEndBack({pageState, loadAll}) {
    if(!loadAll) {
      this.getData(pageState)
    }
  }

  // 打call
  onViewPress({id: optionId}, optionKey, {detail, topicOptions}, index, {id}) {
    const {isLogin, topicSections, topicList} = this.state

    if(id === 'in') {
      this.props.toSendClickPingback('all', `topicing${index + 1}`)
    }

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

    if(this.props.totalScore < detail.price) {
      return showToast(`投票还差${detail.price - this.props.totalScore}积分，去赚积分`)
    }

    doVoteTopic(detail, optionId, this.props.totalScore)
      .then(() => {
        // this.onRefresh()
        const param = {
          groupName: detail.group_name,
          topicCode: detail.code
        }

        getTopickDetail(param).then((data) => {
          const _topicSections = topicSections
          const _topicList = topicList
          const _data = getLifeCycleState({detail: data}, {type: this.props.type})
          if(this.props.type === 'all') {
            const _section = _topicSections.find(fv => fv.id === _data.period) && _topicSections.find(fv => fv.id === _data.period).data
            _section[index] = _data
            this.setState({
              topicSections: [].concat(_topicSections)
            })
          }
          if(this.props.type === 'my') {
            _topicList[index] = _data
            this.setState({
              topicList: [].concat(_topicList)
            })
          }
          showToast('投票成功')
          if(data.user_vote_number === 1) {
            this.topicBlock[detail.code] && this.topicBlock[detail.code].showShareBubble && this.topicBlock[detail.code].showShareBubble()
          }
        })
        this.props.toSendBlockPingback('successModal', {rseat: 'topic_pop'})
        this.props.changeTotalScore(0 - parseFloat(detail.price))
        // this.props.onUpdate({
        //   modalState: {
        //     modalVisible: true,
        //     modalMode: 'reminder',
        //     content: {
        //       id: 'doCall',
        //       title: '打Call成功',
        //       iconName: 'topicpk/modal-do-call',
        //     },
        //     buttonText: '邀好友一起赢积分',
        //   },
        // })
        // 多次投票， 去掉弹框功能
      }).catch(() => {
        showToast('活动太火爆了，稍后再试～')
      })
    for(let i = 0; i < topicSections.length; i++) {
      const s = topicSections[i]
      if(s.id === id) {
        s.data[index].topicOptions.checkedKey = optionKey
      }
    }
    this.setState({topicSections})
  }

  onButtonPress(item, index) {
    const {
      topicOptions: {buttonTodo},
      detail: {
        each_reward: eachReward,
        user_vote_number: userVoteNumber
      },
    } = item
    const totalReward = userVoteNumber * eachReward
    // console.log('buttonTodo |', buttonTodo)

    // 领取奖励
    if(buttonTodo === 'getReward') {
      this.props.toSendClickPingback('my', `topic_get${index + 1}`)
      getPkReward(item)
        .then(() => {
          this.onRefresh()
          this.props.toSendBlockPingback('getAwardModal', {rseat: 'topicget_pop'})
          this.props.changeAvailableScore(0 - parseFloat(totalReward))
          this.props.onUpdate({
            modalState: {
              modalVisible: true,
              modalMode: 'reminder',
              content: {
                id: 'getReward',
                title: `${totalReward}积分领取成功`,
                iconName: 'topicpk/modal-get-score',
              },
              buttonText: '邀好友一起赢积分',
            },
          })
        })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_COLOR_DEFAULT,
  },

  flatListContainer: {
    // marginTop: 10,
  },
  listFooter: {
    width: '100%',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 12,
    color: '#999999',
    fontFamily: 'PingFangSC-Regular',
  },
})
