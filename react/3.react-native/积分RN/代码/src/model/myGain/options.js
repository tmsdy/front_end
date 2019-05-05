import {
  unixTimeToFormat,
  transferTimeTo,
  getRandomDate
} from '../../common/util'

function isCommodityExpired2(expiredTime) {
  const timeSpan = new Date().getTime()
  return expiredTime < timeSpan
}

// 先取key=movePic的url，无movePic则取smallPic，再无则展示默认图
function getPicUrl(photoList) {
  let findItem = photoList.reduce((acc, current, i) => {
    let accKey = acc.photoKey
    let curKey = current.photoKey
      if(accKey === 'movepic') {
          return acc
      }
      if(accKey === '' || curKey === 'movepic' || (curKey === 'smallpic' && accKey !== 'smallpic')) {
          return current
      }
      return acc
    }, {
        photoKey: '',
        url: ''
    })
    return findItem && findItem.url
}

  // 获取时间文案
function getNewTimeText(expiredTime) {
  const time = unixTimeToFormat(expiredTime)
  const timeSpan = new Date().getTime()
  const LIMIT_DAY = 3
  const LIMIT_TIME = getRandomDate(LIMIT_DAY)
  const timeTextMap = {
    0: `有效期至 ${time}`, // 有效日期
    1: '即将过期', // 距有效日期expiredTim<=3
    2: '已过期' // 已超过有效期expiredTim
  }
  if(expiredTime < timeSpan) {
    return {timeStatusText: timeTextMap[2], validTime: timeTextMap[0]}
  }
  if(expiredTime <= LIMIT_TIME) {
    return {timeStatusText: timeTextMap[1], validTime: timeTextMap[0]}
  }
  return {timeStatusText: '', validTime: timeTextMap[0]}
}

// 获取新的productSource
function getNewProductSource(productId, productSource) {
  const filterProductSource = Object.keys(productSource).find((v) => {
    return +v === productId
  })
  return filterProductSource
    ? {productId, url: productSource[filterProductSource]}
    : {}
}

// toUseLink 字段带上订单号
function getNewToUseLink({toUseLink = '', orderCode}) {
  if(!toUseLink) return ''
  return toUseLink.includes('?')
    ? `${toUseLink}&orderCode=${orderCode}`
    : `${toUseLink}?orderCode=${orderCode}`
}

  // 获取按钮显示的文字
function getBtnText({type, subType, newToUseLink, productStatus, newProductSource}) {
    const btnTextMap = {
      0: {
        btnText: '使用',
        btnType: 0
      },
      1: {
        btnText: '填写地址',
        btnType: 1
      },
      2: {
        btnText: '激活',
        btnType: 2
      },
      3: {
        btnText: '复制',
        btnType: 3
      },
      4: {
        btnText: '查看',
        btnType: 4
      },
      100: {
        btnText: '',
        btnType: -1
      },
    }
    if(productStatus === 2) {
      // 已使用状态下的btn文字
      if(type === 3 && subType === 0) {
        // 实物商品-常规
        return btnTextMap[100]
      }
      return newProductSource.url ? btnTextMap[4] : btnTextMap[100]
    }
    // 未使用状态下的btn文字
    if(type === 3 && subType === 0) {
      // 实物商品-常规
      return btnTextMap[1]
    }
    if(type === 5 && subType === 10) {
      // 虚拟商品-会员直冲-激活
      return btnTextMap[2]
    }
    if((type === 4 && subType === 0) || (type === 6 && subType === 0)) {
      // 卡券-常规、商品券-常规
      return newToUseLink ? btnTextMap[0] : btnTextMap[3]
    }
    // 其他
    return newToUseLink ? btnTextMap[0] : btnTextMap[100]
  }
  // 转换商品类型
