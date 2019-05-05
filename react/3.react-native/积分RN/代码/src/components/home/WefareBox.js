/**
 * Created by kerwinliu on 2018/6/26.
 */
/*
*积分连续签到弹框模块  使用注意，只在constructor接收参数，所以必须在有数据的情况下渲染，避免空数据渲染
* */
import React, {Component} from 'react'
import { TouchableOpacity } from 'react-native'
import {getAsyncStorage, saveAsyncStorage, goToLogin} from '../../common/util'
import ConfirmModal from '../ConfirmModal'
import WebImage from '../WebImage';
import { executeTask } from '../../api';
import { sendBlockPingback, sendClickPingback } from '../../common/pingback'

// const LEGAO_RESOURCE_ID = '12494925812'
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
        modalVisible: false
    }
  }
  componentDidMount() {
    sendBlockPingback('homeRN', 200700)
    this.getIsShowBoxData()
  }
  getIsShowBoxData = () => {
    const requestHeader = {
      task_code: 'qipu_display_welfare_box',
      timestamp: Date.now(),
    }
    executeTask(requestHeader).then((data) => {
      const resultArray = data && data.elements_summary || [];
      const showBox = resultArray.length && resultArray.filter(fv => fv.order == 1)
      if (showBox.length) {
        this.getIsShowWelfareBox()
      }
    })

  }
    getIsShowWelfareBox = () => {
      const keys = ['welfare_home_box'];
      getAsyncStorage(keys, (errs, result) => {
        if (errs) {
            return;
        }
        // 得到的结果是二维数组（result[i][0]表示我们存储的键，result[i][1]表示我们存储的值）
        const value = (result[0][1] !== null) ? result[0][1] : '';
        if (value === '') {
            this.setState({
                modalVisible: true
            })
        }
        this.setWelfareDataHasClick()
      })
    }
    setWelfareDataHasClick = () => {
        const keys = [['welfare_home_box', 'true']];
        saveAsyncStorage(keys)
    }
    gotoWelfare = () => {
      sendClickPingback('homeRN', 200700, 'hx_tc')
      if (!global.USER_INFO.isLogin) {
          goToLogin()
      }
      this.cancelFn()
      this.props.goTo('Welfare', {from: 'renwu'})
    }
    cancelFn = () => {
        this.setState({
            modalVisible: false
        })
        this.props.showNextModal()
    }
    render() {
        const {modalVisible} = this.state
        return (
            <ConfirmModal
              modalVisible={modalVisible}
              showCloseButton
              cancelFn={this.cancelFn}
            >
            <TouchableOpacity onPress={this.gotoWelfare}>
                <WebImage name="welfare_box" style={{width: 350, height: 378}} />
            </TouchableOpacity>
            </ConfirmModal>
        )
    }
}
