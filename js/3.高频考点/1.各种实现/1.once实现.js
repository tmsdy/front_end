var oBtn = document.getElementById('button');

once(oBtn, 'click', function () {
    console.log(222)
})

function once(dom, event, callback) {
    dom.addEventListener(event, handle)
    function handle() {
        callback();
        dom.removeEventListener(event, handle);
    }
} 