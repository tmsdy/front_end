/**
 * 回家按钮
 */
import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';

import WebImage from '../../WebImage';

import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';

@connect(
  (state, props) => {
    let {theme} = getUserGardenDetail(state, props);
    return {
      theme,
    };
  },
  null,
  null,
  {withRef: true},
)
export default class HomeBackButton extends PureComponent {
  render() {
    const {backHome} = this.props.theme
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.goHome} style={[styles.container, {bottom: backHome.bottom, width: backHome.width, height: backHome.height}]}>
        <WebImage name={backHome.name} style={{width: backHome.width, height: backHome.height}} />
      </TouchableOpacity>
    );
  }

  goHome = () => {
    this.props.back()
  };
}
const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    left: 30,
  },
});
