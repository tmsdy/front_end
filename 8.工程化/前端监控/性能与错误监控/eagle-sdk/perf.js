// 性能监控sdk by hanfei
function maxBy(array, type) {
    let result = 0
    if (array == null) {
        return result
    }
    for (const value of array) {
        let current = value[type]
        if (current != null && current > result) {
            result = current
        }
    }
    return result
}
export default {
    init: (cb) => {
        let isDOMReady = false
        let cycleTime = 20
        let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance
        // console.log(performance.getEntries()) //这里是获取不到first-contentful-paint渲染信息的
        let Util = {
            addEventListener: function (name, callback, useCapture) {
                if (window.addEventListener) {
                    return window.addEventListener(name, callback, useCapture)
                } else if (window.attachEvent) {
                    return window.attachEvent('on' + name, callback)
                }
            },
            getPerfData: () => {
                let entries = performance.getEntries()
                if (entries.length) {
                    entries = entries.filter((item, i) => {
                        return item.entryType !== 'paint'
                    })
                }

                let data = {
                    firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0].startTime),
                    completeLoaded: Math.round(maxBy(entries, 'responseEnd'))
                }
                return data
            },
            domReady: (callback) => { // DOM解析完成
                if (isDOMReady) {
                    isDOMReady = false
                    return
                }
                let timer = null
                let runCheck = () => {
                    if (performance.timing.domComplete) {
                        clearTimeout(timer)
                        // eslint-disable-next-line standard/no-callback-literal
                        callback('domReady')
                        isDOMReady = true
                    } else {
                        timer = setTimeout(runCheck, cycleTime)
                    }
                }
                if (document.readyState === 'interactive') {
                    runCheck()
                } else if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', function () {
                        runCheck()
                    }, false)
                } else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', function () {
                        runCheck()
                    })
                }
            }
        }
        Util.domReady((perfType) => {
            let perfData = Util.getPerfData() // 拿到性能数据
            perfData.type = perfType
            cb(perfData)
        })
    }
}
