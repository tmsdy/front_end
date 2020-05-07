var viewHeight = document.documentElement.clientHeight; //可视区的高度

function lazyload() {
  var eles = document.querySelectorAll('img[data-original][lazyload]');
  eles.forEach((item, index) => {
    if (item.dataset.original === '') return;
    var rect = item.getBoundingClientRect();
    // console.log(rect)
    if (rect.bottom >= 0 && rect.top < viewHeight) {
      // !function(){
      var img = new Image();
      img.src = item.dataset.original;
      img.onload = function () {
        item.src = img.src
      }
      item.removeAttribute('data-original');
      item.removeAttribute('lazyload');
      // }()
    }
  })
}
lazyload();

document.addEventListener('scroll', lazyload);