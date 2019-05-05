/**
 * Created by liuzhimeng.
 * @date 2019-01-31
 * @description 默认顶部导航栏组件
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import {NavBar} from '@iqiyi/rn-navigation'
import BaseStyleSheet, {ViewStyle} from '../common/BaseStyleSheet'
import WebImage from './WebImage'
import ReduxUtil from '../common/ReduxUtil'

const PAGE_BACK_ICON = {
  black: 'icon/page-back-black',
  white: 'icon/page-back-white',
}

interface DefaultNavBarProps {
  type?: 'black' | 'white';
  title?: string;
  titleColor?: string;
  titleFontSize?: number;
  backImage?: string;
  backgroundColor?: string;
  borderBottomColor?: string;
  renderRightView?: React.ReactNode;
  rightViewWidth?: number;
  backPress?(): void;
  style?: ViewStyle;
}

interface DefaultNavBarState {
  title: string;
}

export default class DefaultNavBar extends PureComponent<DefaultNavBarProps, DefaultNavBarState> {
  private headerview: any;

  static defaultProps = {
    backgroundColor: '#FF8A12',
    borderBottomColor: 'transparent',
    titleColor: '#FFFFFF',
    titleFontSize: 18,
    type: 'white',
    backPress: global.NOOP,
  }

  static getDerivedStateFromProps(nextProps: DefaultNavBarProps, prevState: DefaultNavBarState) {
    if(nextProps.title !== prevState.title) {
      return {
        title: nextProps.title,
      }
    }
    return null
  }

  constructor(props: DefaultNavBarProps) {
    super(props)
    this.state = {
      title: this.props.title,
    }

    this.headerview = ReduxUtil.createRef()
  }

  render() {
    const backgroundColor = this.props.backImage ? 'transparent' : this.props.backgroundColor

    return (
      <View style={this.props.style}>
        {this.renderImageBg(
          <NavBar
            ref={this.headerview}
            {...this.props}
            backgroundColor={backgroundColor}
            renderLeftView={this.renderLeftBack}
            renderCenterView={this.renderTitle}
          />
        )}
      </View>
    )
  }

  private renderImageBg = (children: React.ReactNode) => {
    const {backImage, style} = this.props
    return backImage
      ? <WebImage style={style} name={backImage}>{children}</WebImage>
      : children
  }

  // 导航栏标题
  private renderTitle = () => {
    const {titleColor: color, titleFontSize: fontSize} = this.props
    return (
      <Text style={[styles.navTitle, {color, fontSize}]} allowFontScaling={false} numberOfLines={1}>
        {this.state.title}
      </Text>
    )
  }

  // 左侧返回按钮
  private renderLeftBack = () => {
    const {type, backPress} = this.props

    return (
      <TouchableOpacity activeOpacity={1} onPress={backPress}>
        <WebImage style={styles.leftBackIcon} name={PAGE_BACK_ICON[type]} />
      </TouchableOpacity>
    )
  }

  // 更新标题
  public setTitle = (title: string) => {
    this.setState({title})
  }

  // 获取NavBar实例
  public getNavBar = (): Promise<any> => {
    return this.headerview.getInstance()
  }
}

const styles = BaseStyleSheet.create({
  navTitle: {
    alignSelf: 'center',
    maxWidth: 180,
    fontWeight: BaseStyleSheet.FontWeight.Bold,
  },
  leftBackIcon: {
    width: 44,
    height: 44,
  },
})
