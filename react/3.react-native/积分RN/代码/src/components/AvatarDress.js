/**
 * Created by kerwinliu on 2018/8/15.
 */
import React , { Component } from 'react'
import {
  Image
}from '@iqiyi/rn-ui'
import {
  getAsyncStorage
} from '../common/util'
import { connect } from 'react-redux'
import {executeTask} from '../api'
import {
  Width,
  isIOS
} from '@iqiyi/rn-utils'
import { bindActionCreators } from 'redux'
import {changeAvatar} from '../actions/changeAvatar'
@connect((state = {}) => {
  const { changeAvatar = {} } = state;
  return {
    dress: changeAvatar.dress,
    avatar: changeAvatar.avatar
  }
}, null)

export default class extends Component{
  constructor(props){
    super(props)
    this.state = {
      avatar:null,
      dress:null
    }
    this.userInfoId = global.USER_INFO.userId
  }
  componentDidMount(){
    if(!this.props.dress){
      this.getDressUp()
    }
  }
  getDressUp = () => {
  //   const requestHeader = {
  //     task_code: 'growth_medal',
  //     timestamp: Date.now(),
  // }
  // const requestBody = {
  //   growth_medal: {
  //         agentversion: global.CLIENT_INFO.appVersion,
  //         srcplatform: isIOS ? '20' : '21',
  //         agenttype: isIOS ? '20' : '21',
  //         appver: global.CLIENT_INFO.appVersion,
  //         verticalCode: 'iQIYI',
  //         userId: global.USER_INFO.userId,
  //         typeCode: 'Point_EXP',
  //     }
  // }
  // executeTask(requestHeader, requestBody).then((data) => {
  //     if(data.code==='A0000'){
  //       const {channelCode} = data.data
  //       this.setState({
  //         dress: !!channelCode ? channelCode : 'default',
  //       });
  //     }
  // })
    const keys = [`dress${this.userInfoId}`];
    const _this = this
    const keys2 = [`avatar${this.userInfoId}`];
    getAsyncStorage(keys, (errs, result) => {
      if (errs) {
        return;
      }
      // 得到的结果是二维数组（result[i][0]表示我们存储的键，result[i][1]表示我们存储的值）
      _this.setState({
        dress: (result[0][1] != null) ? result[0][1] : 'default',
      });
    })
    getAsyncStorage(keys2, (errs, result) => {
      if (errs) {
        return;
      }
      // 得到的结果是二维数组（result[i][0]表示我们存储的键，result[i][1]表示我们存储的值）
      _this.setState({
        avatar: (result[0][1] != null) ? result[0][1] : '',
      });
    })
  }
  render(){
    const { avatar , dress} = this.state
    const dressCode = this.props.dress || dress
    const avatarUrl = dressCode == 'default' ? '' : (this.props.avatar || avatar)
    const avatarStyle = this.props.avatarStyle || {position: 'absolute', width: 80, height: 80, top: 0, left: 0,}
    return (
      <Image
        source={{uri: avatarUrl}}
        style={avatarStyle} />
    )
  }
}