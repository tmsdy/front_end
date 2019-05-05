/**
 * 商品兑换成功或失败Modal
 */
import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from '@iqiyi/rn-ui';
import PropTypes from 'prop-types';
import ConfirmModal from '../ConfirmModal';
import WebImage from '../WebImage';
// to do modal样式支持自定义
export default class ConvertLoading extends PureComponent {
  static propTypes = {
    modalVisible: PropTypes.bool, // modal弹框是否显示
    showCancleBtn: PropTypes.bool, // 是否显示取消按钮
    showConfirmBtn: PropTypes.bool, // 是否显示确认按钮
    showConfirmBtnText: PropTypes.string, // 确认按钮文案
    showCancleBtnText: PropTypes.string, // 取消按钮文案
    showVerticalLine: PropTypes.bool, // 是否显示button竖线 只有两个按钮时才显示
    showHorizontalLine: PropTypes.bool, // 是否显示横线
    showCloseBtn: PropTypes.bool, // 是否显示关闭按钮
    content: PropTypes.string, // modal 内容
    closeBtnFn: PropTypes.func, // 关闭按钮事件
    cancleBtnFn: PropTypes.func, // 取消按钮事件
    confrimBtnFn: PropTypes.func // 确认按钮事件
  };

  static defaultProps = {
    modalVisible: false,
    showCancleBtn: true,
    showConfirmBtn: true,
    showConfirmBtnText: '确定',
    showCancleBtnText: '取消',
    showVerticalLine: true,
    showHorizontalLine: true,
    showCloseBtn: true,
    content: '',
    closeBtnFn: () => null,
    cancleBtnFn: () => null,
    confrimBtnFn: () => null
  };

  render() {
    const {
      modalVisible,
      showCancleBtn,
      showConfirmBtn,
      showConfirmBtnText,
      showCancleBtnText,
      showVerticalLine,
      showHorizontalLine,
      showCloseBtn,
      content,
      closeBtnFn,
      cancleBtnFn,
      confrimBtnFn
    } = this.props;
    return (
      <ConfirmModal modalVisible={modalVisible}>
        <View style={styles.convert}>
          <View style={styles.convertWrap}>
            <Text style={styles.content}>{content}</Text>
            <View style={styles.buttonView}>
              {showHorizontalLine ? <View style={styles.horizontalLine} /> : null}
              {showCancleBtn ? (
                <TouchableOpacity underlayColor="transparent" style={styles.buttonStyle} onPress={() => cancleBtnFn()}>
                  <Text style={styles.buttonText}>{showCancleBtnText}</Text>
                </TouchableOpacity>
              ) : null}
              {showVerticalLine && showCancleBtn && showConfirmBtn ? <View style={styles.verticalLine} /> : null}
              {showConfirmBtn ? (
                <TouchableOpacity underlayColor="transparent" style={styles.buttonStyle} onPress={() => confrimBtnFn()}>
                  <Text style={[styles.buttonText, {fontFamily: 'PingFangSC-Medium'}]}>{showConfirmBtnText}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          {showCloseBtn ? (
            <TouchableOpacity onPress={() => closeBtnFn()}>
              <WebImage name="activate-close" style={styles.closeIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ConfirmModal>
    );
  }
}

const styles = StyleSheet.create({
  convert: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  convertWrap: {
    width: 270,
    height: 125,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  content: {
    paddingTop: 58 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'PingFangSC-Regular'
  },
  convertSuscess: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22
  },
  text: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 5
  },
  closeIcon: {
    width: 40,
    height: 40,
    marginTop: 50
  },
  // 水平的分割线
  horizontalLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 1,
    width: 270,
    backgroundColor: '#eeeeee'
  },
  // 按钮
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonStyle: {
    flex: 1,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  // 竖直的分割线
  verticalLine: {
    width: 0.5,
    height: 45,
    backgroundColor: '#eee'
  },
  buttonText: {
    fontSize: 16,
    color: '#FF6600',
    textAlign: 'center'
  }
});
