/**
 * @description: 用户未获得任何勋章时的推荐弹框
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Width as deviceWidth, isLikeX} from '@iqiyi/rn-utils'
import {View, Text, Modal} from '@iqiyi/rn-ui';
import LinearGradient from '@iqiyi/rn-gradient-view';
import WebImage from '../WebImage';
import {BG_GRADIENT_START, BG_GRADIENT_END} from '../../constants/baseStyles';

export default class extends Component {
  static propTypes = {
    buttonTextStyle: PropTypes.string, // button文案样式
    btnText: PropTypes.string, // button文案
    gradientStyle: PropTypes.object, // button文案渐变样式
    btnOnPress: PropTypes.func, // button点击事件
    title: PropTypes.string, // 推荐弹框标题
    rule: PropTypes.string, // 获取条件
    medalText: PropTypes.string, // 勋章特权文案
    recommendModalVisible: PropTypes.bool, // 是否展示弹框
    closeRecommendModal: PropTypes.func, // 关闭弹框
    medalImg: PropTypes.string, // 勋章图片
  };
  static defaultProps = {
    title: 'medal/medal-rnew-title',
    btnText: '去商城薅羊毛',
    rule: '【获取条件】过往1个月积分商城完成3订单',
    medalText: '特权：满25元减5元代金券1张',
    medalImg: 'medal/master-shopper',
    gradientStyle: {},
    btnOnPress: () => null,
    recommendModalVisible: false,
    closeRecommendModal: () => null
  };

  render() {
    return (
      <Modal isVisible={this.props.recommendModalVisible} opacity={0.8}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.modalClose} activeOpacity={1} onPress={() => this.props.closeRecommendModal()}>
            <WebImage style={styles.modalCloseIcon} name="integralmedal/modal_close" />
          </TouchableOpacity>
          <WebImage style={styles.medalBg} name="medal/medal-light-beam" />
          <View style={styles.info}>
            <WebImage style={styles.medalTitleImage} name={this.props.title} />
            <WebImage style={styles.medalImage} name={this.props.medalImg} />
            <Text style={styles.rule}>{this.props.rule}</Text>
            <Text style={styles.privilege}>{this.props.medalText}</Text>
            <TouchableOpacity onPress={() => this.props.btnOnPress()}>
              <LinearGradient style={[styles.gradient, this.props.gradientStyle]} start={{x: 0, y: 1}} end={{x: 1, y: 1}} colors={[BG_GRADIENT_START, BG_GRADIENT_END]}>
                <Text style={[styles.buttonText, this.props.buttonTextStyle]}>{this.props.btnText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.4)',
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // top: 150
  },
  medalBg: {
    width: 500 / 2,
    height: 699 / 2,
    position: 'absolute',
    top: 0
  },
  modalClose: {
    position: 'absolute',
    top: isLikeX() ? 55 : 25,
    right: 10,
    zIndex: 9,
  },
  modalCloseIcon: {
    width: 44,
    height: 44,
  },
  medalTitleImage: {
    width: 406 / 2,
    height: 95 / 2,
    marginBottom: 50
  },
  medalImage: {
    width: 322 / 2,
    height: 336 / 2
  },
  gradient: {
    width: 610 / 2,
    height: 40,
    marginTop: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#FFFFFF'
  },
  rule: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#E2E2E2',
    marginTop: 29 / 2,
    marginBottom: 5
  },
  privilege: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#E2E2E2'
  }
});
