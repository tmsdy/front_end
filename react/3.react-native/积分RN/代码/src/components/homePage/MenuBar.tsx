/**
 * Created by liuzhimeng.
 * @date 2019-04-18
 * @description 积分中心菜单栏
 */

import React, {PureComponent} from 'react'
import {View} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'

import BaseStyleSheet from '../../common/BaseStyleSheet'
import MenuItem, {MenuItemProps} from './MenuItem'

// eslint-disable-next-line import/no-cycle
import Router from '../../Router'
import {sendClickPingback} from '../../common/pingback'
import {goToLogin, createUrl, isURL, isPluginURL} from '../../common/util'
import {GET_ENV, BASE_URL, VIP_TASK_URL, GONG_YI_URL} from '../../constants/configs'

interface MenuBarProps {
  list: MenuItemProps['data'][];
  totalScore: number;
  navigate(p: any, o: object): any;
  openWeb(p: any): any;
}

export default class MenuBar extends PureComponent<MenuBarProps, {}> {
  render() {
    if(!this.props.list.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <View style={styles.listWrapper}>
          {this.props.list.map((item, index) => (
            <MenuItem
              key={item.entityId}
              data={item}
              onPress={() => this.onPress(item, index)}
            />
          ))}
        </View>
        <View style={styles.hairLine}/>
      </View>
    )
  }

  // 点击顶部导航栏 TODO中文比较
  onPress = (item: MenuItemProps['data'], index: number) => {
    sendClickPingback('pointcenter', '', `menu_${index + 1}`)

    const {isLogin, clickEvent, type, fullscreen} = item.values

    if(isLogin === 1 && !global.USER_INFO.isLogin) {
      return goToLogin()
    }

    // 积分内的页面建议clickEvent 与Router保持一致，区分大小写；其他页面，根据url跳转
    if(clickEvent && Router[clickEvent]) {
      return this.props.navigate(clickEvent, {from: 'homepage'})
    }

    // 积分外的页面，统一处理
    // 会员任务跳转
    if(clickEvent === 'viptask') {
      return this.props.openWeb(VIP_TASK_URL)
    } else if(clickEvent === 'gongyi') {
      return this.props.openWeb(GONG_YI_URL)
    }

    const {entityUrl} = item

    if(entityUrl) {
      // H5页面链接
      if(isURL(entityUrl)) {
        const _url = this.getUrl(entityUrl)
        if(fullscreen === 1) {
          if(isIOS) {
            this.props.openWeb(JSON.stringify({url: _url, isFullScreen: '1'}))
          } else {
            this.props.openWeb(JSON.stringify({url: _url, orientation: 'landscape'}))
          }
        } else {
          this.props.openWeb(_url)
        }
      }

      // 注册制链接
      if(isPluginURL(entityUrl)) {
        this.props.openWeb(entityUrl)
      }

      // TODO 游戏不建议配置在导航栏
      if(type === 'ball') {
        const {userIcon, userId} = global.USER_INFO
        const url = `${entityUrl}?userIcon=${encodeURIComponent(userIcon)}&userId=${encodeURIComponent(String(userId))}`
        const toValue = isIOS
          ? {url, uiMode: 9}
          : {url, have_operation_view: false, disable_hardware_acceleration: true}

        return this.props.openWeb(JSON.stringify(toValue))
      }
    }
  }

  getUrl = (url: string) => {
    const params = {
      uid: global.USER_INFO.userId,
      credits: this.props.totalScore,
      timestamp: Date.now(),
      appKey: 'basic_h5',
      dbredirect: url,
    };
    const exemptUrl = `${BASE_URL.community[GET_ENV()]}/score/exemptLogin`
    return createUrl(exemptUrl, params)
  }

}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
  },

  listWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hairLine: {
    width: '100%',
    height: BaseStyleSheet.hairlineWidth,
    backgroundColor: '#E2E2E2',
    marginTop: 22,
  },
})
