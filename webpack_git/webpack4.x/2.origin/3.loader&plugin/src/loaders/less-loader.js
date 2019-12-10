let less = require('less');

module.exports = function (source) {
  console.log('less-loader==================')
    less.render(source, (err, result) => {
        console.log(result.css);
        this.callback(err, result.css);
    });
}
