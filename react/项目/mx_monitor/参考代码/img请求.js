/**
 2  * 上报数据
 3  *
 4  * @param {string} url 目标链接
 5  * @param {Object} data 上报数据
 6  */
function report(url, data) {
    if (!url || !data) {
        return;
    }
    // @see http://jsperf.com/new-image-vs-createelement-img
    var image = doc.createElement('img');
    var items = [];
    for (var key in data) {
        if (data[key]) {
            items.push(key + '=' + encodeURIComponent(data[key]));
        }
    }
    var name = 'img_' + (+new Date());
    entry[name] = image;
    image.onload = image.onerror = function () {
        entry[name] =
            image =
            image.onload =
            image.onerror = null;
        delete entry[name];
    };
    image.src = url + (url.indexOf('?') < 0 ? '?' : '&') + items.join('&');
}