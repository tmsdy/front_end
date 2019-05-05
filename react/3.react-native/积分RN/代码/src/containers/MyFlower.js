/**
 * 养花详情页面
 *
 */
import React from 'react';


import MyFlowerScene from '../components/MyFlower/MyFlowerScene';
import {sendPagePingback} from '../common/pingback';
import {hideLoading} from '../common/QYNativeBridge';
import BasePage from '../components/BasePage';

export default class MyFlower extends BasePage {

  pageName = 'flower_page'

  constructor(props) {
    super(props);

    this.refMyFlowerScene = React.createRef();
  }

  componentDidMount() {
    // TODO 注册制参数跳转过来的，增加from参数
    sendPagePingback(this.pageName, {from: 'share'});
    hideLoading();
  }

  render() {
    return (
      <MyFlowerScene
        {...this.props}
        openWeb={this.openWeb}
        goTo={this.navigate}
        back={this.back}
        ref={this.refMyFlowerScene}
        screenProps={this.props.screenProps}
      />
    );
  }

  onShow() {
    this.refMyFlowerScene.current && this.refMyFlowerScene.current.getWrappedInstance().onShow()
  }
}
