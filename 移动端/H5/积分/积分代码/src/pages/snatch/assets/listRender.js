import {getProductImage, getUserId} from 'Common/utils'

function titleTemplate(color, text) {
  return (
    `<h3 class="snatch-title">
      <span class="title-wrapper">
        <span class="title-circle circle-${color}"></span>
        <span class="title-text">${text}</span>
      </span>
    </h3>`
  )
}

// 标题模板
function getTitleTemplate(type = 'in') {
  if(type === 'in') {
    return titleTemplate('yellow', '夺宝进行中')
  } else if(type === 'before') {
    return titleTemplate('blue', '即将开始')
  } else {
    return titleTemplate('pink', '往期夺宝')
  }
}

// 中间夺宝进度条及夺宝时间显示
export function getProdContent({period, desc, currentUserNum}) {
  let template = ''

  if(['in', 'after'].indexOf(period) !== -1) {
    const hasCount = period === 'in' && !!getUserId()
      ? `<span class="fr">已夺<span data-id="hasParticipated">${currentUserNum}</span>次</span>`
      : ''
    template += (`
      <div data-id="progress" class="list-progress"></div>
      <div class="item-desc">${desc}${hasCount}</div>
    `)
  } else {
    template += `<div class="item-desc desc-before">${desc}</div>`
  }

  return template
}

// 底部 夺宝价格及按钮显示
export function getBottomTemplate({period, price, buttonOptions: {type, text}}) {
  let className = ''
  if (period === 'after' && type !== 'win') {
    className = 'fix-default'
  } else if (['isOrdered', 'onLimit'].indexOf(type) !== -1) {
    className = 'disabled'
  }

  return (`
    <div class="bottom-block">
        <span class="participate-price ${period}">${price}积分/次</span>
        <span data-id="submit" class="btn-orange gradient btn-fix ${className}">${text}</span>
    </div>
  `)
}

// 列表子项模板
function prodTemplate(options) {
  const {title, key, period, hasCount, page, photos} = options
  return (
    `<div data-id="listItem" class="list-wrapper" data-key="${hasCount + key}" data-page="${page}">
        <div class="layout-group label-w246">
            <div class="layout-label item-left">
                <div class="image-wrapper">
                    <img class="item-image" src="${getProductImage(photos)}"/>
                </div>
            </div>
            <div class="item-right ${period === 'after' && 'item-title-after'}">
                <h3 class="item-title">${title}</h3>
                <div data-id="listItemMain">
                    ${getProdContent(options)}
                    ${getBottomTemplate(options)}
                </div>
            </div>
        </div>
    </div>`
  )
}

export function winnerRender(winner, isCurrentUserWin) {
  if(isCurrentUserWin) {
    return (
      `<div class="list-tips w-100 success" >
        <div class="item ">
          <div class="my-success">恭喜您中奖了</div>
          <div class="my-success text-right " >
            <span data-id="view-price">查看奖品<i class="my-success-icon"></i></span>
          </div>
        </div>
      </div>`
    )
  }
  if(winner && winner.userId) {
    return (
      `<div class="list-tips w-100">
        <div class="item">
          <span class="item-left"><img class="left-content" src="${winner.avatar}" alt="user avatar" /></span>
          ${winner.nickname.length > 8 ? winner.nickname.slice(0, 7) + '...' : winner.nickname} 参与
          <span class="color-primary">${winner.num}次</span>夺宝成功
        </div>
      </div>`
    )
  } else {
    return (
      `<div class="list-tips w-100">
        <div class="item ml20 c6">积分将返还参与用户</div>
      </div>`
    )
  }
}

