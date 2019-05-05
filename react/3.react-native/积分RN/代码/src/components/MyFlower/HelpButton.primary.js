/**
 * 帮助按钮
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Image} from '@iqiyi/rn-ui';

import FadeInBtn from '../FadeInBtn';
import HelpModalPrimary from './HelpModal.primary';
import HelpModalCash from './HelpModal.cash';

import {GARDEN_ENUM} from '../../constants/IntegralEnum';
import {sendClickPingback} from '../../common/pingback';

@connect(
  ({gardenDetail}) => {
    return {
      masterGardenMode: gardenDetail.masterGardenMode,
    }
  },
  null,
  null,
  {withRef: true},
)
export default class HelpButton extends PureComponent {
  render() {
    return (
      <FadeInBtn style={styles.container} onPress={this.showModal}>
        <Image source={{uri: 'integral_book_btn_v2'}} style={styles.helpIcon}/>
      </FadeInBtn>
    )
  }

  showModal = () => {
    sendClickPingback('flower_page', '', 'flower_rule');
    this.props.showConfirmModal({
      content: this.props.masterGardenMode === GARDEN_ENUM.MODE.Cash ? <HelpModalCash/> : <HelpModalPrimary/>,
    });
  };
}
const styles = BaseStyleSheet.create({
  container: {
    marginVertical: 7.5,
  },
  helpIcon: {
    width: 40,
    height: 43,
  },
});
