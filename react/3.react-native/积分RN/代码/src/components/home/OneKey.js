/**
 * Created by kerwinliu on 2018/7/3.
 */
/*
 * 一键领取
 * */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native'
import {connect} from 'react-redux'
import {
Text
} from '@iqiyi/rn-ui'
import {
Width,
} from '@iqiyi/rn-utils'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {TOUCH_COLORFUL_MASK} from '../../constants/touchableStyle';
import WebImage from '../WebImage'

@connect((state = {}) => {
  const {changedTotalScore = {}} = state;
  return { // TODO: channelCode已经从积分store中移除, 需单独维护
    channelCode: changedTotalScore.channelCode
  }
}, null)
export default class extends Component {

  constructor(props) {
    super(props)
    const {completedTasks = []} = this.props
    this.state = {
      completedTasks,
      title: '一键领取'
    }
  }

  render() {
    const {completedTasks} = this.state
    return (
      <React.Fragment>
        {
          completedTasks.length > 0 ?
            <WebImage name="bg_news_new" style={[styles.swiper_box, this.props.style]}>
              <WebImage name="ic_news" style={styles.speaker}/>
              {
                this._renderTodo()
              }
            </WebImage> : null
        }
      </React.Fragment>
    )
  }

  // 首页单个任务领取时候需要减少一键领取的数量
  filterList = (channelCode) => {
    const {completedTasks} = this.state
    return completedTasks.filter(t => t.channelCode !== channelCode)
  }
  // 一键领取积分
  _renderTodo = () => {
    const {completedTasks} = this.state
    const {_getTaskReward, showDoubleCard} = this.props
    const score = completedTasks.reduce((prev, curr) => {
      const isDouble = !!curr.multiple && !!showDoubleCard
      const currScore = isDouble ? parseInt(curr.score) * 2 : parseInt(curr.score)
      return parseInt(prev) + currScore
    }, 0)

    return (
      <View style={[styles.notice_bar, {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }]}
      >
        <Text style={styles.notice_text} numberOfLines={1}>{score}积分待领取</Text>
        <TouchableHighlight
          {...TOUCH_COLORFUL_MASK}
          onPress={() => {
            _getTaskReward({dataList: completedTasks});
            this.setState({title: '领取中'})
          }}
          style={[styles.task_button, {borderRadius: 25}]}
        >
          <LinearGradient
            start={{
              x: 1,
              y: 0
            }}
            end={{
              x: 0,
              y: 1
            }}
            colors={['#FF7905', '#FF9800']}
            style={styles.task_button}
          >
            <Text style={styles.text}>{this.state.title}</Text>
          </LinearGradient>
        </TouchableHighlight>
      </View>

    )
  }


  componentWillReceiveProps(nextProps) {
    // 参数来源有2处，首页的任务领取，则有新的 channelCode 传递
    // 其他地方触发 首页刷新，则有新的 completedTasks
    if(nextProps.channelCode !== this.props.channelCode) {
      // 总分改变说明接口刷新了
      this.setState({
        completedTasks: this.filterList(nextProps.channelCode)
      })
      return
    }
    this.setState({
      completedTasks: nextProps.completedTasks
    })
  }
}
const styles = StyleSheet.create({
  swiper_box: {
    width: Width,
    height: Width * 0.186667,
    paddingLeft: 27,
    paddingRight: 18.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  speaker: {
    width: 20,
    height: 20,
  },
  notice_bar: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  text: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: '#ffffff',
  },
  notice_text: {
    fontSize: 13,
    color: '#ff6600',
  },
  task_button: {
    width: 80,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
})
