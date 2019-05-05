/**
 * Created by liuzhimeng.
 * @date 2019-03-13
 * @description 抽奖弹窗
 */

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import {View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import ReduxUtil from '../../../common/ReduxUtil'
import {DRAW_ENUM, GARDEN_ENUM} from '../../../constants/IntegralEnum'

import WebImage from '../../WebImage'
import AnimTitle from './AnimTitle'
import AnimMarquee from './AnimMarquee'
import AnimButton from './AnimButton'
import AnimNumberGroup from './AnimNumberGroup'
import AnimFlower from './AnimFlower'
import AnimRocker from './AnimRocker'
import AnimGlow from './AnimGlow'

import {sendBlockPingback, sendClickPingback} from '../../../common/pingback'
import PingbackConfig from '../../../common/PingbackConfig'

const TIME = 3.5
const LAST_NUMBER_DELAY = 1.6

@connect(({gardenDetail: {masterGardenInfo}}) => {
  const {drawInfo} = masterGardenInfo
  const drawResult = drawInfo && drawInfo.lottery ? drawInfo.lottery : {type: 0, amount: 0}

  return {
    drawResult,
  }
}, null, null, {withRef: true})
export default class DrawBody extends PureComponent {
  static defaultProps = {
    gardenMode: GARDEN_ENUM.MODE.Primary,
    autoPlay: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      period: DRAW_ENUM.PERIOD.Before,
    }

    this.ANIM_NUMBER_LIST = this._getNumberList()
    this.TYPE_MAP = [DRAW_ENUM.MODE.Score, DRAW_ENUM.MODE.Vip]

    this.refAnimTitle = ReduxUtil.createRef()
    this.refAnimNumberGroup = ReduxUtil.createRef()
    this.refAnimRocker = ReduxUtil.createRef()
    this.refAnimFlower = ReduxUtil.createRef()
    this.refAnimButton = ReduxUtil.createRef()
    this.refAnimGlow = ReduxUtil.createRef()
  }

  componentDidMount() {
    const {drawResult: {type}} = this.props
    if(this.TYPE_MAP[type] === DRAW_ENUM.MODE.Score) {
      sendBlockPingback(PingbackConfig[this.props.gardenMode].page, 'gift_pop')
    } else if(this.TYPE_MAP[type] === DRAW_ENUM.MODE.Vip) {
      sendBlockPingback(PingbackConfig[this.props.gardenMode].page, 'vip_pop')
    }

    if(this.props.autoPlay) {
      setTimeout(() => {
        this.play()
      }, 300)
    }
  }

  render() {
    const mode = this.TYPE_MAP[this.props.drawResult.type]

    return (
      <View style={styles.container}>
        <AnimGlow ref={this.refAnimGlow}/>
        <View style={styles.machineLayout}>
          <View style={styles.machineWapper}>
            {/* 标题 */}
            <AnimTitle ref={this.refAnimTitle} mode={mode} count={this.props.drawResult.amount} />
            {/* 数字 */}
            <AnimNumberGroup ref={this.refAnimNumberGroup} list={this.ANIM_NUMBER_LIST} />
            {/* 主体 */}
            <WebImage style={styles.machineBody} name="flower/machine-body">
              {/* 跑马灯 */}
              <AnimMarquee period={this.state.period} />
              {/* 按钮 */}
              <AnimButton
                ref={this.refAnimButton}
                mode={mode}
                drawResult={this.props.drawResult}
                time={TIME + LAST_NUMBER_DELAY}
                onBeginning={this.props.onBeginning}
                onBeforePingback={this.onBeforePingback}
                updatePeriod={this.updatePeriod}
                getReward={this._getReward}
              />
            </WebImage>
          </View>
          {/* 摇杆 */}
          <AnimRocker ref={this.refAnimRocker} />
        </View>
        {/* 中奖鲜花效果 */}
        <AnimFlower ref={this.refAnimFlower}/>
      </View>
    )
  }

  // 点击抽奖pingback
  onBeforePingback = () => {
    const {drawResult: {type}} = this.props
    if(this.TYPE_MAP[type] === DRAW_ENUM.MODE.Score) {
      sendClickPingback(PingbackConfig[this.props.gardenMode].page, 'gift_pop', 'draw_btn')
    } else if(this.TYPE_MAP[type] === DRAW_ENUM.MODE.Vip) {
      sendClickPingback(PingbackConfig[this.props.gardenMode].page, 'vip_pop', 'vip_btn')
    }
  }

  // 执行抽奖动画
  play = () => {
    this.refAnimButton.getInstance().then(ref => ref.play())
  }

  // 播放标题动画
  titlePlay = () => {
    this.refAnimTitle.getInstance().then(ref => ref.play())
  }

  // 播放摇杆动画
  rockerPlay = () => {
    this.refAnimRocker.getInstance().then(ref => ref.play())
  }

  // 播放数字动画
  numberGroupPlay = () => {
    this.refAnimNumberGroup.getInstance().then(ref => ref.play())
  }

  // 抽奖结束成功动画
  afterPlay = () => {
    // 播放鲜花动画
    this.refAnimFlower.getInstance().then(ref => ref.play())
    // 播放光晕动效
    this.refAnimGlow.getInstance().then(ref => ref.play())
  }

  updatePeriod = async (period) => {
    this.setState({period})
    // 点击抽奖
    if(period === DRAW_ENUM.PERIOD.Before) {
      // 播放摇杆动画
      this.rockerPlay()
    }
    // 自动播放数字转动动画
    if(period === DRAW_ENUM.PERIOD.In) {
      this.numberGroupPlay()
    }
    // 自动播放数字转动动画
    if(period === DRAW_ENUM.PERIOD.After) {
      sendBlockPingback(PingbackConfig[this.props.gardenMode].page, 'gift_success')
      this.titlePlay()
      this.afterPlay()
    }
  }

  _getReward = (mode) => {
    this.props.hideConfirmModal().then(() => {
      this.props.getReward(mode, this.props.drawResult)
    })
  }

  _getNumberList = () => {
    const {drawResult} = this.props
    const list = [
      {id: 'id1', result: 0, delay: 0, time: TIME},
      {id: 'id2', result: 0, delay: LAST_NUMBER_DELAY / 2, time: TIME},
      {id: 'id3', result: 0, delay: LAST_NUMBER_DELAY, time: TIME},
    ]

    if(drawResult) {
      const {amount} = drawResult
      const thousand = Math.floor(amount / 1000)
      const hundred = Math.floor((amount - thousand * 1000) / 100)
      const ten = Math.floor((amount - thousand * 1000 - hundred * 100) / 10)
      const unit = Math.floor(amount - thousand * 1000 - hundred * 100 - ten * 10)

      list[0].result = hundred
      list[1].result = ten
      list[2].result = unit
    }

    return list
  }
}

const styles = BaseStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 290,
  },
  machineLayout: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 255 + 40,
    height: 260,
    paddingRight: 15,
  },
  machineWapper: {
    width: 255,
    height: 260,
  },
  machineBody: {
    width: 255,
    height: 260,
  },
})
