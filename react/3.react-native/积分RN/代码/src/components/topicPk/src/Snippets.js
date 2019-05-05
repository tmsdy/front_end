/**
 * Created by liuzhimeng.
 * @date 2018/9/28
 * @description
 */

import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import {ScrollableTabBar} from '@iqiyi/rn-scroll-tab-view-beta'
import WebImage from '../../WebImage'
import {BORDER_COLOR_PRIMARY, TEXT_COLOR_DEFAULT, TEXT_COLOR_PRIMARY} from '../constants'

export const SectionHeader = ({id, title, iconName}) => id !== 'in'
 && <TopicSquareTitle title={title} iconName={iconName}/>

export const TopicListTop = () => (
  <View style={styles.listTop}>
    <View style={styles.listTopInner}>
      <WebImage style={[styles.listTopIcon, styles.topIconLeft]} name="topicpk/pk-rope"/>
      <WebImage style={[styles.listTopIcon, styles.topIconRight]} name="topicpk/pk-rope"/>
      <View style={styles.listTopTitleWrapper}>
        <Text style={styles.listTopTitle}>得票更多的一方获胜</Text>
      </View>
    </View>
  </View>
)

export const TopicSquareTitle = ({title, iconName}) => (
  <View style={styles.sectionTitle}>
    <View style={styles.titleWrapper}>
      <WebImage style={styles.titleIcon} name={iconName}/>
      <Text style={styles.title}>{title}</Text>
    </View>
  </View>
)

TopicSquareTitle.propTypes = {
  title: PropTypes.string,
  iconName: PropTypes.string,
}

TopicSquareTitle.defaultProps = {
  title: '',
  iconName: '',
}

export const TopicScrollableTabBar = ({dotPage, showDot, ...args}) => (
  <ScrollableTabBar
    style={styles.menuTab}
    tabsContainerStyle={styles.menuContainer}
    underlineStyle={styles.tabUnderline}
    underlineWidth={12}
    renderTab={(...params) => renderScrollableTab(...params, dotPage, showDot)}
    {...args}
  />
)

TopicScrollableTabBar.propTypes = {
  tabs: PropTypes.array,
  dotPage: PropTypes.number,
  showDot: PropTypes.bool,
}

TopicScrollableTabBar.defaultProps = {
  tabs: [],
  dotPage: -1,
  showDot: true,
}

const renderScrollableTab = (name, page, isTabActive, onPressHandler, onLayoutHandler, dotPage, showDot) => {
  const color = isTabActive ? TEXT_COLOR_PRIMARY : TEXT_COLOR_DEFAULT
  const fontWeight = isTabActive ? 'bold' : 'normal'

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
      <View style={[styles.tab, styles.menuTabItem]}>
        <View style={styles.tabTextWrapper}>
          <Text style={{fontSize: 16, color, fontWeight}}>{name}</Text>
          {showDot && dotPage === page &&
          <View style={styles.redDot}/>}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const TAB_WIDTH = (Width - 34 * 2) / 2
const DOT_SIZE = 8

const styles = StyleSheet.create({
  // 话题PK顶部菜单
  menuTab: {
    height: 45,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: .5,
    borderColor: '#eeeeee',
    backgroundColor: '#ffffff',
    marginBottom: 15
  },
  menuContainer: {
    justifyContent: 'center',
  },
  tabUnderline: {
    width: 12,
    height: 3,
    marginBottom: 8,
    marginLeft: (TAB_WIDTH - 12) / 2,
    borderRadius: 8.5,
    backgroundColor: BORDER_COLOR_PRIMARY,
  },

  // 菜单子项
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 49,
    paddingLeft: 20,
    paddingRight: 20,
  },
  tabTextWrapper: {
    position: 'relative',
  },
  menuTabItem: {
    alignItems: 'center',
    height: 45,
    width: TAB_WIDTH,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#ffffff',
  },
  redDot: {
    position: 'absolute',
    top: -DOT_SIZE / 2 + 2,
    right: -DOT_SIZE - 1,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'rgba(255, 59, 48, 1)',
    shadowColor: '#FF3B30',
    shadowOpacity: .3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  // 顶部提示语
  listTop: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 9,
  },
  listTopInner: {
    position: 'relative',
    top: 0,
    paddingTop: 10,
    borderRadius: 3,
  },
  listTopIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    height: 20,
    width: 4,
  },
  topIconLeft: {
    left: 9,
  },
  topIconRight: {
    right: 9,
  },
  listTopTitleWrapper: {
    position: 'relative',
    zIndex: 0,
    paddingHorizontal: 14,
    borderRadius: 3,
    backgroundColor: '#FF8E8E',
    overflow: 'hidden',
  },
  listTopTitle: {
    height: 32,
    lineHeight: 32,
    textAlign: 'center',
    borderRadius: 3,
    fontSize: 14,
    color: '#ffffff',
  },

  // 标题
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
  },
  titleWrapper: {
    position: 'relative',
  },
  titleIcon: {
    position: 'absolute',
    width: 18,
    height: 18,
    top: 7,
    left: -7,
  },
  title: {
    lineHeight: 42,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR_DEFAULT,
  }
})
