/**
 * Created by liuzhimeng.
 * @date 2018/10/26
 * @description 勋章详情弹窗
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableOpacity} from 'react-native'
import ScrollTabView, {ScrollableTabBar} from '@iqiyi/rn-scroll-tab-view-beta'
import Animation from '@iqiyi/rn-lottie'
import {Text, View} from '@iqiyi/rn-ui'
import {isIOS, Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import ConfirmModal from '../ConfirmModal'
import Medal, {MedalStar} from './Medal'
import WebImage from '../WebImage'
import {isURL} from '../../common/util'
import {TEXT_COLOR_DEFAULT, TEXT_COLOR_TIPS, TEXT_COLOR_TIPS_LIGHT} from '../../constants/baseStyles'
import PercentageCircle from '../PercentageCircle'
import CommonButton from '../CommonButton'
import {DAN_MU_URL, getCDNUrl, VIDEO_RECOMMEND_URL} from '../../constants/configs'
import {DETAIL_MODAL_BLOCK, getMedalPingbackById, GO_DANMU_HOME_CLICK, sendMainBlockPingback, sendMainClickPingback} from './pingback'

const CIRCLE_TYPE = isIOS ? 'custom' : 'pure'

const NATIVE_URL_MAP = {
  danmu: DAN_MU_URL,
  shipin: VIDEO_RECOMMEND_URL,
}

const BUTTON_STYLES = {
  width: 220,
  height: 40,
}

const MEDAL_CONTENT_CONTAINER = {
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 2,
  alignItems: 'center',
  width: 305,
  height: 60 + 110,
  paddingTop: 50,
}

const BG_TOP = {
  width: 78,
  height: 57,
  top: 0,
}

const BG_BOTTOM = {
  width: 82,
  height: 49,
  bottom: 0,
}

const getSource = level => getCDNUrl(`json/medal_show_v${level}.zip`)

export default class extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool,
    list: PropTypes.array,
    goTo: PropTypes.func,
  }

  static defaultProps = {
    modalVisible: false,
    list: [],
    goTo: () => null,
  }

  render() {
    return (
      <ConfirmModal modalVisible={this.props.modalVisible}>
        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.modalClose} activeOpacity={1} onPress={this.props.onClose}>
            <WebImage style={styles.modalCloseIcon} name="integralmedal/modal_close"/>
          </TouchableOpacity>
          <View>
            {this.props.list.length === 1
              ? <DetailBody item={this.props.list[0]} style={styles.simpleLayout}/>
              : (
                <ScrollTabView
                  scrollWithoutAnimation={true}
                  tabBarPosition="bottom"
                  initialPage={this.props.initialPage}
                  renderTabBar={() => this._renderTabBar()}
                  onChangeTab={({i}) => this.onChangeTab(i)}
                >
                  {this.props.list.map(item => (
                    <DetailBody key={item.id} item={item} onButtonPress={() => this.onButtonPress(item)}/>
                  ))}
                </ScrollTabView>
              )}
          </View>
        </View>
      </ConfirmModal>
    )
  }

  _renderTabBar() {
    return (
      <ScrollableTabBar
        style={styles.menuTab}
        tabsContainerStyle={styles.menuContainer}
        underlineStyle={styles.tabUnderline}
        underlineWidth={20}
        renderTab={(...args) => this._renderScrollableTab(...args)}
      />
    )
  }

  _renderScrollableTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={`_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
      >
        <View style={styles.menuTabItem}>
          <Medal size={50} url={this.props.list[page].url}/>
        </View>
      </TouchableOpacity>
    )
  }

  onChangeTab(currentPage) {
    const {id} = this.props.list[currentPage]
    sendMainBlockPingback(DETAIL_MODAL_BLOCK, {
      rseat: getMedalPingbackById(id, 'detail'),
    })
  }

  onButtonPress(i) {
    this.props.onClose()
    if(isURL(i.bottomUrl)) {
      this.props.openWeb(i.bottomUrl)
    } else if(i.extMaps) { // native跳转
      sendMainClickPingback(DETAIL_MODAL_BLOCK, GO_DANMU_HOME_CLICK)
      const source = i.extMaps.medalSource
      // console.log(source, NATIVE_URL_MAP[source])
      if(NATIVE_URL_MAP[source]) {
        this.props.openWeb(NATIVE_URL_MAP[source])
      }
      if(source === 'dianshang') {
        this.props.goTo('ShoppingMall')
      }
    }
  }
}

const DetailBody = ({item, onButtonPress, style}) => (
  <View style={StyleSheet.flatten([styles.medalLayout, style])}>
    <View style={styles.medalContainer}>
      {(item.userStatus === 0 && item.star > 1) && (
        <View style={styles.animationWrapper}>
          <Animation
            style={styles.animation}
            ref={el => !!el && el.play()}
            url={getSource(item.star)}
            loop={false}
          />
        </View>
      )}
      <Medal url={item.url} size={120} containerStyle={MEDAL_CONTENT_CONTAINER}/>
      <View style={styles.medalWrapper}>
        <WebImage style={[styles.modalBg, BG_TOP]} name="integralmedal/pop_bg1"/>
        <WebImage style={[styles.modalBg, BG_BOTTOM]} name="integralmedal/pop_bg2"/>
        {item.showSimpleConent
          ? <SimpleContent detail={item}/>
          : <CommonContent detail={item}/>
        }
        <View style={styles.medalBottomWrapper}>
          {item.bottomType === 'button' && (
            <CommonButton
              mode="gradient"
              text={item.bottomText}
              onPress={onButtonPress}
              containerStyle={BUTTON_STYLES}
            />
          )}
          {item.bottomType === 'text' && <Text style={styles.bottomText}>{item.bottomText}</Text>}
        </View>
      </View>
    </View>
  </View>
)

const SimpleContent = ({detail: {title, extMaps, description}}) => (
  <View>
    <Text style={styles.title}>{title}</Text>
    <Text
      style={[styles.content, {
        textAlign: 'center',
        color: TEXT_COLOR_DEFAULT,
      }]}
    >
      {extMaps.interestDescription}
    </Text>
    <View style={styles.mainContentWrapper}>
      <Text style={styles.content}>{description}</Text>
    </View>
  </View>
)
SimpleContent.propTypes = {
  detail: PropTypes.object,
}
SimpleContent.defaultProps = {
  detail: {
    title: '',
    description: '',
    extMaps: {
      interestDescription: '',
    },
  },
}

const CommonContent = ({detail}) => (
  <View>
    <View style={styles.starWrapper}>
      <MedalStar star={detail.star} size={12} spacing={4}/>
    </View>
    <Text style={styles.title}>{detail.title}</Text>
    <View style={styles.contentWrapper}>
      <View style={styles.contentInnerWrapper}>
        {detail.content.map(i => <Text key={i} style={styles.content}>{i}</Text>)}
      </View>
    </View>
    <View style={[styles.mainContentWrapper, {height: 96 + 15}]}>
      {detail.percentageList.map(i => (
        <View key={i.id} style={styles.percentageItem}>
          <PercentageCircle type={CIRCLE_TYPE} percent={i.percent} color="#9cff9f">
            <Text style={styles.percentageText}>{i.text}</Text>
          </PercentageCircle>
          <Text style={styles.percentageLabel}>{i.title}</Text>
        </View>
      ))}
    </View>
  </View>
)
CommonContent.propTypes = {
  detail: PropTypes.object,
}
CommonContent.defaultProps = {
  detail: {
    content: [],
    percentageList: [],
  },
}

// const TAB_WIDTH = (DEVICE_WIDTH - 180) / 3
const TAB_WIDTH = 62
const TAB_HEIGHT = 103
const CONTENT_WIDTH = 305
const INNER_CONTENT_WIDTH = 305 - (20 * 2)

const styles = StyleSheet.create({
  modalClose: {
    position: 'absolute',
    top: 65,
    right: 33,
    zIndex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  modalCloseIcon: {
    width: 44,
    height: 44,
  },
  menuTab: {
    height: TAB_HEIGHT,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    justifyContent: 'center',
  },
  tabUnderline: {
    top: 55,
    width: 20,
    height: 5,
    marginBottom: 8,
    marginLeft: (TAB_WIDTH - 20) / 2,
    borderRadius: 8.5,
    backgroundColor: '#ffffff',
  },

  animationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  animation: {
    width: CONTENT_WIDTH,
    height: 110,
  },

  // 菜单子项
  menuTabItem: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: TAB_WIDTH,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent',
  },

  simpleLayout: {
    width: DEVICE_WIDTH,
    justifyContent: 'center',
    paddingBottom: 0,
  },
  medalLayout: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 28,
  },
  medalContainer: {
    alignItems: 'center',
    width: CONTENT_WIDTH,
    paddingTop: 60 + 50,
  },
  medalWrapper: {
    zIndex: 0,
    alignItems: 'center',
    width: CONTENT_WIDTH,
    // height: 380,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
  },
  modalBg: {
    position: 'absolute',
    right: 0,
    zIndex: 0,
  },
  title: {
    lineHeight: 25,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR_DEFAULT,
    fontFamily: 'PingFangSC-Semibold',
  },
  content: {
    lineHeight: 20,
    textAlign: 'left',
    fontSize: 14,
    color: TEXT_COLOR_TIPS,
  },
  starWrapper: {
    alignItems: 'center',
    marginTop: 7.5,
    marginBottom: 15,
  },
  contentWrapper: {
    alignItems: 'center',
  },
  contentInnerWrapper: {
    minHeight: 46,
  },
  mainContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: INNER_CONTENT_WIDTH,
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#eeeeee',
  },
  percentageItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageLabel: {
    width: '100%',
    lineHeight: 16,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: TEXT_COLOR_TIPS,
    fontFamily: 'PingFangSC-Regular',
  },
  percentageText: {
    lineHeight: 21,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXT_COLOR_TIPS,
  },
  medalBottomWrapper: {
    alignItems: 'center',
    width: CONTENT_WIDTH,
  },
  bottomText: {
    lineHeight: 12,
    paddingVertical: 15,
    textAlign: 'center',
    fontSize: 12,
    color: TEXT_COLOR_TIPS_LIGHT,
  },
})
