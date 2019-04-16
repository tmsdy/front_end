// 设置页面title
export const setDocumentTitle = title => {
  // var $body = $('body')
  document.title = title

  // var $iframe = $('<iframe style="display:none" src="//www.iqiyipic.com/common/images/logo.ico"></iframe>')
  // $iframe.on('load', () => {
  //   setTimeout(() => {
  //     $iframe.off('load').remove()
  //   }, 0)
  // }).appendTo($body)
}

// 创建页面script
export const createScript = (id, url) => {
  const randnum = Math.floor(Math.random() * 1000 + 1);
  url += "&t=" + randnum;
  let oScript = document.getElementById(id);
  let head = document.getElementsByTagName("head").item(0);
  if (oScript) {
    head.removeChild(oScript);
  }
  oScript = document.createElement("script");
  oScript.setAttribute("src", url);
  oScript.setAttribute("id", id);
  oScript.setAttribute("type", "text/javascript");
  oScript.setAttribute("language", "javascript");
  head.appendChild(oScript);
  return oScript;
}

// 事件节流
export const throttle = (fn, threshhold, scope) => {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    let context = scope || this;
    let now = Date.now();
    let args = arguments;

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
