!(function(a, b) {
  "undefined" == typeof window
    ? (module.exports = {})
    : "object" == typeof module && module.exports
    ? (module.exports = b())
    : (a.iqiyi = b());
})("undefined" != typeof self ? self : this, function() {
  function a() {}
  function b(a, b) {
    var c = window.document.createElement("iframe");
    (c.style.display = "none"),
      (c.src = a),
      window.document.documentElement.appendChild(c),
      setTimeout(function() {
        window.document.documentElement.removeChild(c);
      }, 0);
  }
  function c(a) {
    window.location.href = a;
  }
  function d() {
    function a(a) {
      return (
        "?" +
        Object.keys(a)
          .map(function(b) {
            return b + "=" + a[b];
          })
          .join("&")
      );
    }
    function b(b, c) {
      (c = c || "http://msg.qy.net/v5/mbd/qos_http"),
        console.log("reporting:", b),
        (c += a(b));
      var d = new Image();
      d.src = c;
    }
    function c(a, b) {
      var c = a - b;
      return c < 0 ? 0 : c;
    }
    function d() {
      var a = window.performance.timing,
        b = c(a.loadEventEnd, a.navigationStart),
        d = c(a.domainLookupEnd, a.domainLookupStart),
        e = c(a.connectEnd, a.connectStart),
        f = c(a.responseStart, a.requestStart),
        g = c(a.responseEnd, a.responseStart),
        i = c(a.domComplete, a.domInteractive),
        j = c(a.responseStart, a.navigationStart),
        k = c(a.domLoading, a.navigationStart),
        l = c(a.domInteractive, a.navigationStart),
        m = c(a.domContentLoadedEventStart, a.navigationStart),
        n = c(a.domContentLoadedEventEnd, a.navigationStart),
        o = c(a.domComplete, a.navigationStart),
        p = c(a.loadEventStart, a.navigationStart),
        q = c(a.loadEventEnd, a.navigationStart);
      return {
        total_tm: b,
        dns_tm: d,
        tcpconn_tm: e,
        req_tm: f,
        resp_tm: g,
        dom_tm: i,
        ws_tm: j,
        dl_tm: k,
        di_tm: l,
        cs_tm: m,
        ce_tm: n,
        dc_tm: o,
        ls_tm: p,
        le_tm: q,
        host: window.location.hostname,
        path: window.location.pathname,
        proto: window.location.protocol.slice(0, -1),
        port: window.location.port,
        query: window.location.search.slice(1),
        apptt: 4,
        p1: h ? "2_22_221" : "2_22_222",
        v: "_js_",
        os: "_js_",
        brand: "_js_",
        ua_model: "_js_"
      };
    }
    window.addEventListener("load", function() {
      setTimeout(function() {
        l.collectPerformance && Math.random() < l.collectRate && b(d());
      }, 2e3);
    });
  }
  var e,
    f,
    g = window.navigator.userAgent,
    h =
      !!g.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || !!g.match(/\(i[^;]+; iOS/),
    i = !1,
    j = { fail: a, success: a, cancel: a };
  try {
    i = h
      ? g.indexOf("QYWebContainer") !== -1 ||
        void 0 !== window.webkit.messageHandlers.__$$$_native_call_
      : void 0 !== window.__$$$_native_call_.invoke;
  } catch (k) {
    a();
  }
  i && (e = f = 0), h && b("qyjbscheme://__BRIDGE_LOADED__");
  var l = {
    VERSION: "2.10.27",
    callbacks: {},
    collectPerformance: !0,
    collectRate: 0.2,
    JSBRIDGE_INIT_PAGE: "JSBRIDGE_INIT_PAGE",
    JSBRIDGE_LOGIN: "JSBRIDGE_LOGIN",
    JSBRIDGE_LOGOUT: "JSBRIDGE_LOGOUT",
    JSBRIDGE_SHARE: "JSBRIDGE_SHARE",
    JSBRIDGE_SHARE_DATA: "JSBRIDGE_SHARE_DATA",
    JSBRIDGE_CHARGE: "JSBRIDGE_CHARGE",
    JSBRIDGE_SCAN_QRCODE: "JSBRIDGE_SCAN_QRCODE",
    JSBRIDGE_UPLOAD_VIDEO: "JSBRIDGE_UPLOAD_VIDEO",
    JSBRIDGE_SYNC_USER: "JSBRIDGE_SYNC_USER",
    JSBRIDGE_LOAD_PAGE: "JSBRIDGE_LOAD_PAGE",
    JSBRIDGE_SHOW_MENU: "JSBRIDGE_SHOW_MENU",
    JSBRIDGE_HIDE_MENU: "JSBRIDGE_HIDE_MENU",
    JSBRIDGE_CLOSE_PAGE: "JSBRIDGE_CLOSE_PAGE",
    JSBRIDGE_GEN_IA: "JSBRIDGE_GEN_IA",
    JSBRIDGE_INSIDE_STORE: "JSBRIDGE_INSIDE_STORE",
    JSBRIDGE_SYNC_DATA: "JSBRIDGE_SYNC_DATA",
    JSBRIDGE_STATUS_PLUGIN: "JSBRIDGE_STATUS_PLUGIN",
    JSBRIDGE_DOWNLOAD_PLUGIN: "JSBRIDGE_DOWNLOAD_PLUGIN",
    JSBRIDGE_STATUS_APP: "JSBRIDGE_STATUS_APP",
    JSBRIDGE_DOWNLOAD_APP: "JSBRIDGE_DOWNLOAD_APP",
    JSBRIDGE_INSTALL_APP: "JSBRIDGE_INSTALL_APP",
    JSBRIDGE_OPEN_APP: "JSBRIDGE_OPEN_APP",
    JSBRIDGE_SELECT_IMAGE: "JSBRIDGE_SELECT_IMAGE",
    JSBRIDGE_SET_GOBACK: "JSBRIDGE_SET_GOBACK",
    JSBRIDGE_ROUTER: "JSBRIDGE_ROUTER",
    JSBRIDGE_OPEN_VOICE_SEARCH: "JSBRIDGE_OPEN_VOICE_SEARCH",
    JSBRIDGE_STOP_RECORD_AUDIO: "JSBRIDGE_STOP_RECORD_AUDIO",
    JSBRIDGE_INTERCEPTE_CLICK: "JSBRIDGE_INTERCEPTE_CLICK",
    MAX_COUNT: 10,
    invokeNative: function(a, b) {
      var c, d, g;
      try {
        if (i) {
          var j;
          (j = f !== e ? e : -1),
            (c = { func: a, arguments: b || {}, callback_handle: j }),
            (f = e),
            h
              ? ((d =
                  window.webkit.messageHandlers.__$$$_native_call_.postMessage),
                (g = window.webkit.messageHandlers.__$$$_native_call_))
              : ((d = window.__$$$_native_call_.invoke),
                (g = window.__$$$_native_call_));
        } else
          (c = { type: a, request: b || null }),
            (d = window.IqiyiJsBridge.invoke),
            (g = window.IqiyiJsBridge);
        var k = JSON.stringify(c);
        console.log("call native: " + k), d.call(g, k);
      } catch (l) {
        console.log("invoke fail: " + JSON.stringify(c)),
          console.warn(l.message);
      }
    },
    invoke: function(a) {
      try {
        console.log("native call: " + a);
        var b = "string" == typeof a ? JSON.parse(a) : a;
        if (i) {
          var c = b.handle;
          this.runCallback(this.callbacks[c], b.result);
        } else
          switch (b.type) {
            case this.JSBRIDGE_INIT_PAGE:
              this.callbacks[b.type].shift()(b.response);
              break;
            case this.JSBRIDGE_SHARE_DATA:
              b.response
                ? this.runCallback(this.callbacks[b.type], b.response)
                : (this.onShare.trigger.call(this.onShare.request),
                  this.invokeNative(
                    this.JSBRIDGE_SHARE_DATA,
                    this.onShare.request
                  ));
              break;
            default:
              this.runCallback(this.callbacks[b.type], b.response);
          }
      } catch (d) {
        console && "function" == typeof console.error && console.error(d);
      }
    },
    setCallback: function(b, c) {
      var d = {};
      "object" == typeof c
        ? ((d.success = "function" == typeof c.success ? c.success : a),
          (d.fail = "function" == typeof c.fail ? c.fail : a),
          (d.cancel = "function" == typeof c.cancel ? c.cancel : a))
        : (d.callback = "function" == typeof c ? c : a),
        i ? (e++, (this.callbacks[e] = d)) : (this.callbacks[b] = d),
        console.log("setCallback:" + b);
    },
    runCallback: function(a, b) {
      var c = b || {},
        d = a || j;
      (c.result = parseInt(c.result)),
        d.callback
          ? d.callback(c)
          : 0 === c.result
          ? d.fail(c.data, c.msg, c)
          : 1 === c.result
          ? d.success(c.data, c.msg, c)
          : 2 === c.result && d.cancel(c.data, c.msg, c);
    },
    ready: function(a) {
      var b = this;
      "function" == typeof a &&
        (window.IqiyiJsBridge ||
        window.__$$$_native_call_ ||
        (window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.__$$$_native_call_)
          ? a(!0)
          : setTimeout(function() {
              b.MAX_COUNT-- > 0 ? b.ready(a) : a(!1);
            }, 500));
    },
    init: function(b) {
      i
        ? this.setCallback(this.JSBRIDGE_INIT_PAGE, b)
        : ((this.callbacks[this.JSBRIDGE_INIT_PAGE] =
            this.callbacks[this.JSBRIDGE_INIT_PAGE] || []),
          this.callbacks[this.JSBRIDGE_INIT_PAGE].push(
            "function" == typeof b ? b : a
          )),
        this.invokeNative(this.JSBRIDGE_INIT_PAGE);
    },
    login: function(a) {
      this.invokeNative(this.JSBRIDGE_LOGIN, a ? { returnUrl: a } : null);
    },
    logout: function(a) {
      this.invokeNative(this.JSBRIDGE_LOGOUT, a ? { returnUrl: a } : null);
    },
    share: function(a) {
      var b = this.setShareData(a);
      this.setCallback(this.JSBRIDGE_SHARE, a),
        this.invokeNative(this.JSBRIDGE_SHARE, b);
    },
    onShare: function(a) {
      var b = this.setShareData(a);
      this.setCallback(this.JSBRIDGE_SHARE_DATA, a),
        this.invokeNative(this.JSBRIDGE_SHARE_DATA, b);
    },
    setShareData: function(a) {
      a = a || {};
      var b = {
        item: a.item || [],
        title: a.title || document.title || "",
        desc: a.desc || "",
        imgUrl:
          a.imgUrl ||
          "http://pic9.iqiyipic.com/common/20151208/87b50785390941e58c30b681d82d76b9.png",
        link: a.link || window.location.href,
        shareType: parseInt(a.shareType) || 0
      };
      a.mp_imageUrl && (b.mp_imageUrl = a.mp_imageUrl),
        a.mp_path && ((b.mp_path = a.mp_path), (b.shareType = 5));
      for (var c in a) c in b || (b[c] = a[c]);
      if (5 == b.shareType && !b.mp_path)
        throw new Error("shareType 为 5 时，必须设置分享的小程序路径 mp_path");
      return b;
    },
    charge: function(a) {
      (a = a || {}),
        this.setCallback(this.JSBRIDGE_CHARGE, a),
        this.invokeNative(this.JSBRIDGE_CHARGE, a);
    },
    scanQRCode: function(a) {
      this.setCallback(this.JSBRIDGE_SCAN_QRCODE, a),
        this.invokeNative(this.JSBRIDGE_SCAN_QRCODE);
    },
    uploadVideo: function(a) {
      a = a || {};
      var b = {
        id: a.id || "",
        title: a.title || document.title || "",
        returnUrl: a.returnUrl || window.location.href
      };
      this.setCallback(this.JSBRIDGE_UPLOAD_VIDEO, a),
        this.invokeNative(this.JSBRIDGE_UPLOAD_VIDEO, b);
    },
    syncUser: function(a) {
      a = a || {};
      var b = { authcookie: a.authcookie || "" };
      this.setCallback(this.JSBRIDGE_SYNC_USER, a),
        this.invokeNative(this.JSBRIDGE_SYNC_USER, b);
    },
    loadNativePage: function(a) {
      (a = a || { returnUrl: window.location.href }),
        a.page && this.invokeNative(this.JSBRIDGE_LOAD_PAGE, a);
    },
    showMenu: function(a) {
      a = a || {};
      var b = { share: !!a.share, menus: [] };
      a.prizeRecord &&
        b.menus.push({
          icon:
            "http://pic7.iqiyipic.com/common/20170905/16deb64aab4447b8a69de6a270937f3a.png",
          text: "获奖记录",
          link: "http://activity.m.iqiyi.com/html5/userprize"
        }),
        a.customService &&
          b.menus.push({
            icon:
              "http://pic6.iqiyipic.com/common/20170905/1a80a205967646e0a0dee2eb43263639.png",
            text: "联系客服",
            link: "http://activity.m.iqiyi.com/html5/customservice"
          }),
        a.menus && (b.menus = b.menus.concat(a.menus)),
        this.invokeNative(this.JSBRIDGE_SHOW_MENU, b);
    },
    hideMenu: function(a) {
      this.invokeNative(this.JSBRIDGE_HIDE_MENU, a);
    },
    closePage: function(a) {
      this.invokeNative(this.JSBRIDGE_CLOSE_PAGE, a);
    },
    getInferiorAccount: function(a) {
      this.setCallback(this.JSBRIDGE_GEN_IA, a),
        this.invokeNative(this.JSBRIDGE_GEN_IA);
    },
    openAppStore: function(a, b) {
      a &&
        this.invokeNative(this.JSBRIDGE_INSIDE_STORE, {
          appid: a,
          options: b || {}
        });
    },
    syncData: function(a) {
      if (
        ((a = a || {}), a.method && ("set" === a.method || "get" === a.method))
      ) {
        var b = { method: a.method, options: a.options || {} };
        this.setCallback(this.JSBRIDGE_SYNC_DATA, a),
          this.invokeNative(this.JSBRIDGE_SYNC_DATA, b);
      }
    },
    checkStatusApp: function(a, b) {
      this.setCallback(this.JSBRIDGE_STATUS_APP, b),
        this.invokeNative(this.JSBRIDGE_STATUS_APP, a);
    },
    downloadApp: function(a, b) {
      this.setCallback(this.JSBRIDGE_DOWNLOAD_APP, b),
        this.invokeNative(this.JSBRIDGE_DOWNLOAD_APP, a);
    },
    installApp: function(a, b) {
      this.setCallback(this.JSBRIDGE_INSTALL_APP, b),
        this.invokeNative(this.JSBRIDGE_INSTALL_APP, a);
    },
    openApp: function(a, b) {
      this.setCallback(this.JSBRIDGE_OPEN_APP, b),
        this.invokeNative(this.JSBRIDGE_OPEN_APP, a);
    },
    checkStatusPlugin: function(a, b) {
      this.setCallback(this.JSBRIDGE_STATUS_PLUGIN, b),
        this.invokeNative(this.JSBRIDGE_STATUS_PLUGIN, a);
    },
    downloadPlugin: function(a, b) {
      this.setCallback(this.JSBRIDGE_DOWNLOAD_PLUGIN, b),
        this.invokeNative(this.JSBRIDGE_DOWNLOAD_PLUGIN, a);
    },
    selectImage: function(a, b) {
      this.setCallback(this.JSBRIDGE_SELECT_IMAGE, b),
        this.invokeNative(this.JSBRIDGE_SELECT_IMAGE, a);
    },
    setGoback: function(a, b) {
      this.setCallback(this.JSBRIDGE_SET_GOBACK, b),
        this.invokeNative(this.JSBRIDGE_SET_GOBACK, a);
    },
    openWebview: function(a) {
      var b = a || {},
        d =
          "iqiyi-phone://com.qiyi.video/res?pid=" +
          (b.pid || 8) +
          "&url=" +
          encodeURIComponent(b.url) +
          "&title=" +
          encodeURIComponent(b.title);
      console.log("open: " + d), c(d);
    },
    openPage: function(a, b) {
      this.setCallback(this.JSBRIDGE_ROUTER, b),
        this.invokeNative(this.JSBRIDGE_ROUTER, a);
    },
    openVoicesearch: function(a) {
      this.setCallback(this.JSBRIDGE_OPEN_VOICE_SEARCH, a),
        this.invokeNative(this.JSBRIDGE_OPEN_VOICE_SEARCH);
    },
    stopRecordAudio: function(a) {
      this.setCallback(this.JSBRIDGE_STOP_RECORD_AUDIO, a),
        this.invokeNative(this.JSBRIDGE_STOP_RECORD_AUDIO);
    },
    handleRightbtnClick: function(a) {
      this.setCallback(this.JSBRIDGE_INTERCEPTE_CLICK, a),
        this.invokeNative(this.JSBRIDGE_INTERCEPTE_CLICK);
    },
    commonInvoke: function(a, b, c) {
      var d = this[a] || a;
      c && this.setCallback(d, c), this.invokeNative(d, b);
    }
  };
  i ? (window.QIYI = l) : (window.iqiyi = l);
  try {
    d();
  } catch (k) {
    console.warn(k);
  }
  return l;
});
