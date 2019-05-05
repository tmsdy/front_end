/**
 * Created by kerwinliu on 2018/9/14.
 * // TODO 深度任务的流程是先获取棋谱配置的六个字符串， 再根据字符串请求后端结果， 可以通过引擎修改为一个接口
 */
/*
* 深度任务列表
* */
import React, {Component} from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import {
  isIOS
} from '@iqiyi/rn-utils'
import {
  executeTask
} from '../../api'
import DeepTaskItem, {Future} from './DeepTaskItem'
import {formatQipuDataElementsSummary} from '../../common/util'

let DEEP_TASK_LIST = []
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      onBehindTask: [],
    }
  }

  componentDidMount() {
    this.getListData()
  }
  render() {
    const {list} = this.state
    const num = list.reduce((accumulator, item) => (item && item.length ? accumulator + item.length : accumulator), 0)
    return (
      <React.Fragment>
        {!!num && (
            <View style={{width: '100%', marginBottom: 15, height: 140}}>
              <ScrollView style={{flex: 1}} showsHorizontalScrollIndicator={false} scrollEnabled={list.length > 2} horizontal={true}>
                <View style={{width: 9}}/>
                {list.map((item, i) => {
                  return (
                    item && item.length
                    ? <DeepTaskItem
                      {...this.props}
                      ref={(children) => { this.taskItemRefs[i] = children }}
                      data={item}
                      key={item[0] ? item[0].id : 0}
                      goTo={this.props.goTo}
                      onTurnPage={({toShowBehind}) => this.onTurnPage(toShowBehind, i)}
                      getList={() => { this.getList(DEEP_TASK_LIST) }}
                    />
                    : null
                  )
                })}
                {num < 2 && <Future/>}
                <View style={{width: 9}}/>
              </ScrollView>
            </View>
          )
        }
      </React.Fragment>
    )
  }
  taskItemRefs = []

  getListData = () => {
    const _this = this
    this._getQiPuData()
      .then((data) => {
        const request = data.map((item) => {
          return item.values.sequencename
        })

        if(request.length) {
          DEEP_TASK_LIST = request
          _this.getList(request)
        }
      }).catch()
  }
  _getQiPuData = () => {
    const requestHeader = {
      task_code: 'qipu_deep_task_list',
      timestamp: Date.now(),
    }
    return new Promise((resolve) => {
      executeTask(requestHeader)
        .then((data) => {
          if(data) {
            const {elements_summary: summary} = data
            const deepTask = formatQipuDataElementsSummary(summary);
            resolve(deepTask)
          } else {
            resolve([])
          }
        })
        .catch(err => Promise.reject(err))
    })

  }
  getList = (request) => {
    const bodyParams = {
      growth_task_sequence_list: {
        verticalCode: 'iQIYI',
        sequenceGroup: request.join(','),
        platform: isIOS ? '2_22_221' : '2_22_222',
        need_ext: true,
        channelGroup: '188',
        userId: global.USER_INFO.userId,
        typeCode: 'point',
        agenttype: isIOS ? '20' : '21',
        srcplatform: isIOS ? '20' : '21',
        agentversion: global.COMMON_PARAMS.appver,
        appver: global.COMMON_PARAMS.appver,
        qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
      }
    }

    const params = {
      task_code: 'growth_task_sequence_list',
      timestamp: Date.now(),
    }
    executeTask(params, bodyParams)
      .then((data) => {
        if(data.code === 'A0000') {
          this.setState({
            list: data.data
          })
        }
      })
      .catch(err => Promise.reject(err))
  }

  onTurnPage(toShowBehind, key) {
    let {onBehindTask} = this.state
    if(toShowBehind) {
      onBehindTask = onBehindTask.map((showBehind, k) => {
        // 翻转处于背面的卡片
        if(showBehind) {
          this.taskItemRefs[k].getWrappedInstance().turnPage()
        }
        return false
      })
    }
    // 保存当前卡片状态
    onBehindTask[key] = toShowBehind
    this.setState({onBehindTask})
  }
}
