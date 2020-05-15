/**
 * 如果说这个网站提供了API接口，那么好就可以直接 读取接口内容 得到数据
 * 
 */
let axios = require('axios');
// let url = 'https://follow-api-ms.juejin.im/v1/getUserFollowInfo?uid=55a4cb1fe4b039f185f88d9c&src=web';
let url = 'https://lccro-api-ms.juejin.im/v1/get_multi_user?uid=5b5f49aa5188251ac771d598&device_id=1583678563711&token=eyJhY2Nlc3NfdG9rZW4iOiJpYmVaV2w2MzhqUFlSdmZqIiwicmVmcmVzaF90b2tlbiI6ImNYY25iVHZvbThTNkZuQ1YiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ%3D%3D&src=web&ids=5794cec91532bc0060caf52b&cols=viewedEntriesCount%7Crole%7CtotalCollectionsCount%7CallowNotification%7CsubscribedTagsCount%7CappliedEditorAt%7Cemail%7CfollowersCount%7CpostedEntriesCount%7ClatestCollectionUserNotification%7CcommentedEntriesCount%7CweeklyEmail%7CcollectedEntriesCount%7CpostedPostsCount%7Cusername%7ClatestLoginedInAt%7CtotalHotIndex%7CblogAddress%7CselfDescription%7ClatestCheckedNotificationAt%7CemailVerified%7CtotalCommentsCount%7Cinstallation%7Cblacklist%7CweiboId%7CmobilePhoneNumber%7Capply%7CfolloweesCount%7CdeviceType%7CeditorType%7CjobTitle%7Ccompany%7ClatestVoteLikeUserNotification%7CauthData%7CavatarLarge%7CmobilePhoneVerified%7CobjectId%7CcreatedAt%7CupdatedAt';
(async function () {
  let result = await axios.get(url);
  console.log(result.data);
})();