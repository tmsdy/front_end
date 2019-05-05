/**
 * 花儿日记按钮
 */
import React, {PureComponent} from 'react';

import {Image} from '@iqiyi/rn-ui';

import {fetchHasNewDiary} from '../../model/MyFlower';
import FadeInBtn from '../FadeInBtn';

import DiaryModal from './DiaryModal'

export default class DiaryButton extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      redIconVisible: false,
    }
  }

  componentDidMount() {
    this.fetchHasNewDiary()
  }

  render() {
    const {redIconVisible} = this.state
    return (
      <FadeInBtn onPress={this.showConfirmBox} style={styles.diaryBtn}>
        <Image source={{uri: 'integral_diary_btn_v2'}} style={styles.diaryIcon}>
          {!!redIconVisible && <Image source={{uri: 'integral_diary_red_icon'}} style={styles.redIcon}/>}
        </Image>
      </FadeInBtn>
    )
  }

  fetchHasNewDiary = () => {
    fetchHasNewDiary().then(({hasNew}) => {
      this.setState({
        redIconVisible: hasNew
      })
    })
  }

  showConfirmBox = () => {
    const {wateringInfo, flowerInfo} = this.props
    this.setState({
      redIconVisible: false
    })
    // const {page, block, rseat} = PingbackConfig[this.props.masterGardenMode].diaryButton
    // sendClickPingback(page, block, rseat)
    // sendBlockPingback(page, block)
    this.props.showConfirmModal({
      content: <DiaryModal flowerInfo={flowerInfo} wateringInfo={wateringInfo} currUserId={this.props.currUserId}/>
    });
  }
}

const styles = BaseStyleSheet.create({
  diaryBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  redIcon: {
    width: 10,
    height: 10,
    position: 'absolute',
    top: 0,
    right: 0
  },
  diaryIcon: {
    width: 40,
    height: 43
  },
})
