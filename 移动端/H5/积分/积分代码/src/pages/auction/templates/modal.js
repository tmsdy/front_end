/**
 * Created by liuzhimeng.
 * @date 2018/11/19
 * @description
 */

// 出价弹窗内容
export const bidDialogContent = () => {
  return (`
      <div class="bid-dialog">
          <i class="bid-title"></i>
          <ul class="bid-scope-wrapper">
              <li class="bid-scope">
                  <h3 id="maxPeak" class="scope-num">0</h3>
                  <p class="scope-title">今日最高成交价</p>
              </li>
              <li class="bid-scope">
                  <h3 id="minPeak" class="scope-num">0</h3>
                  <p class="scope-title">今日最低成交价</p>
              </li>
          </ul>
          <div class="input-wrapper">
              <input id="bidInput" class="bid-input" type="number" placeholder="本轮底价0积分">
          </div>
          <div class="bid-score">
              <div id="bidScore" class="tc">
                  <span class="score-text">我的积分：<span id="myScoreInDialog" data-score-modal>0</span></span>，<button id="bidAll" type="button" class="bid-all">押入全部</button>
              </div>
              <div id="bidTip" class="bid-tips">输入积分超出你的总值</div>
          </div>
      </div>
  `)
}

// 出价成功弹窗内容
export const bidSuccessDialogContent = () => {
  return (`
      <i class="bid-success"></i>
      <h3 class="success-content">
          恭喜您用 <span id="successScore" class="success-count">2000</span> 积分拍得<span id="bidSuccessName">会员天卡</span><br/>
      </h3>
      <div class="vip-card"></div>
  `)
}
