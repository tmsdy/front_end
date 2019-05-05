/**
 * 脑洞投稿新手引导弹窗
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';

import BaseStyleSheet from '../../common/BaseStyleSheet';

import WebImage from '../WebImage';

interface NewGuideModalProps{
  hide: Function;
  goTo: Function;
  iconName: string;
}

export default class SubmitModal extends PureComponent<NewGuideModalProps, {}> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    const {iconName} = this.props
    return (
      <View>
        <WebImage name={iconName} style={styles.modalContainer}/>
      </View>
    )
  }

  onHandleClick = () => {
    this.props.hide().then(this.props.goTo('MySubmitList'))
  }

}

const styles = BaseStyleSheet.create({
  modalContainer: {
    width: 150,
    height: 140
  },
})
