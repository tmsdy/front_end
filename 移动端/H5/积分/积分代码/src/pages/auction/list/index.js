import './index.less'

import {getWinnerList} from '../apis'
import {iqiyiMenu} from 'Common/iqiyiPlugin'
import {renderAwardRecordItem} from '../templates/pageFragments'

let pageState = {
  allList: [],
  currentList: [],
  perCount: 20,
  hasCount: 0,
  totalCount: 0,
}

// 隐藏右上角菜单
iqiyiMenu(null, 'hide')

function setState(data) {
  Object.keys(data).forEach(key => {
    $(`*[data-id="${key}"]`).html(data[key])
  })
}

function listRender(list, reload = false) {
  if (!list.length) {
    return
  }

  const listWrapper = $('#listWrapper')
  let content = ''
  for (let item of list) {
    content += renderAwardRecordItem(item)
  }
  if (reload) {
    return listWrapper.html(content)
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

  // 更新页面
  listRender(allList.slice(start, end), reload)

  pageState.hasCount = end
}

function loadPage() {
  return getWinnerList()
    .then(({list, max, min}) => {
      setState({max, min})
      pageState = {
        ...pageState,
        allList: list,
        hasCount: 0,
        totalCount: list.length
      }
      setListRender(true)
    })
}

loadPage().then(() => {
  const mescroll = new MeScroll('mescroll', {
    up: {
      auto: false,
      htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
      htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中...</p>',
      callback() {
        setTimeout(() => {
          const {totalCount, hasCount, perCount} = pageState
          const currentCount = totalCount - hasCount >= perCount ? perCount : totalCount - hasCount
          setListRender()
          mescroll.endBySize(currentCount, totalCount)
        }, 500)
      }
    }
  })
})
