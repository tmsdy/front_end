let less = require('less')

module.exports = function (source) {
    let css
    less.render(source, (err, output) => { // 同步方法
        css = output.css
    })
    return css.replace(/\n/g, '\\n')
}