export function winnerListRender(rewardViews, winnerFirst = {}) {
  if(!rewardViews || !rewardViews.length) return ''
  const rank = ['一', '二', '三']
  let spans = ''
  // const nickname = winnerFirst.nickname.length > 8 ? winnerFirst.nickname.slice(0, 7) + '...' : winnerFirst.nickname
  rewardViews.forEach((data, index) => {
    const winner = data.winner
    let span = ''
    if(winner) {
      if(index === 0) {
        const nickname = winnerFirst.nickname.length > 8 ? winnerFirst.nickname.slice(0, 7) + '...' : winnerFirst.nickname
        if(data.totalWinners > 1) {
          span = `</span>${nickname}等<span class="orange-word">${data.totalWinners}位</span>夺得${rank[index]}等奖`
        } else {
          span = `</span>${nickname}<span class="orange-word">参与${winnerFirst.num}次</span>夺得${rank[index]}等奖`
        }
        spans += `<div class="item">
              <span class="rank-orange">1</span>
              <span class="item-left"><img class="left-content" src="${winner.avatar}" alt="user avatar"/>${span}
          </div>`
      } else {
        const nickname = winner.nickname.length > 8 ? winner.nickname.slice(0, 7) + '...' : winner.nickname.nickname
        if(data.totalWinners > 1) {
          span = `</span>${nickname}等<span class="orange-word">${data.totalWinners}位</span>用户夺得${rank[index]}等奖`
        } else {
          span = `</span>${nickname}<span class="orange-word">1位</span>用户夺得${rank[index]}等奖`
        }
        if(index === 1) {
          spans += `<div class="item">
                <span class="rank-orange">2</span>
                <span class="item-left"><img class="left-content" src="${winner.avatar}" alt="user avatar" />${span}
            </div>`
        } else {
          spans += `<div class="item">
                <span class="rank-orange">3</span>
                <span class="item-left"><img class="left-content" src="${winner.avatar}" alt="user avatar" />${span}
            </div>`
        }
      }
    }
  })
  return (`
    <div class="detail-reward-list"><div class="list-tips detail-reward-item">${spans}</div></div>
  `)
}

// 夺宝成功列表
function mySuccessTemplate(options) {
  const {id, orderId, title, key, showButton, disabled, isExpried, offlineTime, productsPrice, hasCount} = options
  const isExpriedStyle = isExpried ? 'expried' : ''

  const dataOrderId = orderId === null ? '' : `data-order-id="${orderId}"`

  let buttonTemp = ''
  if(showButton) {
    const btnClass = disabled || isExpried ? ' disabled' : ''
    const btnText = isExpried ? '已过期' : disabled ? '已使用' : '去使用'
    buttonTemp = (`
      <div class="button-wrapper">
        <span data-id="toUse" class="btn-orange gradient btn-touse${btnClass}">${btnText}</span>
      </div>
    `)
  }

  return (
    `<div class="list-wrapper ${isExpriedStyle}" data-id="${id}" data-key="${hasCount + key}" ${dataOrderId}>
        <div class="layout-group label-w178 background-wrapper">
            <div class="layout-label layout-left">
               <div class="price"><span class="unit">￥</span>${productsPrice}</div>
            </div>
            <div class="layout-right">
                <div class="item-content${showButton ? ' with-button' : ''}">
                    <h3 class="item-title">${title}</h3>
                    <div class="record-validity">有效期至 ${offlineTime}</div>
                </div>
                ${buttonTemp}
            </div>
        </div>
    </div>`
  )
}

// 夺宝主页列表
function listTemplate(list = []) {
  if(!list.length) return ''

  let listTemplate = ''
  let lastPeriod = list[0]._options.lastPeriod

  list.forEach((detail) => {
    const {_options} = detail
    const {period} = _options
    const itemTemp = prodTemplate(_options)

    // 分类发生变化
    if(lastPeriod !== period) {
      listTemplate += getTitleTemplate(period)
    }
    // 插入当面数据模板
    listTemplate += itemTemp
    // 保存当前数据
    lastPeriod = period
  })

  return listTemplate
}

// 夺宝记录页列表
function myRecordlistTemplate(list, pageType = 'history') {
  let template = ''
  const templateRender = pageType === 'success' ? mySuccessTemplate : prodTemplate
  list.forEach((detail) => {
    template += templateRender(detail._options)
  })
  return template
}

/**
 * 夺宝列表渲染
 * @param $wrapper 加载容器
 * @param type 加载方式
 * @param list 列表数据
 * @param pageType 页面位置 home：夺宝主页列表；history：我参与的列表；success：参与成功的列表
 */
export function listRender($wrapper = null, type = 'append', list = [], pageType = 'home') {
  if(!$wrapper) return

  let content = ''
  // 夺宝主页
  if(pageType === 'home') {
    content = listTemplate(list)
  } else {
    // 我的兑换记录页
    content = myRecordlistTemplate(list, pageType)
  }
  if(type === 'reset') {
    $wrapper.html(content)
  } else {
    $wrapper.append(content)
  }
}
