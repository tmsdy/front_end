import {QuestionShare} from '../../constants/configs'
import {shareSNS, shareWx} from '../../common/util'
// import {showToast} from '../../common/QYNativeBridge'

// const showResult = (data) => {
//   /**
//    * 成功信息 {share_type: 6, ShareSuccess: "1"}
//    *  */
//   alert(data.share_type)
//   if(data && data.status === 1) {
//     showToast('分享成功')
//   } else {
//     showToast('分享失败')
//   }
// }

const getShareUrlParams = ({qid, title, wxaPic}) => {
  const queryParams = `?qid=${qid}`
  return {
    title,
    text: '好的回答，胜过提问',
    pic: 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/answer/qs_wx@2x.png',
    url: `${QuestionShare[global._ENV_CONFIG_]}${queryParams}`,
    mp_path: `pages/question/detail/detail?params=${JSON.stringify({qid})}`,
    mp_imageUrl: wxaPic || 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/answer/wx_share_p.png',
    rpage: '',
    shareType: 5
  }
}

export const sharePic = ({pic, qid, title}) => {
  const queryParams = `?qid=${qid}`
  shareSNS({
    title: `#奇妙乐园脑洞大赏#${title}`,
    text: `#奇妙乐园脑洞大赏#${title}`,
    pic: pic.replace('file://', ''), // 分享图片不要file://
    url: `${QuestionShare[global._ENV_CONFIG_]}${queryParams}`,
    mp_path: `pages/question/detail/detail?params=${JSON.stringify({qid})}`,
    mp_imageUrl: 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/answer/wx_share_p.png',
    rpage: '',
    shareType: 3,
    messageType: '2'
  })
}

export const shareUrl = ({wxaPic, qid, title}) => {
  shareSNS(getShareUrlParams({wxaPic, qid, title}))
}

export const shareWxChannel = ({wxaPic, qid, title}) => {
  shareWx(getShareUrlParams({wxaPic, qid, title}))
}
