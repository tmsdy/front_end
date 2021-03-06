/**
 * 调用说明：
 * <Loading ref={r=>{this.RequestLoading = r}} hide = {true} /> //放在布局的最后即可
 * 在需要显示的地方调用this.Loading.show();
 * 在需要隐藏的地方调用this.Loading.close();
 */

import React, {Component} from 'react'
import {Platform, View, Text} from 'react-native'
import PropTypes from 'prop-types'
import ConfirmModal from '../ConfirmModal'
import WebImage from '../WebImage'

export default class Loading extends Component {
  static propTypes = {
    hide: PropTypes.bool.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: !this.props.hide
    }
  }
  render() {
    if(!this.state.modalVisible) {
      return null
    }
    return (
      <ConfirmModal modalVisible={this.state.modalVisible} isTransparent={true}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            backgroundColor: '#666666',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <WebImage name="loading" style={{width: 32, height: 32}}/>
          <Text style={{color: '#fff', marginTop: 10}}>正在处理...</Text>
        </View>
      </ConfirmModal>
    )
  }
  close() {
    if(Platform.OS === 'android') {
      setTimeout(() => {
        this.setState({modalVisible: false})
      }, 1000)
    } else {
      this.setState({modalVisible: false})
    }
  }

  show() {
    this.setState({modalVisible: true})
  }
}
