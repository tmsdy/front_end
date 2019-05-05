import {sendClickPingback} from '../../common/pingback'
import {sendPingbackToBackend} from './GetData'

/**
 *
 * @param {*导航栏顺序} index    //导航栏投递pingback
 */
export function navIconPingBack(index, rpage = 'homeRN') {
  switch (index) {
    case 0:
      sendClickPingback(rpage, 200200, 'first_btn')
      break;
    case 1:
      sendClickPingback(rpage, 200200, 'second_btn')
      break;
    case 2:
      sendClickPingback(rpage, 200200, 'third_btn')
      break;
    case 3:
      sendClickPingback(rpage, 200200, 'fourth_btn')
      break;
    case 4:
      sendClickPingback(rpage, 200200, 'fifth_btn')
      break;
    case 5:
      sendClickPingback(rpage, 200200, 'sixth_btn')
      break;
    case 6:
      sendClickPingback(rpage, 200200, 'seventh_btn')
      break;
    default:
      sendClickPingback(rpage, 200200, `${index}_btn`)
  }
}

/**
 *
 * @param {*} channelCode
 * @param {*} task
 */
export function taskClickPingback(channelCode, task, rpage = 'homeRN') {
  sendClickPingback(rpage, 200400, `rseat_${channelCode}`);
  sendPingbackToBackend(task, `rseat_${channelCode}`);
}

/**
 *
 * @param {*} channelCode
 */
export function getRewardPingback(channelCode, rpage = 'homeRN') {
  if(channelCode) {
    sendClickPingback(rpage, 200400, `getreward_${channelCode}`);
  } else {
    sendClickPingback(rpage, 200900, 'getall');
  }
}
