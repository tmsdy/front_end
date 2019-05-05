/**
预览效果
 */

import React from 'react'
import {TouchableOpacity} from 'react-native'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import WebImage from '../components/WebImage';
import NavBar from '../components/DefaultNavBar'
import {hideLoading, showToast} from '../common/QYNativeBridge'

import BasePage from '../components/BasePage'
import {setUserSelectPic} from '../actions/QuestionActions'

interface PreviewProps {
  selectImage: string;
}

@(connect(
  ({questionInfo}) => {
    const {selectImage} = questionInfo
    return {
      selectImage
    };
  },
  dispatch => bindActionCreators({
    setUserSelectPic
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class QuestionPreview extends BasePage<PreviewProps, {}> {

  public constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.props
    hideLoading()
    // askToUploadPic()
  }

  render() {
    const {selectImage} = this.props
    const text = this.props.navigation.state.params && this.props.navigation.state.params.inputText || ''
    return (
      <View style={styles.container}>
        <NavBar
          type="white"
          title="预览效果"
          titleColor="#ffffff"
          backgroundColor="#000000"
          backPress={this.back}
          rightViewWidth={90}
          renderRightView={() => this._renderRightView()}
          style={styles.navBar}
        />
        <View style={styles.picBox}>
          {!!selectImage && <WebImage uri={selectImage} style={styles.pic}/>}
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    )
  }

  _renderRightView = () => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.deletePic} style={styles.rightMenu}>
        <Text style={styles.rightMenuText}>删除背景</Text>
      </TouchableOpacity>
    )
  }

  deletePic = () => {
    this.props.setUserSelectPic('')
    showToast('背景已删除~')
    this.back()
  }

}

const styles = global.BaseStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picBox: {
    width: DEVICE_WIDTH - 40,
    height: (274 * (DEVICE_WIDTH - 40) / 670),
    justifyContent: 'center',
    paddingHorizontal: 14
  },
  pic: {
    width: DEVICE_WIDTH - 40,
    height: (274 * (DEVICE_WIDTH - 40) / 670),
    opacity: 0.5,
    position: 'absolute',
    top: 0
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: global.BaseStyleSheet.FontWeight.Medium
  },
  navBar: {
    position: 'absolute',
    top: 0
  },
  rightMenuText: {
    color: '#ffffff'
  }
});
