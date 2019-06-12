
export default {
    init: (cb) => {
        cb()

        let performance = window.performance //performance有些兼容性问题
        console.log(performance.timing)
        debugger
        
    }
}