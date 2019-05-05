/**
 * 帮助弹框
 * Created by xushichao on 2018-12-12.
 */
import React, {PureComponent} from 'react';
import {
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';

import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import WebImage from '../../WebImage';

const IMG_WIDTH = 303;
const IMG_HEIGHT = 183;

@connect(
  (state, props) => {
    let {theme, masterUserId} = getUserGardenDetail(state, props);
    return {
      theme,
      masterUserId,
    };
  },
  null,
)
export default class NewGuideModal extends PureComponent {
  render() {
    let {gardenHeight, theme} = this.props,
      topOffset = theme.kettle.kettleOriginCenterBottom - theme.kettle.innerRotationBoxSize / 2 + IMG_HEIGHT - 3,
      {rightOffset} = theme.newGuide;
    return (
      <TouchableOpacity activeOpacity={1} style={[styles.picBox, {top: gardenHeight - topOffset, right: rightOffset}]} onPress={this._press}>
        <WebImage name={theme.newGuide.name} style={styles.modalPic}/>
      </TouchableOpacity>
    );
  }

  _press = () => {
    // 登录用户在新手引导之后展示新玩法引导，未登录的则不展示新玩法引导
    if(this.props.masterUserId) {
      this.props.hide().then(this.props.showNewPlayGuide)
    } else {
      this.props.hide()
    }
  }
}

const styles = BaseStyleSheet.create({
  modalPic: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
  },
  picBox: {
    position: 'absolute',
  }
});

