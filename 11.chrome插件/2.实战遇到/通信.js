// 接受信息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  /*
  message：传参数，主要是type
  sender：当前页的tab url等信息
  sendResponse：返回的信息，sendResponse({ name: 'feifei})
  */
  return true // 如果想要支持异步返回信息，需要加这个
})