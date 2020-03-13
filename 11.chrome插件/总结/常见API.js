const arrowURLs = ['^https://github\\.com']
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 每当tabs新建、刷新等动作都可以在这里监听到。当status是loading并且满足是特定的url才行
  if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return
  // 可以自己加个是否登陆的验证
  // 然后分环境加载我们打包后的js
  loadScript('inject', tabId, () => console.log('load inject bundle success!'))
})