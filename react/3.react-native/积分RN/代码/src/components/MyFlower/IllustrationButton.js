/**
 * 花儿图鉴按钮
 */
import React, {PureComponent} from 'react'

import FadeInBtn from '../FadeInBtn'
import WebImage from '../WebImage'
import IllustrationModal from './IllustrationModal'

import {sendClickPingback} from '../../common/pingback'

export default class IllustrationButton extends PureComponent {
  render() {
    return (
      <FadeInBtn onPress={this.showModal} style={styles.diaryBtn}>
        <WebImage name="illustration_icon_page" style={styles.diaryIcon}/>
      </FadeInBtn>
    )
  }

  showModal = () => {
    sendClickPingback('flower_page', 'book', 'bookbtn')

    this.props.showConfirmModal({
      showCloseButton: false,
      content: (
        <IllustrationModal
          showConfirmModal={this.props.showConfirmModal}
          hideConfirmModal={this.props.hideConfirmModal}
          openWeb={this.props.openWeb}
        />
      ),
    })
  }
}

const styles = BaseStyleSheet.create({
  diaryBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  diaryIcon: {
    width: 40,
    height: 43
  },
})
