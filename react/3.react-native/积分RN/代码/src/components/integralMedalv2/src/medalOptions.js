/**
 * Created by liuzhimeng.
 * @date 2018/10/24
 * @description
 */
import {isObj} from '@iqiyi/rn-utils'
import {filterExts, transferTimeTo} from '../../../common/util'

const getPercent = (current, total) => {
  const t = Number(total)
  const c = Number(current)
  if(t === 0) return 0
  if(c >= t) return 100
  return Math.round((c * 100) / t);
}

// 获取用户已佩戴勋章列表
export const getWearedMedalOptions = (_detail, index, page) => {
  const options = {
    id: index,
    url: '',
    showBackground: false,
    bgName: 'add',
    extMaps: {},
    _detail,
  }
  if(!_detail.channelCode) {
    return options
  }
  const extMaps = filterExts(_detail.exts)
  return {
    ...options,
    id: _detail.channelCode,
    url: page === 'guest' ? extMaps.iconUrl : extMaps.iconBig,
    extMaps,
  }
}

/**
 * 获取客态页勋章列表子项配置
 * @param _detail
 * @param options
 * @returns {}
 */
export const getGuestMedalItemOptions = (_detail) => {
  const extMaps = filterExts(_detail.exts)
  return {
    url: _detail.star === 0 ? extMaps.iconGrey : extMaps.iconBig,
    id: _detail.channelCode,
    title: _detail.channelName,
    description: _detail.channelDesc,
    star: _detail.star,
    extMaps,
    _detail,
  }
}

// 获取主态页勋章列表子项配置
export const getUserMedalItemOptions = (_detail) => {
  const extMaps = filterExts(_detail.exts)
  return {
    url: _detail.star === 0 ? extMaps.iconGrey : extMaps.iconBig,
    canBeWeared: extMaps.wear === 'true', // 是否是可佩带勋章，决定此勋章是否在佩戴弹窗里显示
    id: _detail.channelCode,
    title: _detail.channelName,
    description: _detail.channelDesc,
    star: _detail.star,
    withStar: !['caidan', 'huodong'].includes(extMaps.yewufang),
    starTotals: _detail.starTotals,
    isPlaceholder: false,
    newborn: _detail.newborn,
    extMaps,
    _detail,
  }
}

// 获取勋章详情弹窗子项配置
export const getMedalDetailOptions = (_detail, index, {userStatus}) => {
  const {exts = []} = _detail
  const extMaps = filterExts(exts)
  // 获取特权内容
  const content = exts
    .filter(({name}) => /^tequan/.test(name))
    .map(({value}) => value) || []

  const {
    iconBig = '',
    iconGrey = '',
    medalSource = '',
    cardOptionType,
    cardOptionConent,
    cardOptionUrl = '',
    yewufang = '',
  } = extMaps

  let bottomText = ''
  let url = iconGrey

  // 0：已获取；1：进行中；2：未获取
  if(userStatus === 0) {
    if(_detail.finishAt) {
      const dateStr = transferTimeTo('datetime', _detail.finishAt)
        .split(' ')[0]
      if(dateStr) {
        const dateArr = dateStr.split('-')
        if(dateArr.length === 3) {
          bottomText = `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日获得勋章`
        }
      }
    }
    url = iconBig
  } else if(userStatus === 1) {
    bottomText = cardOptionConent
  } else if(userStatus === 2) {
    bottomText = '还没有解锁勋章哦~'
  }

  return {
    id: _detail.channelCode,
    title: _detail.channelName,
    description: _detail.channelDesc,
    tabLabel: '',
    url,
    star: index + 1,
    content,
    percentageList: [],
    medalSource,
    bottomType: [0, 2].includes(userStatus) ? 'text' : cardOptionType,
    bottomText,
    bottomUrl: cardOptionUrl,
    showSimpleConent: ['huodong', 'caidan'].includes(yewufang),
    userStatus,
    extMaps,
    _detail,
  }
}

/**
 * 添加勋章进度至勋章列表
 * @param list          勋章列表数据
 * @param processData   进度数据
 * @returns {Array}
 */
export const addPercentageList = (list, processData = {}) => {
  for(const item of list) {
    const {id, extMaps: {progressTitle = ''}} = item
    const process = processData[id] || []
    const processList = isObj(process) ? [process] : process
    item.percentageList = processList.map(({current = 0, total = 0}, k) => ({
      id: `id_${k}`,
      percent: getPercent(current, total),
      text: current > total ? total : current,
      title: progressTitle,
    }))
  }
  return list
}

/**
 * 增加勋章列表空白占位符，用于保持三列显示勋章列表
 * @param list          列表数据
 * @param placeholder   (可选)添加占位符信息
 * @returns {*}
 */
export const addPlaceholderToMedalLists = (list, placeholder) => {
  const l = list.length
  const count = 3 - (l % 3)
  for(let i = 0; i < count; i++) {
    list.push({
      id: `_placeholder_${l + i}`,
      isPlaceholder: true,
      ...placeholder,
    })
  }
  return list
}

/**
 * 获取主态页已佩戴勋章空槽配置（需要根据用户勋章数和佩戴勋章数计算要显示的空槽数）
 * @param list   用户已佩戴的勋章列表
 * @param total  用户拥有的可佩带的勋章总数
 * @returns {...*[]}
 */
export const addUserMedalEmptyList = (list = [], total) => {
  const wearedCount = list.length
  // 用户无勋章
  if(total === 0) {
    return [{
      id: '_lock',
      bgName: 'lock',
    }]
  }

  // 用户拥有勋章
  if(wearedCount < 3 && wearedCount < total) {
    const _total = total >= 3 ? 3 : total
    for(let n = 0; n < _total - wearedCount; n++) {
      list.push({
        bgName: 'add',
        id: n,
      })
    }
  }

  return list
}

/**
 * 增加已佩戴勋章状态判断（最大化优化查询效率）
 * @param list      勋章列表
 * @param finder    已佩戴勋章ID列表
 * @returns {Array}
 */
export const addWearedMedalState = (list = [], finder = []) => {
  let _finder = finder
  for(const item of list) {
    if(_finder.length) {
      item.isWeared = _finder.includes(item.id)
      _finder = _finder.filter(i => i !== item.id)
      continue // eslint-disable-line
    }
    break
  }
  return list
}
