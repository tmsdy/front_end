/**
 * 奇妙花园上线之后， 此页面废弃
 *
 * @deprecated
 */

import {isIOS} from '@iqiyi/rn-utils'
import {executeTask} from '../api/index'
import {GET_ENV} from '../constants/configs'
import {filterArray, compare} from '../common/util'

export function getTotalData() {
  const requestHeader = {
    task_code: 'page_integral_park',
    timestamp: Date.now(),
  }
  const requestBody = {
    daojuProductList: {
      vertical_code: 'iQIYI',
      partner_code: GET_ENV() === 'test' ? 'Iva3o2QhXCqSXEbV' : 'uTHySO675COlmuHx',
      platform: isIOS ? '2_22_221' : '2_22_222',
      version: global.COMMON_PARAMS.version,
      need_ext: true,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then((result) => {
      const {qipuData, daojuData} = result
      const resultData = []
      if(qipuData) {
        const banner = (qipuData[0] && qipuData[0].elements_summary) || []
        const gamesOne = (qipuData[4] && qipuData[4].elements_summary) || []
        const gamesSecond = (qipuData[5] && qipuData[5].elements_summary) || []
        const gamesThird = (qipuData[6] && qipuData[6].elements_summary) || []
        const mallAdv = (qipuData[7] && qipuData[7].elements_summary) || null
        gamesOne.sort(compare('order'))
          .reverse()
        gamesSecond.sort(compare('order'))
          .reverse()
        gamesThird.sort(compare('order'))
          .reverse()
        banner.sort(compare('order'))
          .reverse()
        const games = [gamesOne, gamesSecond, gamesThird]
        // 运营广告
        const adv = (qipuData[2] && qipuData[2].elements_summary && qipuData[2].elements_summary[0]) || null
        const legaoMessage = (qipuData[3] && qipuData[3].elements_summary && qipuData[3].elements_summary[0] && qipuData[3].elements_summary[0].title.proper_title) || []
        const jingPai = (qipuData[1] && qipuData[1].elements_summary) || []
        let open = ''
        let auctionCode = ''
        jingPai.forEach((item) => {
          const temp = item.title
          if(temp && temp.proper_title && temp.proper_title === '竞拍开关') {
            open = filterArray(item.key_value_pair, 'auction', 'value') === '1';
            auctionCode = filterArray(item.key_value_pair, 'clickEvent', 'value')
          }
        });
        resultData.push({
          banner,
          games,
          open,
          auctionCode,
          adv,
          mallAdv,
          legaoMessage
        })
        let parkFuli = []
        if(daojuData) {
          daojuData.map((item) => {
            if(item.infinity === 1) {
              item.remain = 1000
            }
          })
          parkFuli = daojuData.sort(compare('remain'))
        }
        resultData.push({
          parkFuli
        })
      }
      return resultData
    })
    .catch(() => {
    })
}

export function getMallAdvData() {
  const requestHeader = {
    task_code: 'qipu_mall_ads_list',
    timestamp: Date.now(),
  }
  return executeTask(requestHeader)
    .then((response) => {
      const data = response.elements_summary
      const resultArray = []
      data.sort(compare('order'))
        .reverse()
      data.map((item) => {
        const temp = {}
        temp.pic = item.key_value_pair && filterArray(item.key_value_pair, 'defImg_webp', 'value')
        temp.text = item.key_value_pair && filterArray(item.key_value_pair, 'text', 'value')
        temp.url = item.key_value_pair && filterArray(item.key_value_pair, 'URL', 'value')
        temp.name = item.key_value_pair && filterArray(item.key_value_pair, 'key', 'value')
        resultArray.push(temp)
      })
      console.log(resultArray)
      return resultArray
    })
    .catch(() => {
      return []
    })
}
