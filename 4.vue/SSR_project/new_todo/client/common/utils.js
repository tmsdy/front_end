
const getUrl = function(url) {
    console.log(this)
    url = url + 'xxxxxxxxxxx'
    return url
}

let date = null;

const init = function() {
    date = new Date();
}

export {
    getUrl,
    init
}