function formatOrderType2({type, subType}) {
    const formatOrderTypeMap = {
      0: 1, // 实物商品-常规
      1: 2, // 虚拟商品-会员直冲-激活
      2: 3, // 卡券-常规、商品券-常规
      3: 4 // 其他
    }
    // 未使用状态下的btn文字
    if(type === 3 && subType === 0) {
      // 实物商品-常规
      return formatOrderTypeMap[0]
    }
    if(type === 5 && subType === 10) {
      // 虚拟商品-会员直冲-激活
      return formatOrderTypeMap[1]
    }
    if((type === 4 && subType === 0) || (type === 6 && subType === 0)) {
      // 卡券-常规、商品券-常规
      return formatOrderTypeMap[2]
    }
    // 其他
    return formatOrderTypeMap[3]
  }

    // 弹框详情btn文案 (已使用|未使用)
  function getDialogBtnText({
      formatOrderType,
      toUseLink,
      newProductSource,
      productStatus
    }) {
      // formatOrderType
      // 1:实物商品-常规
      // 2:虚拟商品-会员直冲-激活
      // 3:卡券-常规、商品券-常规
      // 4: // 其他
      const btnText = {
        0: '',
        1: '已激活',
        2: '复制劵码并使用',
        3: '复制',
        4: '查看',
        5: '使用',
        6: '填写收货地址',
        7: '激活'
      }
      switch (formatOrderType) {
        case 1:
          return productStatus === 1 ? btnText[6] : btnText[0]
        case 2:
          return productStatus === 1 ? btnText[7] : btnText[1]
        case 3:
          return toUseLink ? btnText[2] : btnText[3]
        case 4:
          if(productStatus === 1) return toUseLink ? btnText[5] : btnText[0]
          return newProductSource.url ? btnText[4] : btnText[0]
        default:
          break
      }
    }
  function reduceField(args) {
    const fieldMap = {
      redeemCodes: '商品券码：',
      formatPayTime: '下单时间：',
      orderCode: '订单编号：',
      newAddressInfo: '收货信息：'
    }
    return Object.keys(args).reduce((pre, cur, currentIndex) => {
      pre.push({key: fieldMap[cur], value: args[cur], id: currentIndex})
      return pre
    }, [])
  }
  // 获取弹窗fieldList(未使用|已使用)
  function getDialogFieldList({
    formatOrderType,
    productStatus,
    redeemCodes,
    newAddressInfo,
    orderCode,
    formatPayTime
  }) {
    // formatOrderType
    // 1:实物商品-常规
    // 2:虚拟商品-会员直冲-激活
    // 3:卡券-常规、商品券-常规
    // 4: // 其他
    switch (formatOrderType) {
      case 1:
        return productStatus === 1
          ? reduceField({formatPayTime, orderCode})
          : reduceField({newAddressInfo, formatPayTime, orderCode})
      case 2:
      case 4:
        return reduceField({formatPayTime, orderCode})
      case 3:
        return reduceField({redeemCodes, formatPayTime, orderCode})
      default:
        break
    }
  }

export function handelDetailRes(res = {}, productId) {
    const {data: {code = '', data = []} = {}} = res
    if(code === 'A00000') {
      return data.find((item) => {
        return item.productId === productId
      }) || {}
    }
  }

 // 返回新的地址信息
export function getNewAddressInfo(addressInfo) {
  const {name = '', phone = '', address = ''} = addressInfo
  return `${name} ${phone} ${address}`
}

  // 返回当前订单弹框渲染需要用到的字段
export function getDialogContentField(newOrderDetailInfo) {
    const {
      productStatus,
      formatOrderType,
      toUseLink,
      newProductSource,
      redeemCodes,
      orderCode,
      newAddressInfo = '',
      formatPayTime
    } = newOrderDetailInfo
    const dialogBtnText = getDialogBtnText({
      formatOrderType,
      toUseLink,
      newProductSource,
      productStatus
    })
    const fieldList = getDialogFieldList({
      formatOrderType,
      productStatus,
      redeemCodes,
      orderCode,
      newAddressInfo,
      formatPayTime
    })
    return {
      fieldList,
      dialogBtnText
    }
  }

export function getNewContents({
    partnerSwitchInfo = {},
    productSource = {},
    contents = []
  }) {
    return contents.map((item) => {
      const {
        partnerCode,
        photoList,
        expiredTime,
        type,
        subType,
        toUseLink,
        payTime,
        useTime,
        productStatus,
        productId,
        orderCode
      } = item
      // 获取新的partnerSwitchInfo
      const filterParner = Object.keys(partnerSwitchInfo).find((v) => {
          return v === partnerCode
      })
      const newPartnerSwitchInfo = filterParner ? partnerSwitchInfo[filterParner] : {}
      // 图片
      const newUrl = getPicUrl(photoList)
      // 时间状态标识
      const timeTextObj = getNewTimeText(expiredTime)
      // 商品是否过期

      const isCommodityExpired = isCommodityExpired2(expiredTime)
      // 获取新的productSource
      const newProductSource = (productSource && getNewProductSource(productId, productSource)) || {}
      // 获取新的toUseLink
      const newToUseLink = getNewToUseLink({toUseLink, orderCode})
      // 按钮文字
      const {btnText, btnType} = getBtnText({
        type,
        subType,
        newToUseLink,
        productStatus,
        newProductSource
      })
      // 转换下单时间
      const formatPayTime = transferTimeTo('datetime', payTime)
      // 已使用商品使用时间
      const formatUseTime = useTime && unixTimeToFormat(useTime)
      // 转换商品类型
      const formatOrderType = formatOrderType2({type, subType})
      return {
        ...item,
        newPartnerSwitchInfo,
        newUrl,
        ...timeTextObj,
        isCommodityExpired,
        btnText,
        btnType,
        formatPayTime,
        formatUseTime,
        newProductSource,
        formatOrderType,
        newToUseLink
      }
    })
  }
