!function() {
    function a() {
        var a = navigator.userAgent.toLowerCase();
        return a.indexOf("iqiyi") >= 0 ? a.indexOf("iphone") >= 0 ? "2_22_221" : a.indexOf("ipad") >= 0 ? "2_21_211" : "2_22_222" : a.indexOf("pps") >= 0 ? a.indexOf("iphone") >= 0 ? "202_22_221" : a.indexOf("ipad") >= 0 ? "202_21_211" : "202_22_222" : "2_20_201"
    }
    function b() {
        var a = H5.cookie.get("QC006");
        return a || (a = "u" + (new Date).getTime(),
        H5.cookie.set("QC006", a, {
            expires: 31536e6,
            path: "/",
            domain: "iqiyi.com"
        })),
        a
    }
    function c() {
        return JSON.parse(H5.cookie.get("P00002") || "{}").uid || ""
    }
    function d() {
        for (var a = null, b = location.search.substr(1).split("&"), c = b.length, d = 0; d < c; d++) {
            var e = b[d];
            if (0 === e.indexOf("rfr")) {
                a = e.split("=")[1];
                break
            }
        }
        return a || (a = document.referrer ? document.referrer : encodeURIComponent(location.href)),
        a
    }
    function e(e) {
        var f = {
            bstp: 0,
            p1: a(),
            u: b(),
            pu: c(),
            rn: (new Date).getTime(),
            rpage: $("body").attr("rpage") || "",
            purl: $("body").attr("rpage") || "",
            rfr: d()
        };
        e = $.extend({}, f, e || {});
        var j = navigator.userAgent.toLowerCase();
        j.indexOf("android") >= 0 && j.indexOf("iqiyi") >= 0 && void 0 !== h && void 0 !== i && (e.iqid = h,
        e.biqid = i);
        var k = [];
        for (var l in e)
            k.push(l + "=" + encodeURIComponent(e[l]));
        var m = new Image;
        m.src = g + k.join("&")
    }
    function f(a) {
        if (a = $.trim(a || $("body").attr("options") || ""),
        0 === a.length)
            return null;
        a = a.split("&");
        for (var b, c = {}; b = a.shift(); )
            b = b.split("="),
            2 === b.length && (c[b[0]] = b[1]);
        return c
    }
    var g = 0 == location.protocol.indexOf("https") ? "https://msg.qy.net/v5/alt/act?" : "http://msg.qy.net/v5/alt/act?";
    window.H5 = window.$ || {},
    H5.cookie = H5.cookie || {},
    H5.cookie.get = function(a) {
        var b = null
          , c = new RegExp("(^| )" + a + "=([^;]*)(;|$)")
          , d = c.exec(document.cookie);
        return d && (b = d[2] || ""),
        "string" == typeof b ? b = decodeURIComponent(b) : ""
    }
    ,
    H5.cookie.set = function(a, b, c) {
        c = c || {},
        b = encodeURIComponent(b);
        var d = c.expires;
        "number" == typeof c.expires && (d = new Date,
        d.setTime(d.getTime() + c.expires)),
        document.cookie = a + "=" + b + (c.path ? "; path=" + c.path : "") + (d ? "; expires=" + d.toGMTString() : "") + (c.domain ? "; domain=" + c.domain : "") + (c.secure ? "; secure" : "")
    }
    ;
    var h = void 0
      , i = void 0;
    H5.sendPingback_page = function(a) {
        e($.extend(f($("body").attr("options")) || a || {}, {
            t: 22
        }))
    }
    ,
    H5.sendPingback_rseat = function(a, b, c) {
        a = a || 0,
        b = b || 0,
        c = $.extend(c || {}, f($("body").attr("options"))),
        "object" == typeof a && (c = $.extend(c, a),
        a = c.rseat),
        "object" == typeof b && (c = $.extend(c, b),
        b = c.block),
        e($.extend(c || {}, {
            t: 20,
            rseat: a,
            block: b,
            mcnt: $.url.getQueryValue(location.href, "mcnt")
        }))
    }
    ,
    H5.sendPingback_block = function(a, b) {
        a = a || 0,
        b = $.extend(b || {}, f($("body").attr("options"))),
        "object" == typeof a && (b = $.extend(b, a),
        a = b.block),
        e($.extend(b || {}, {
            t: 21,
            block: a,
            mcnt: $.url.getQueryValue(location.href, "mcnt")
        }))
    }
    ;
    var j = navigator.userAgent.toLowerCase();
    window.iqiyi && j.indexOf("android") >= 0 && j.indexOf("iqiyi") >= 0 ? iqiyi.ready(function(a) {
        a ? iqiyi.init(function(a) {
            if (0 != a.result) {
                var b = a.data ? a.data.version || "0" : "0";
                b = b.split(".").concat("0", "0"),
                b = 1e4 * parseInt(b[0]) + 100 * parseInt(b[1]) + parseInt(b[2]),
                b >= 100100 ? iqiyi.commonInvoke("JSBRIDGE_GET_IQID", function(a) {
                    a && a.data && (h = a.data.iqid || "",
                    i = a.data.biqid || ""),
                    H5.sendPingback_page()
                }) : H5.sendPingback_page()
            } else
                H5.sendPingback_page()
        }) : H5.sendPingback_page()
    }) : H5.sendPingback_page(),
    $(document).on("click", function(a) {
        var b = $(a.target)
          , c = b.attr("rseat") || b.attr("data-rseat");
        if (c)
            H5.sendPingback_rseat(c, b.attr("block") || b.attr("data-block") || "");
        else {
            var d = b.attr("block") || b.attr("data-block");
            d && H5.sendPingback_block(d)
        }
        var e = b.attr("href");
        e && !/javascript\:/i.test(e) && (a.preventDefault(),
        setTimeout(function() {
            location.href = e
        }, 0))
    })
}(),
function() {
    function a(a) {
        e.device_id = a ? a.deviceId : "",
        e.mac = "",
        e.imei = "",
        e.bt_mac = "";
        var d = a ? a.qyID : null;
        d || (d = window.H5.cookie.get("QC006")),
        e.flashuid = d,
        e.v = a ? a.version : "",
        e.pkg = "",
        e.key = a ? a.key : "",
        e.sid = "",
        e.sttime = "",
        e.os_t = navigator.userAgent.toLowerCase().indexOf("android") >= 0 ? 1 : 2,
        e.os_v = "",
        e.ua_model = "",
        e.brand = "",
        e.lang = "zh-cn",
        e.re = screen.height + "x" + screen.width,
        e.network = "",
        e.cell_id = "",
        e.gps_lon = "",
        e.gps_lat = "",
        e.ipv4 = "",
        e.tvid = "",
        e.aid = "",
        e.cid = "",
        e.pid = "",
        e.duration = "",
        e.act_name = document.title,
        e.ipi = "",
        e.rn = (new Date).getTime(),
        e.rfr = document.referrer,
        e.url = location.href,
        e.br = b(),
        e.ce = "",
        e.c2 = "",
        c(e)
    }
    function b() {
        var a = navigator.userAgent.toLowerCase();
        return a.indexOf("Opera") > -1 ? "Opera" : a.indexOf("MSIE") > -1 ? "IE" : a.indexOf("Firefox") > -1 ? "Firefox" : a.indexOf("Safari") > -1 ? "Safari" : a.indexOf("Chrome") > -1 ? "Chrome" : a.indexOf("QQ") > -1 ? "QQ" : a.indexOf("UCBrowser") > -1 ? "UCBrowser" : a.indexOf("MicroMessenger") > -1 ? "Weixin" : a.indexOf("alipay") > -1 ? "Alipay" : a.indexOf("iqiyi") > -1 ? "Iqiyi" : "Unknown"
    }
    function c(a) {
        var b = [];
        for (var c in a)
            b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
        var e = new Image;
        e.src = d + "?" + b.join("&")
    }
    var d = location.protocol + "//msg.qy.net/v5/bi/opendata"
      , e = {
        type: 5,
        p1: navigator.userAgent.toLowerCase().indexOf("pad") >= 0 ? "2_20_202" : "2_20_201"
    };
    window.iqiyi ? iqiyi.ready(function(b) {
        b ? iqiyi.init(function(b) {
            0 != b.result ? a(b.data) : a()
        }) : a()
    }) : a()
}();
