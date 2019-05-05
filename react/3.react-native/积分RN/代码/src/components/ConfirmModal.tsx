/**
 * Created by jerryliu on 2017/11/23.
 * 公用确认弹框
 * */
import React, {PureComponent} from 'react'
import {TouchableOpacity, Modal, View} from 'react-native'
import WebImage from './WebImage'
import styles from '../constants/modalCommonStyle'
import {ImageStyle} from '../common/BaseStyleSheet';

const CLOSE_BUTTON_SIZE = {
  width: 32,
  height: 32,
}

interface ConfirmModalProps {
  modalVisible: boolean;
  iconName?: string;
  iconStyle?: ImageStyle;
  showCloseButton?: boolean;
  isTransparent?: boolean;
  children?: React.ReactNode;
  cancelFn?(): void;
}

interface ConfirmModalState {
  modalVisible: boolean;
}

export default class ConfirmModal extends PureComponent<ConfirmModalProps, ConfirmModalState> {
  static defaultProps = {
    modalVisible: false,
    showCloseButton: false,
    isTransparent: false,
    cancelFn: global.NOOP,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.modalVisible !== prevState.modalVisible) {
      return {
        modalVisible: nextProps.modalVisible
      }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.modalVisible,
    }
  }


  render() {
    const {iconName, iconStyle, showCloseButton, cancelFn, children, isTransparent} = this.props

    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={cancelFn}
      >
        <View style={isTransparent ? styles.modalContainerTrans : styles.modalContainer}>
          <View style={styles.innerContainer}>
            {children}
            {!!iconName && <WebImage name={iconName} style={iconStyle} />}
            {showCloseButton && (
              <TouchableOpacity style={styles.closeButton} onPress={cancelFn}>
                <WebImage name="closeBtn" style={CLOSE_BUTTON_SIZE} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    )
  }
}
