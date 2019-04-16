import {transferTimeTo} from "Common/utils";

/**
 * Created by liuzhimeng.
 * @date 2018/11/20
 * @description
 */

export const renderProductItem = (product = {}, key) => {
  const tag = !product.productTag ?
    ''
    : `<span class="item-tag" style="background-color: ${product.productTagColor}">${product.productTag}</span>`
  return (`
      <li data-id="productItem" data-key="${key}" class="goods-item">
          <div class="image-wrapper">
              <img src="${product.image}" alt="movepic">
              ${tag}
          </div>
          <h3 class="item-title">${product.title}</h3>
          <div class="item-desc">
              <span class="item-text item-price">${product.price}</span>
              <span class="item-text item-count">${product.used}</span>
          </div>
      </li>
  `)
}

export const renderIntegralPark = () => (`
    <li class="entrance-item">
        <button id="goToIntegralPark" type="button">
            <i class="entrance-image entrance-park"></i>
            <h3 class="entrance-title">积分乐园</h3>
            <span class="entrance-desc">每日更新海量活动></span>
        </button>
    </li>
`)

export const renderAwardRecordItem = ({imgUrl, name, time, cost}) => (
  `<div class="award-record-item">
      <div class="item-wrapper">
          <div class="item-left"><img class="user-protait" src="${imgUrl}"></div>
          <div class="item-right">
              <h3 class="user-name">${name}</h3>
              <div class="user-desc">${time}</div>
          </div>
          <div class="user-integral-wrapper"><span class="integral-text">${cost}</span><i class="integral-icon"></i></div>
      </div>
  </div>`
)
