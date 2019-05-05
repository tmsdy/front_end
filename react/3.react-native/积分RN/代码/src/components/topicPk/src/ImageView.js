/**
 * Created by liuzhimeng.
 * @date 2018/9/14
 * @description
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableHighlight} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import LinearGradient from '@iqiyi/rn-gradient-view'
import WebImage from '../../WebImage'
import {BG_COLOR_BLUE} from '../constants'
import {TOUCH_COLORFUL_MASK} from '../../../constants/touchableStyle'
import {showToast} from '../../../common/QYNativeBridge';

const DEVICE_WIDTH = Width
const IMAGE_WIDTH = (DEVICE_WIDTH - 55) / 2
const IMAGE_HEIGHT = IMAGE_WIDTH * 140 / 160
const CONTAINER_WIDTH = IMAGE_WIDTH * 2 + 5

export default class ImageView extends Component {
  render() {
    const {
      lists,
      disabled,
      containerStyles,
      userVoteNumber,
      showAllNum
    } = this.props
    return (
      <View style={StyleSheet.flatten([styles.container, containerStyles])}>
        <View style={styles.imageWrapper}>
          {lists.map((i, k) => {
              return (
              <SingleImageView
                key={i.id}
                style={styles.singleImage}
                title={i.title}
                imgUrl={i.imgUrl}
                desc={i.desc}
                mainColor={i.mainColor}
                disalbed={disabled || i.disalbed}
                onPress={() => this._onPress(i, k)}
                alreadyVote={this.alreadyVote}
                optionCode={i.option.option_code}
                userOptionCode={i.userOptionCode}
                userVoteNumber={userVoteNumber}
                voteNumber={i.option.vote_number}
                showAllNum={showAllNum}
              />
              )
            })}
          <View style={styles.pkIconWrapper}>
            <WebImage name="topicpk/pk-vs" style={styles.pkIcon}/>
          </View>
        </View>
      </View>
    )
  }
  // 已经投过一方，点击另外一方提示
  alreadyVote = (userOptionCode, optionCode) => {
    if(userOptionCode && userOptionCode !== optionCode) {
      showToast('不可以三心二意噢～')
    }
  }
  _onPress(i, k) {
    this.props.onPress(i, k)
  }
}

ImageView.propTypes = {
  containerStyles: PropTypes.object,
  lists: PropTypes.array,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
}

ImageView.defaultProps = {
  containerStyles: {},
  lists: [],
  disabled: false,
  onPress: () => null,
}

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    width: CONTAINER_WIDTH,
  },
  singleImage: {
    position: 'relative',
    zIndex: 0,
  },
  pkIconWrapper: {
    position: 'absolute',
    left: CONTAINER_WIDTH / 2 - 22,
    top: IMAGE_HEIGHT / 2 - 22,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  pkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
})

const SingleImageView = (props) => {
  const {
    title,
    imgUrl,
    desc,
    mainColor,
    disalbed,
    onPress,
    userOptionCode,
    alreadyVote,
    optionCode,
    userVoteNumber,
    voteNumber,
    showAllNum
  } = props
  // 未开始或者未选择，才置灰
  const buttonDisable = disalbed || (userOptionCode && userOptionCode !== optionCode)
  const showVoteNumber = userOptionCode === optionCode && !!userVoteNumber
  const voteNum = showAllNum ? voteNumber : desc
  return (
    <View style={[singleStyles.container, {height: IMAGE_HEIGHT + 29}]}>
      <WebImage name={imgUrl} style={singleStyles.imageView}>
        <LinearGradient colors={['rgba(152, 152, 152, .02)', 'rgba(0, 0, 0, .5)']} style={singleStyles.imageGradient}/>
        <View style={[singleStyles.imageTextWrapper, {paddingBottom: 21}]}>
          {!!voteNum && <Text style={singleStyles.imageDesc}>{voteNum}</Text>}
        </View>
      </WebImage>
      <TouchableHighlight
        {...TOUCH_COLORFUL_MASK}
        onPress={buttonDisable ? () => { alreadyVote(userOptionCode, optionCode) } : onPress}
        style={[singleStyles.buttonWrapper, {shadowColor: buttonDisable ? 'transparent' : mainColor}]}
      >
        <View style={[singleStyles.buttonInner, {backgroundColor: buttonDisable ? '#D8D8D8' : mainColor}]}>
          <Text style={[singleStyles.buttonText]}>{title}</Text>
          {
            showVoteNumber && <Text style={singleStyles.showVoteNumber}>已投{userVoteNumber}票</Text>
          }
        </View>
      </TouchableHighlight>
    </View>
  )
}

SingleImageView.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  buttonText: PropTypes.string,
  imgUrl: PropTypes.string,
  mainColor: PropTypes.string,
  disalbed: PropTypes.bool,
  onPress: PropTypes.func,
}

SingleImageView.defaultProps = {
  title: '标题',
  desc: '副标题',
  buttonText: '支持',
  imgUrl: '',
  mainColor: BG_COLOR_BLUE,
  disalbed: false,
  onPress: () => null,
}

const singleStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignItems: 'center'
  },
  buttonWrapper: {
    position: 'absolute',
    top: IMAGE_HEIGHT - 16,
    zIndex: 2,
    borderRadius: 50,
    shadowOpacity: .3,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  buttonInner: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    width: 110
  },
  showVoteNumber: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
    lineHeight: 16
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22
  },
  imageView: {
    position: 'relative',
    zIndex: 1,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 5,
    overflow: 'hidden',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: IMAGE_WIDTH,
    height: 85,
    opacity: .45,
    borderRadius: 5,
  },
  imageTextWrapper: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
    width: IMAGE_WIDTH,
    backgroundColor: 'transparent',
  },
  imageTitle: {
    height: 20,
    lineHeight: 14,
    paddingVertical: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, .3)',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  imageDesc: {
    height: 16,
    lineHeight: 10,
    paddingVertical: 4,
    fontFamily: 'DIN Alternate',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, .3)',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0,
      height: 0,
    },
  },
})
