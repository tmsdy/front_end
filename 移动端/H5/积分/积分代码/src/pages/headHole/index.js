import './index.less';
import {goToApp, getUserId, parseQueryString} from 'Common/utils';
import {clickPingback, pagePingback} from 'Common/pingback';
import {getMoreAnswers} from './api';

const QUESTION_RPAGE = 'hole_share';

pagePingback(QUESTION_RPAGE);

const queryObj = parseQueryString();

const $topicBanner = $('#topicBanner');

getMoreAnswers({
  qid: queryObj.qid,
  uid: getUserId()
})
  .then((res) => {
    let {data} = res;
    let medal = res.medal ? res.medal : [];
    if(!data) {
      randomBackground();
      return;
    }
    $('#topic-title').text(data.content);
    if(data.pic) {
      $topicBanner.css(
        'background',
        `url(${data.pic}) top center/cover no-repeat`
      );
    } else {
      randomBackground();
    }
    let contentList = (data.answerPageList && data.answerPageList.contentList) || [];
    renderList(contentList, medal);
    addCardStyle();
  })

$('#headHole').click((e) => {
  if($(e.target).data('click') === 'callApp') {
    clickPingback(QUESTION_RPAGE, '', QUESTION_RPAGE);
    goToApp({
      value: 'QuestionDetail',
      integralPrams: {
        from: 'share',
        qid: queryObj.qid
      }
    });
  }
});

const renderList = function (contentList, medal) {
  let leftDom = '',
    rightDom = '',
    cardType = 'big';

  if(contentList.length > 8) {
    contentList.splice(8);
  }
  contentList.forEach((contentItem, index) => {
    if(index % 2) {
      cardType = (index - 1) % 4 ? 'big' : 'small';
      rightDom += `
            <div class='comment-item ${cardType}'>
                ${publicDom(contentItem, medal)}
            </div>
            `;
    } else {
      cardType = index % 4 ? 'small' : 'big';
      leftDom += `
            <div class='comment-item ${cardType} ${index === 0 ? 'fisrt' : ''}'>
                ${publicDom(contentItem, medal)}
            </div>
            `;
    }
  });
  $('.column-left').html(leftDom);
  $('.column-right').html(rightDom);
};

const publicDom = function (item, medal) {
  let {uid} = item;
  let exts = (medal[uid] && medal[uid][0] && medal[uid][0].exts) || [];
  let iconUrl = '';

  for(let i = 0, len = exts.length; i < len; i++) {
    let ext = exts[i] || {};
    if(ext.name === 'iconUrl') {
      iconUrl = ext.value;
    }
  }

  return `
    <div class='comment-top'>
        <img class='avatar' src='${item.avatar}' data-click='callApp' alt='头像' />
        <span class='nickname' data-click='callApp'>${item.uname}</span>
        <img class='icon-medal' src='${iconUrl}' ></img>
        <i class='icon-medal' data-click='callApp'></i>
    </div>
    <p class='comment-detail'>
        ${item.content}
    </p>
    <div class='comment-bottom'>
        <i class='icon-share' data-click='callApp'></i>
        <i class='icon-like-normal' data-click='callApp'></i>
        <span class='mid-gray' data-click='callApp'>${item.likeTotal}</span>
    </div>
    `;
};

const randomBackground = function () {
  let randomNum = parseInt(Math.random() * 3);
  let leftColor = '';
  let rightColor = '';
  switch (randomNum) {
    case 0:
      (leftColor = '#B06F57'); (rightColor = '#CC8469');
      break;
    case 1:
      (leftColor = '#AA627F'); (rightColor = '#C27CA1');
      break;
    case 2:
      (leftColor = '#8C94C8'); (rightColor = '#7079B1');
      break;
    default:
      (leftColor = '#B06F57'); (rightColor = '#CC8469');
      break;
  }
  $topicBanner.css(
    'background',
    `linear-gradient(90deg,${leftColor},${rightColor})`
  );
};

const addCardStyle = function () {
  $('.big .comment-detail').forEach((bigCard) => {
    handleCardStyle(bigCard, 'big');
  });
  $('.small .comment-detail').forEach((smallCard) => {
    handleCardStyle(smallCard, 'small');
  });
};
/**
 * 根据不同的card类型设不同样式
 * @param {*} card Object
 * @param {*} type String
 */
const handleCardStyle = function (card, type) {
  let $card = $(card);
  let ratio = type === 'big' ? 3 : 2;
  let lineHeight = parseInt($card.css('line-height'));
  if($card.height() > lineHeight * ratio) {
    $card.css('-webkit-box-orient', 'vertical');
    $card.after('<div class="more-wrapper" data-click="callApp"><div class="more"></div></div>');
  }
};
