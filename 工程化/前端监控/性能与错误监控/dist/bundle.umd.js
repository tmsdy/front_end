(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    // 过滤无效数据；
    function maxBy(array, type) {
        let result = 0;
        if (array == null) {
            return result
        }
        for (const value of array) {
            let current = value[type];
            if (current != null && current > result) {
                result = current;
            }
        }
        return result
    }
    var perf = {
        init: (cb) => {
            let isDOMReady = false;
            let isOnload = false;
            let cycleTime = 100;
            let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
            // console.log(performance.getEntries()) //这里是获取不到first-contentful-paint渲染信息的
            let Util = {
                getPerfData: () => {
                    let entries = performance.getEntries();
                    if (entries.length) {
                        entries = entries.filter((item, i) => {
                            return item.entryType !== 'paint'
                        });
                    }

                    let data = {
                        firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0].startTime),
                        completeLoaded: Math.round(maxBy(entries, 'responseEnd'))
                    };
                    return data
                },
                domReady: (callback) => { //DOM解析完成
                    if (isDOMReady) return
                    let timer = null;
                    let runCheck = () => {
                        if (performance.timing.domComplete) {
                            clearTimeout(timer);
                            callback();
                            isDOMReady = true;
                        } else {
                            timer = setTimeout(runCheck, cycleTime);
                        }
                    };
                    if (document.readyState === 'interactive') {
                        runCheck();
                        return
                    }

                    document.addEventListener('DOMContentLoaded', () => {
                        // 开始循环检查DOMContentLoaded是否完成
                        runCheck();
                    });

                },
                onload: (callback) => { //页面加载完成
                    if (isOnload) return
                    let timer = null;
                    let runCheck = () => {
                        if (performance.timing.loadEventEnd) {
                            clearTimeout(timer);
                            callback();
                            isOnload = true;
                        } else {
                            timer = setTimeout(runCheck, cycleTime);
                        }
                    };
                    if (document.readyState === 'interactive') {
                        runCheck();
                        return
                    }

                    window.addEventListener('load', () => {
                        runCheck();
                    });
                }
            };
            Util.domReady(() => {
                let perfData = Util.getPerfData(); //拿到性能数据
                perfData.type = 'domReady';
                cb(perfData);
            });
            Util.onload(() => {
                let perfData = Util.getPerfData(performance.timing); //拿到性能数据
                perfData.type = 'onload';
                cb(perfData);
            });
        }
    };

    perf.init((perfData) => {
        console.log('perf init');
        console.log(perfData);
    });

}));
//# sourceMappingURL=bundle.umd.js.map
