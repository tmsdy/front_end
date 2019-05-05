/**
 * 通用文字弹框
 *  */
import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import {Text} from '@iqiyi/rn-ui'
import ConfirmModal from './ConfirmModal'

export class SuccessModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      title: '',
      content: '',
    }
  }
  showModal = ({title, content}) => {
    this.setState({
      modalVisible: true,
      title,
      content
    })
  }
  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }
  render() {
    const { modalVisible, title, content } = this.state
    return (
      <ConfirmModal
        modalVisible={modalVisible}
        cancelFn={this.hideModal}
      >
        <View style={success.container}>
          <Text style={success.title}>{title}</Text>
          <View style={success.content}>
            <Text style={success.text}>{content}</Text>
          </View>
          <TouchableOpacity activeOpacity={1} onPress={this.hideModal}>
            <View style={success.successButton}>
              <Text style={success.xqgl}>我知道了</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }
}

// 成功弹框样式
const success = StyleSheet.create({
  text: {
    color: '#333',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'PingFangSC-Regular',
    textAlign: 'center'
  },
  xqgl: {
    color: '#3030B5',
    fontSize: 16
  },
  container: {
    width: 270,
    minHeight: 135,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#333333',
    lineHeight: 50,
    fontWeight: 'bold'
  },
  successButton: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: 270,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6'
  },
  content: {
    minHeight: 40,
    paddingHorizontal: 30,
    paddingBottom: 17.5
  }
})
