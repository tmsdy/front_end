
$.ajax({
    url: 'http://localhost:3003/api/detai',
    method: 'post',
    data: {
        a: '1',
        b: '2'
    },
    success: (res) => {
        console.log(res)
    }
})
fetch('http://localhost:3003/api/list').then(res => {
    console.log(res)
})
