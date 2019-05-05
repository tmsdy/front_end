/**
 * 弹框容器
 * Created by xushichao on 2018-12-12.
 */
import React, {PureComponent} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {Width} from '@iqiyi/rn-utils';

import BaseStyleSheet from '../common/BaseStyleSheet'
import ConfirmModal from './ConfirmModal'

// interface BaseConfirmModalProps {}

interface BaseConfirmModalState {
  visible: boolean; // 当前是否已处于显示状态
  content: React.ReactNode;
  showCloseButton: boolean; // 是否显示关闭按钮, 不显示则点击背景可关闭
  pressBgCloseModal: boolean;
  isTransparent: boolean;
}

export interface BaseConfirmModalConfig {
  content: React.ReactNode;
  showCloseButton?: boolean; // 是否显示关闭按钮, 不显示则点击背景可关闭
  pressBgCloseModal?: boolean;
  isTransparent?: boolean;
}

interface ConfirmModalPool {
  config: BaseConfirmModalConfig;
  resolve(value?: {} | PromiseLike<{}>): void;
}

export default class BaseConfirmModal extends PureComponent<{}, BaseConfirmModalState> {

  private confirmModalPool: ConfirmModalPool[];
  private onHide: ConfirmModalPool['resolve'];

  static current: {visible: false}

  constructor(props: object) {
    super(props);

    this.state = {
      visible: false, // 当前是否已处于显示状态
      content: null,
      showCloseButton: true, // 是否显示关闭按钮, 不显示则点击背景可关闭
      pressBgCloseModal: true,
      isTransparent: false
    };

    this.confirmModalPool = []; // 弹框池
    this.onHide = null;
  }

  render() {
    let {visible, content, showCloseButton = true, pressBgCloseModal = true, isTransparent = false} = this.state;
    if(showCloseButton) {
      return (
        <ConfirmModal
          modalVisible={visible}
          cancelFn={this.negativeHide}
          showCloseButton={showCloseButton}
          isTransparent={isTransparent}
        >
          {content}
        </ConfirmModal>
      )
    } else if(pressBgCloseModal) {
      return (
        <ConfirmModal
          modalVisible={visible}
          cancelFn={this.negativeHide}
          showCloseButton={showCloseButton}
          isTransparent={isTransparent}
        >
        {/* 不显示关闭按钮, 则支持点击背景可关闭 */}
        <TouchableOpacity activeOpacity={1} style={styles.bg} onPress={this.negativeHide}/>
        <View style={styles.container} pointerEvents="box-none">
          {content}
        </View>
        </ConfirmModal>
      )
    } else {
      return (
        <ConfirmModal
          modalVisible={visible}
          cancelFn={this.negativeHide}
          showCloseButton={showCloseButton}
          isTransparent={isTransparent}
        >
          {content}
        </ConfirmModal>
      )
    }
  }

  show = () => {
    if(this.confirmModalPool.length) {
      let {config, resolve} = this.confirmModalPool.shift(), // 先进先出
        {content, showCloseButton, pressBgCloseModal, isTransparent} = config;
      this.setState({visible: true, content, showCloseButton, pressBgCloseModal, isTransparent}, () => {
        this.onHide = resolve;
      });
    }
  };

  hide = (isPositive: boolean) => {
    return new Promise((resolve) => {
      this.setState({visible: false, content: null}, () => {
        this.onHide && this.onHide(isPositive);
        this.onHide = null;
        resolve();
        // 尝试显示正在排队的modal
        setTimeout(this.show, 0);
      });
    });
  };

  queueToShow = (config: BaseConfirmModalConfig, inTime = false) => { // inTime 表示在排队后是否主动触发显示
    if(config && config.content) {
      return new Promise((resolve) => {
        this.confirmModalPool.push({config, resolve});
        if(!this.state.visible && inTime) { // 当前没有modal在显示, 则触发显示; 否则仅排队
          this.show();
        }
      });
    } else {
      return Promise.reject(new Error('invalid config'));
    }
  };

  positiveHide = () => { // 由外部代码触发的积极隐藏
    return this.hide(true);
  };

  negativeHide = () => { // 点击背景或关闭按钮触发的消极隐藏
    return this.hide(false);
  };
}

const styles = BaseStyleSheet.create({
  container: {
    width: Width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
