/**
 * Created by liuzhimeng.
 * @date 2018/9/13
 * @description 话题PK
 */

import React from 'react'
import {StatusBar, StyleSheet, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {View} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'
import ScrollTabView from '@iqiyi/rn-scroll-tab-view-beta'
import {GET_ENV, TOPIC_PK_SHARE_URL} from '../constants/configs'
import NavBar from '../components/DefaultNavBar'
import WebImage from '../components/WebImage'
import {TOUCH_NONE} from '../constants/touchableStyle'
import {TopicScrollableTabBar} from '../components/topicPk/src/Snippets'
import TopicList from '../components/topicPk/TopicList'
import Modal from '../components/topicPk/src/Modal'
import {hideLoading} from '../common/QYNativeBridge'
import {getAvailableReward, getList} from '../components/topicPk/apis'
import {changeAvailableScore} from '../actions/changeAvailableScore'
import {sendBlockPingback, sendClickPingback, sendPagePingback} from '../common/pingback'
import {getObjectValueSafely, shareSNS} from '../common/util';
import BasePage from '../components/BasePage';

@connect((state = {}) => {
  const {
    changeAvailableScore: _changeAvailableScore = {},
    scoreInfo
  } = state
  return {
    availableScore: _changeAvailableScore.score,
    availableTime: _changeAvailableScore.time,
    totalScore: scoreInfo.totalScore
  }
}, dispatch => bindActionCreators({
  changeAvailableScore,
}, dispatch), null, {withRef: true})

export default class TopicPk extends BasePage {

  static NAV_ICONS = [
    {
      id: 'question',
      name: 'topicpk/pk-question',
    },
    {
      id: 'share',
      name: 'topicpk/pk-share',
    },
  ]

  static TOPIC_LIST = [
    {
      id: 'all',
      tabLabel: '全部话题',
      modalMode: 'rule',
    }, {
      id: 'my',
      tabLabel: '我参与的',
      modalMode: 'rule',
    },
  ]

  static PINGBACK_RPAGE = {
    success: 'topic_list',
    fail: 'topic_list_fail',
  }
  static PINGBACK_BLOCK = {
    all: '900401',
    my: '900402',
    successModal: '900403',
    getAwardModal: '900404',
  }

  pageName = ''

  constructor(props) {
    super(props)

    const groupName = getObjectValueSafely(this.props, 'screenProps.groupName', '') // url 分组参数
    const initialPage = getObjectValueSafely(this.props, 'navigation.state.params.initialPage', 0)
    const navigateFrom = getObjectValueSafely(this.props, 'navigation.state.params.from', '')
    const screenFrom = getObjectValueSafely(this.props, 'screenProps.from', '')

    global.from = navigateFrom || screenFrom || global.from

    this.state = {
      groupName,
      initialPage,
      showDot: initialPage !== 1,
      totalAvailableScore: 0,
      availableTime: 0,
      dotPage: -1,
      firstItem: null,
      modalState: {
        modalVisible: false,
        modalMode: 'rule',
        content: {},
        buttonText: '',
      },
    }
  }

  _children = []
  refreshStack = [] // 切换tab时刷新列表

  getFirstItem() {
    if(this.state.initialPage === 1) {
      getList({limit: 1})
        .then(({contents = []}) => {
          if(contents && contents.length) {
            this.setState({firstItem: contents[0]})
          }
        })
    }
  }

  getReword() {
    getAvailableReward()
      .then((data) => {
        if(data) {
          this.setState({
            totalAvailableScore: data.scores,
            dotPage: data.isAvailable ? 1 : -1,
          })
        }
      })
  }

  componentDidMount() {
    const name = this.state.initialPage === 1 ? 'my' : 'all'
    this.toSendPagePingback('success', {
      block: TopicPk.PINGBACK_BLOCK[name]
    })

    if(isIOS) {
      StatusBar.setBarStyle('dark-content', true)
    }
    this.refreshStack[this.state.initialPage] = true
    this.getFirstItem()
    this.getReword()
    hideLoading()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.availableTime !== prevState.availableTime) {
      const nextTotalAvailableScore = prevState.totalAvailableScore + nextProps.availableScore
      return {
        availableTime: nextProps.availableTime,
        totalAvailableScore: nextTotalAvailableScore,
        dotPage: nextTotalAvailableScore > 0 ? 1 : -1,
      }
    }
    return null
  }

  // 回退前需要改变乐园页面弹框状态
  backPress = () => {
    const {params} = this.props.navigation.state
    const beforeBack = params && params.beforeBack || null
    this.back()
    beforeBack && beforeBack()
  }

  render() {
    const {
      dotPage,
      showDot,
      initialPage,
      groupName,
      modalState: {
        modalVisible,
        modalMode,
        content,
        buttonText,
      }
    } = this.state
    return (
      <View style={styles.container}>
        <NavBar
          type="black"
          title="话题PK广场"
          titleColor="#333333"
          backgroundColor="#ffffff"
          rightViewWidth={88}
          backPress={this.backPress}
          renderRightView={() => this._renderRightView()}
        />
        <ScrollTabView
          initialPage={initialPage}
          scrollWithoutAnimation={true}
          renderTabBar={() => <TopicScrollableTabBar dotPage={dotPage} showDot={showDot}/>}
          onChangeTab={({i}) => this.onChangeTab(i)}
        >
          {TopicPk.TOPIC_LIST.map((i, k) => (
            <TopicList
              ref={(child) => {
                this._children[k] = child
              }}
              groupName={groupName}
              key={i.id}
              type={i.id}
              tabLabel={i.tabLabel}
              onUpdate={childData => this.onChildUpdate(childData)}
              toSendPagePingback={this.toSendPagePingback}
              toSendBlockPingback={this.toSendBlockPingback}
              toSendClickPingback={this.toSendClickPingback}
            />
          ))}
        </ScrollTabView>
        <Modal
          modalVisible={modalVisible}
          mode={modalMode}
          content={content}
          buttonText={buttonText}
          onConfirm={() => this.onModalConfirm(modalMode)}
          onClose={() => this.onModalClose()}
        />
      </View>
    )
  }

  _renderRightView() {
    return (
      <View style={styles.navRightWrapper}>
        {TopicPk.NAV_ICONS.map(i => (
          <TouchableHighlight
            {...TOUCH_NONE}
            key={i.id}
            style={{flex: 1}}
            onPress={() => this.onNavIconPress(i)}
          >
            <WebImage name={i.name} style={{flex: 1}}/>
          </TouchableHighlight>
        ))}
      </View>
    )
  }

  onNavIconPress(i) {
    if(i.id === 'question') {
      this.toSendClickPingback('all', 'topic_rule')
      this.setState({
        modalState: {
          ...this.state.modalState,
          modalVisible: true,
          modalMode: 'rule',
        }
      })
    }
    if(i.id === 'share') {
      this.toSendClickPingback('all', 'topic_share1')
      this.goToShare()
    }
  }

  onChangeTab(currentPage) {
    if(currentPage === 0) {
      this.toSendPagePingback('success', {
        block: TopicPk.PINGBACK_BLOCK.all
      })
      this.toSendClickPingback('my', 'topic_all')
    }
    if(currentPage === 1) {
      this.toSendPagePingback('success', {
        block: TopicPk.PINGBACK_BLOCK.my,
        from: 'topiclist',
      })
      this.toSendClickPingback('all', this.state.dotPage === 1 ? 'topiclist_myget' : 'topiclist_my')
      this.setState({showDot: false})
    }
    if(this.refreshStack[currentPage]) {
      this._children[currentPage].getWrappedInstance().onRefresh()
    }
    this.refreshStack[currentPage] = true
  }

  onChildUpdate({firstItem = null, modalState = null} = {}) {
    if(firstItem !== null) {
      this.setState({firstItem})
    }
    if(modalState !== null) {
      this.setState({
        modalState: {
          ...this.state.modalState,
          ...modalState,
        }
      })
    }
  }

  onModalConfirm(modalMode) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        modalVisible: false,
      }
    })
    if(modalMode === 'reminder') {
      const {modalState} = this.state
      if(modalState.content.id === 'doCall') {
        this.toSendClickPingback('successModal', 'topic_share2')
      }
      if(modalState.content.id === 'getReward') {
        this.toSendClickPingback('getAwardModal', 'topic_share3')
      }
      this.goToShare()
    }
  }

  onModalClose() {
    this.setState({
      modalState: {
        ...this.state.modalState,
        modalVisible: false,
      }
    })
  }

  goToShare() {
    const {firstItem} = this.state
    if(!firstItem) return

    const {
      name,
      options: [
        {title: titleA, picture},
        {title: titleB}
      ],
    } = firstItem
    const options = {
      title: `${titleA} VS ${titleB}`,
      url: TOPIC_PK_SHARE_URL[GET_ENV()],
      text: name,
      shareType: 1,
      pic: picture,
    }

    shareSNS(options)
  }

  toSendPagePingback(page = 'success', options = {}) {
    let newOptions = {
      ...options,
      score: this.props.totalScore
    }
    sendPagePingback(TopicPk.PINGBACK_RPAGE[page], newOptions)
  }

  toSendBlockPingback(block, options) {
    sendBlockPingback(TopicPk.PINGBACK_RPAGE.success, TopicPk.PINGBACK_BLOCK[block], options)
  }

  toSendClickPingback(block, rseat, options) {
    sendClickPingback(TopicPk.PINGBACK_RPAGE.success, TopicPk.PINGBACK_BLOCK[block], rseat, options)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  navRightWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
