/**
 * 获得最新勋章提示
 *  */
/**
 * Created by liuzhimeng.
 * @date 2018/10/15
 * @description 积分勋章重构优化版
 */
import React, {PureComponent} from 'react'
import NewMedalModal from '../../components/integralMedalv2/NewMedalModal'
import {getMedalList, getMedalReward} from '../../model/integralMedalv2'

export default class extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      newMedalVisible: false,
      newMedalTitle: '',
      level: 0,
    };
  }


  componentDidMount() {
    this._getMedalList()
  }

  render() {
    return (
      <NewMedalModal
        ref={(child) => {
          this.newMedalModalRef = child
        }}
        modalVisible={this.state.newMedalVisible}
        title={this.state.newMedalTitle}
        level={this.state.level}
        onClose={() => this.onNewMedalClose()}
      />
    )
  }

  // 获取用户勋章列表
  _getMedalList() {
    return getMedalList('oneself', global.USER_INFO.userId, {filterChannel: 'wenda_'})
      .then(({
               newMedalList,
             }) => {

        // 显示新勋章
        if(newMedalList.length) {
          // 领取勋章奖励
          const ids = newMedalList.reduce((total, current) => `${total},${current.id}`, '')
            .slice(1)
          getMedalReward(ids)
            .catch((err) => {
              throw err
            })
          // console.log('init', newMedalList)
          const newMedal = newMedalList.shift()
          this.setState({
            newMedalVisible: true,
            newMedalTitle: `获得${newMedal.title}勋章`,
            level: newMedal.star,
          }, () => {
            !!this.newMedalModalRef && this.newMedalModalRef.play()
          })
          this.newMedalList = newMedalList
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onNewMedalClose() {
    this.setState({newMedalVisible: false}, () => {
      // 如果还有新勋章，则继续弹窗提示
      if(this.newMedalList.length) {
        const newMedal = this.newMedalList.shift()
        requestAnimationFrame(() => {
          this.setState({
            newMedalVisible: true,
            newMedalTitle: `获得${newMedal.title}勋章`,
            level: newMedal.star,
          }, () => {
            !!this.newMedalModalRef && this.newMedalModalRef.play()
          })
        })
      }
    })

  }
}
