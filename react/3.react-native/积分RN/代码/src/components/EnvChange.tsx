/**
 * 隐藏域 用于 生产和测试环境切换，慎改！！！！！！！！！！！
 * @lk
 */
import React, {PureComponent} from 'react';
import {AsyncStorage, Text, TouchableOpacity, View} from 'react-native';
import {Width} from '@iqiyi/rn-utils';
import {showToast} from '../common/QYNativeBridge';
import {GET_ENV} from '../constants/configs';

interface EnvChangeState {
  env: string;
}

export default class extends PureComponent<{}, EnvChangeState> {
  private count: number; // 连续点击7次切换环境
  private isChanged: boolean; // 只执行一次环境变更
  private lastPressTime: number; // 记录上次点击时间，连续点击时间间隔超过1s，则重置累计次数

  constructor(props: object) {
    super(props)
    this.state = {
      env: GET_ENV(),
    }

    this.count = 0
    this.isChanged = false
    this.lastPressTime = 0
  }

  componentWillUnmount() {
    this.count = 0
  }

  render() {
    const {env} = this.state

    return (
      <TouchableOpacity onPress={this.addCount} activeOpacity={1}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: Width,
            height: 25,
            opacity: env === 'test' ? 1 : 0,
          }}
        >
          <Text>警告！当前环境为{env}环境数据！</Text>
        </View>
      </TouchableOpacity>
    )
  }

  private addCount = () => {
    const nowTime = Date.now()

    // 连续点击时间间隔超过1s，则重置累计次数
    if(this.lastPressTime && nowTime - this.lastPressTime > 1000) {
      this.lastPressTime = 0
      this.count = 0
      return
    }

    this.lastPressTime = nowTime
    this.count++

    if(!this.isChanged && this.count >= 7) {
      this.isChanged = true
      this.storeData()
    }
  }

  private storeData = async () => {
    // 切换测试环境
    try {
      const {env} = this.state
      await AsyncStorage.setItem('envteststore', env === 'pro' ? 'test' : 'pro');
      const value = await AsyncStorage.getItem('envteststore');
      console.log(value) //eslint-disable-line
      showToast(`警告!!!环境切换到${value}成功，仅限内部使用!!!`)
    } catch(e) {} //eslint-disable-line
  }

}
