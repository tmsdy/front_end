/**
 * Created by liuzhimeng.
 * @date 2019-02-26
 * @description 夺宝按钮操作类
 */
import 'core-js/features/promise/finally'

import {NOOP, toNumber} from 'Common/utils'
import {isLogin} from 'Common/iqiyiPlugin'
import {askSubscribeSnatch, askUnsubscribeSnatch, participate} from '../apis'
import {getDetailUrl, getProdOptions} from './options'

const SnatchButton = (($) => {
  class SnatchButton {
    constructor(options = {}) {
      this.options = {
        USER_INFO: {
          totalScore: 0,
        },
        LIST_DATA: [],
        totalUserNum: null,
        orderedMaps: {}, // 是否已开启提醒
        clickback: NOOP, // 参与夺宝点击回调
        clickPingback: NOOP, // pingback回调
        subcribeBack: NOOP, // 预约提醒点击回调
        clickToAward: NOOP, // 查看奖品点击回调
        ...options,
      }
    }

    register = () => {
      const _this = this

      $('#listContainer').on('click', '[data-id="submit"]', function(e) {
        const {LIST_DATA, USER_INFO, clickback, clickPingback, clickToAward} = _this.options
        const $this = $(e.target)
        const thisAttr = $this.attr('data-id')

        if(thisAttr === 'submit' && !$this.attr('data-forbidden')) {
          const key = toNumber($this.closest('[data-id="listItem"]').attr('data-key'))
          const {
            _options: {
              period,
              buttonOptions: {
                type,
              },
            },
            code,
            price,
          } = LIST_DATA[key]

          clickPingback(LIST_DATA[key], key)

          // 已结束，跳转至详情页
          if(period === 'after' && type !== 'win') {
            location.href = getDetailUrl(code)
            return
          }

          isLogin(null, () => {
            // 已达上限
            if(type === 'onLimit') {
              $.fn.toast({content: '给别人留点夺宝机会吧'})
              return
            }

            // 开启 开始提醒
            if(type === 'notOrder') {
              askSubscribeSnatch([code])
                .then(({result}) => {
                  if(result) {
                    $.fn.toast({content: '预约成功，请注意打开APP提示', isMutex: true})
                    _this.updateOrderedMaps(code, true).updateList({}, key)
                    _this.options.subcribeBack('subcribe', $this)
                  }
                })
                .catch(() => {
                  $.fn.toast({content: '网络异常，稍后再试', isMutex: true})
                })
              return
            }

            // 取消预约提醒
            if(type === 'isOrdered') {
              askUnsubscribeSnatch([code])
                .then(({result}) => {
                  if(result) {
                    $.fn.toast({content: '已取消夺宝提醒', isMutex: true})
                    _this.updateOrderedMaps(code, false).updateList({}, key)
                    _this.options.subcribeBack('unsubcribe', $this)
                  }
                })
                .catch(() => {
                  $.fn.toast({content: '网络异常，稍后再试', isMutex: true})
                })
              return
            }

            // 跳转至夺宝成功列表
            if(type === 'win') {
              clickToAward(LIST_DATA[key], key)
              return
            }

            // 积分不足
            if(USER_INFO.totalScore < price) {
              $.fn.toast({content: `还差${price - USER_INFO.totalScore}积分，快去赚积分吧`})
              return
            }

            // 参与夺宝
            $this.attr('data-forbidden', 'true')
            participate(code)
              .then((data) => {
                const {totalParticipates, userParticipates, totalScore} = data

                $.fn.toast({content: '参与成功，在“我的夺宝记录”查看'})
                // 更新列表数据
                _this.updateList({current_num: totalParticipates, current_user_num: userParticipates}, key)
                // 更新用户数据
                _this.updateUserSocre({...USER_INFO, totalScore})
                // 更新用户总点击次数
                _this.updateTotalNum()
                // 按钮点击回调
                clickback({
                  ...data,
                  totalUserNum: _this.options.totalUserNum,
                }, key, $this)
              })
              .catch((err) => {
                const content = err && err.code ? err.message : '参与失败，请稍后重试'
                $.fn.toast({content})
              })
              .finally(() => {
                $this.removeAttr('data-forbidden')
              })
          })
        }
      })
    }

    getList() {
      return this.options.LIST_DATA
    }

    addList(list) {
      this.options.LIST_DATA = this.options.LIST_DATA.concat(list)
      return this
    }

    resetList() {
      this.options.LIST_DATA = []
      return this
    }

    updateOrderedMaps(code, value) {
      this.options.orderedMaps = {
        ...this.options.orderedMaps,
        [code]: value,
      }
      return this
    }

    updateList(item, key) {
      const {LIST_DATA, orderedMaps} = this.options
      const oldItem = LIST_DATA[key]
      let newItem = {
        ...oldItem,
        ...item,
      }

      newItem._options = {
        ...oldItem._options,
        ...getProdOptions(newItem, {isOrdered: !!orderedMaps[oldItem.code]}),
      }

      this.options.LIST_DATA[key] = newItem
      return this
    }

    updateUserSocre(USER_INFO) {
      this.options.USER_INFO = USER_INFO
      return this
    }

    updateTotalNum(num = null) {
      const {totalUserNum} = this.options
      if(num !== null) {
        this.options.totalUserNum = num
      } else if(totalUserNum !== null) {
        this.options.totalUserNum = totalUserNum + 1
      }
      return this
    }

    updateOrderedState(newOrderMaps) {
      const {orderedMaps} = this.options
      this.options.orderedMaps = {
        ...orderedMaps,
        ...newOrderMaps,
      }
    }
  }

  return SnatchButton
})(Zepto)

export default SnatchButton
