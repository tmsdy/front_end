/**
 * Created by liuzhimeng.
 * @date 2019-04-23
 * @description 积分中心底部栏
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import {Text} from '@iqiyi/rn-ui'

import BaseStyleSheet, {ViewStyle} from '../../common/BaseStyleSheet'

import WebImage from '../WebImage'
import {sendClickPingback} from '../../common/pingback'

interface BottomProps {
  content?: string;
  showArrow?: boolean;
  containerStyle?: ViewStyle;
  goTo?(name: string): void;
}

export default class Bottom extends PureComponent<BottomProps, {}> {
  static defaultProps = {
    content: '去积分商城查看更多',
    showArrow: true,
    containerStyle: {},
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        activeOpacity={1}
        onPress={this.onPress}
      >
        <Text style={styles.text} numberOfLines={1}>{this.props.content}</Text>
        {this.props.showArrow && <WebImage style={styles.icon} name="icon/triangle-right-grey" />}
      </TouchableOpacity>
    )
  }

  onPress = () => {
    sendClickPingback('pointcenter', '', 'shoppingmall')
    this.props.goTo && this.props.goTo('ShoppingMall')
  }

}

const styles = BaseStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 20,
  },
  text: {
    fontSize: 14,
    color: '#999999',
  },
  icon: {
    width: 7,
    height: 12,
    marginLeft: 4,
  }
})
