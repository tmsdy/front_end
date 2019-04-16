import './index.less'

import {
  getWinList,
} from '../apis'
import {
  transferTimeTo,
  isURL,
} from 'Common/utils'
import {
  iqiyiMenu,
} from 'Common/iqiyiPlugin'

let pageState = {
  allList: [],
  currentList: [],
  perCount: 20,
  hasCount: 0,
  totalCount: 0,
}

// 隐藏右上角菜单
iqiyiMenu(null, 'hide')

function domRender(key, value) {
  $(`*[data-page-state=${key}]`).html(value)
}

function setState(data) {
  Object.keys(data).forEach(key => {
    domRender(key, data[key])
  })
}

function listRender(lists, reload = false) {
  const listWrapper = $('*[data-page-state=listWrapper]')
  let content = ''
  if (lists.length) {
    lists.forEach(i => {
      const imgUrl = isURL(i.avatar)
        ? i.avatar
        : 'http://www.iqiyipic.com/common/fix/headicons/male-130.png'
      content += (
        `<li class="list-item">
          <div class="item-wrapper">
              <div class="item-left"><img class="user-protait" src="${imgUrl}"></div>
              <div class="item-right">
                  <h3 class="user-name">${i.nickname}</h3>
                  <div class="user-desc">${transferTimeTo('datetime', i.time)}</div>
              </div>
              <div class="user-integral-wrapper"><span class="integral-text">${i.cost}</span><i class="integral-icon"></i></div>
          </div>
        </li>`
      )
    })
  } else {
    content = '没有更多了'
  }

  if (reload) {
    listWrapper.html(content)
  } else {
    listWrapper.append(content)
  }
}

function setListRender(reload = false) {
  const {
    perCount,
    hasCount,
    allList,
  } = pageState

  const start = hasCount
  const end = hasCount + perCount
  const lists = allList.slice(start, end)

  // 更新页面
  listRender(lists, reload)

  pageState.hasCount = end
}

function loadPage(callback, failback) {
  getWinList()
    .then(data => {
      console.log('getWinList', data)
      const allList = data.records

      const maxIntegral = data.max || 0
      const minIntegral = data.min || 0
      setState({maxIntegral, minIntegral})

      pageState = {
        ...pageState,
        allList,
        hasCount: 0,
        totalCount: allList.length
      }

      setListRender(true)

      callback && callback()
    })
    .catch(err => {
      failback && failback()
    })
}

loadPage(() => {
  const mescroll = new MeScroll('mescroll', {
    down: {
      use: false,
      auto: false,
      callback() {
        loadPage(() => {
          mescroll.endSuccess()
        }, () => {
          mescroll.endErr()
        })
      }
    },

    up: {
      auto: false,
      htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
      htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中...</p>',
      callback() {
        setTimeout(() => {
          setListRender()
          const {
            totalCount,
            hasCount,
            perCount,
          } = pageState

          const currentCount = totalCount - hasCount >= perCount
            ? perCount
            : totalCount - hasCount

          mescroll.endBySize(currentCount, totalCount)
        }, 500)
      }
    }
  })
})
