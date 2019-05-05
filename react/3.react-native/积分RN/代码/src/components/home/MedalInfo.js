/*
*首页勋章信息
* */
import React, {Component} from 'react'
import {
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'
import {executeTask} from '../../api'
import WebImage from '../WebImage'
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      medalInfo: {
        completes: 0,
        rewards: 0
      },
      bubleVisble: false
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const requestHeader = {
      task_code: 'growth_achievement_statInfo_v2',
      timestamp: Date.now(),
    }
    const requestBody = {
      growth_achievement_statInfo_v2: {
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        appver: global.CLIENT_INFO.appVersion,
        channelGroup: 200,
        verticalCode: 'iQIYI',
        userId: global.USER_INFO.userId,
        typeCode: 'Point_EXP',
      }
    }
    executeTask(requestHeader, requestBody)
      .then((data) => {
        if (data.code === 'A0000') {
          this.setState({
            medalInfo: data.data
          })
          const {completes, rewards} = data.data
          if (completes - rewards > 0) {
            this.setState({bubleVisble: true})
          }
        }
      })
  }
  _press = () => {
    const {bubleVisble} = this.state
    const {_goMedals} = this.props
    if (bubleVisble) {
      this.setState({bubleVisble: false})
    }
    _goMedals()
  }

  render() {
    const {medalInfo, bubleVisble} = this.state
    const {completes = 0} = medalInfo // 总共领取成就任务数目
    return (
      <TouchableHighlight onPress={this._press} style={styles.numbermedal} {...TOUCH_LIGHT_MASK}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            bubleVisble && <WebImage
              name="red_icon_medal"
              style={{
                width: 15,
                height: 15,
                marginRight: 3.5
              }}
            />
          }
          <Text style={{fontSize: 12, color: '#333'}}>已获{completes}枚勋章</Text>
          <WebImage
            name="ic_arrow_small"
            style={{
              width: 12,
              height: 12,
              marginLeft: 2
            }}
          />
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  numbermedal: {
    width: 110,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 14.5,
    borderBottomLeftRadius: 14.5,
    position: 'absolute',
    top: 23.5,
    right: 0
  },
})
