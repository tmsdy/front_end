/**
 * Created by liuzhimeng.
 * @date 2018/9/14
 * @description
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
} from 'react-native'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import {
  Width,
  isAndroid,
} from '@iqiyi/rn-utils'
import WebImage from '../../../components/WebImage'
import {
  BG_COLOR_BLUE,
  BG_COLOR_PINK,
  BG_COLOR_DISABLED,
} from '../constants'

const DEVICE_WIDTH = Width
// 图表宽度
const CHART_WIDTH = DEVICE_WIDTH - 50
// 图表高度
const CHART_HEIGHT = 35
// 斜线阴影宽度
const SLASH = 15
const HALF_SLASH = SLASH / 2
const SLASH_WIDTH = 18
// 图表间隙宽度
const SPACE = 3
// 图表倾斜角度值
const SKEW_DEG_ANGLE = 90 - Math.atan(CHART_HEIGHT / SLASH) * 180 / Math.PI
const SKEW_ANGLE = `-${SKEW_DEG_ANGLE}deg`

const CHART_MIN_WIDTH = 0.3 * (CHART_WIDTH - SPACE) + HALF_SLASH
const CHART_MAX_WIDTH = 0.7 * (CHART_WIDTH - SPACE) + HALF_SLASH

const getSlashName = (lists) => {
  if(lists.length >= 2) {
    const leftDisabled = lists[0].disabled
    const rightDisabled = lists[1].disabled
    if(leftDisabled && !rightDisabled) {
      return 'topicpk/grey-red'
    }
    if(!leftDisabled && rightDisabled) {
      return 'topicpk/blue-grey'
    }
    if(!leftDisabled && !rightDisabled) {
      return 'topicpk/blue-red'
    }
    return null
  }
  return null
}

const getChartWidth = (current, total) => current / total * (CHART_WIDTH - SPACE) + HALF_SLASH

export default class ChartView extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.lists.map(i =>
          (
            <SingleChartView
              key={i.id}
              mode={i.mode}
              disabled={i.disabled}
              status={i.status}
              title={i.title}
              desc={i.desc}
              current={i.current}
              total={i.total}
              style={styles.singleChart}
            />
          ))}
        {this._hackSlashForAndroid()}
      </View>
    )
  }

  _hackSlashForAndroid() {
    if(!isAndroid) return null

    const {lists} = this.props
    if(lists.length) {
      const {current} = lists[0]
      const {total} = lists[0]
      let chartWidth = getChartWidth(current, total)
      if(chartWidth < CHART_MIN_WIDTH) chartWidth = CHART_MIN_WIDTH
      if(chartWidth > CHART_MAX_WIDTH) chartWidth = CHART_MAX_WIDTH
      const left = chartWidth - SLASH_WIDTH + SPACE
      const slashName = getSlashName(lists)
      if(slashName) {
        return <WebImage style={[styles.slash, {left}]} name={slashName}/>
      }
      return null
    }
    return null
  }
}

ChartView.propTypes = {
  lists: PropTypes.array,
}

ChartView.defaultProps = {
  lists: [],
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    backgroundColor: 'transparent',
  },
  singleChart: {
    position: 'relative',
    zIndex: 0,
  },
  slash: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: SLASH_WIDTH,
    height: 55,
  },
})

const ICON_MAP = {
  success: 'topicpk/pk-victory',
  fail: 'topicpk/pk-fail',
}

const getChartState = ({mode, disabled, status}) => {
  let state = {
    left: 0,
    translateX: -HALF_SLASH,
    bgStyles: {},
    textStyles: {},
    iconName: '',
    iconStyles: {},
  }

  if(status) {
    const position = mode === 'right' ? 'left' : 'right'
    state.iconStyles[position] = 20
    state.iconName = ICON_MAP[status]
  }

  if(!disabled) {
    state.bgStyles.backgroundColor = mode === 'right' ? BG_COLOR_PINK : BG_COLOR_BLUE
  }

  if(mode === 'right') {
    state.left = -(SLASH - SPACE)
    state.translateX = HALF_SLASH
    state.textStyles = {
      alignItems: 'flex-end'
    }

    return state
  }

  return state
}

const SingleChartView = (props) => {
  const {
    title,
    total,
    current,
  } = props
  const width = getChartWidth(current, total)
  const {left, translateX, bgStyles, textStyles} = getChartState(props)

  return (
    <View style={StyleSheet.flatten([singleStyles.container, {width, left}])}>
      <View style={[singleStyles.background, bgStyles, {transform: [{skewX: SKEW_ANGLE}, {translateX}, {perspective: 1000}]}]}/>
      <View style={singleStyles.wrapper}>
        <View style={textStyles}>
          {/* {!!current && <Text style={singleStyles.descStyle}>{current}<Text style={{fontSize: 16}}>票</Text></Text>} */}
          {!!title && <Text style={singleStyles.titleStyle}>{title}</Text>}
        </View>
        {/* {!!iconName && <WebImage name={iconName} style={StyleSheet.flatten([singleStyles.icon, iconStyles])}/>} */}
      </View>
    </View>
  )
}

SingleChartView.propTypes = {
  total: PropTypes.number,
  current: PropTypes.number,
}

SingleChartView.defaultProps = {
  total: 0,
  current: 0,
}

const singleStyles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 0,
    height: CHART_HEIGHT,
    minWidth: CHART_MIN_WIDTH,
    maxWidth: CHART_MAX_WIDTH,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: CHART_HEIGHT,
    backgroundColor: BG_COLOR_DISABLED,
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 0,
    paddingHorizontal: 10,
    paddingVertical: 7.5,
  },
  titleStyle: {
    height: 20,
    lineHeight: 23,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  descStyle: {
    // height: 20,
    lineHeight: 25.5,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  icon: {
    position: 'absolute',
    zIndex: 1,
    top: CHART_HEIGHT / 2 - 18.5,
    width: 37,
    height: 37,
  }
})
