(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    var perf = {
        init: (cb) => {
            cb();

            let performance = window.performance; //performance有些兼容性问题
            console.log(performance.timing);
            debugger
            
        }
    };

    perf.init(()=>{
        console.log('perf init');
    });

    console.log('feifei 123');

}));
//# sourceMappingURL=bundle.umd.js.map
