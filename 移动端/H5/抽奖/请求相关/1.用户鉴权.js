/*
思路：在P00001和P00002的cookie中拿到userId，authCookie
1.cookie
    P00001: 8d9qlxHwPYBWwdZrg6Y47y0nIJhbnpGwnHynKAAJdjCeVm3tjjm1vSF7GMZ74ELQdouf41
    P00002: %7B%22uid%22%3A%221480418304%22%2C%22pru%22%3A1480418304%2C%22user_name%22%3A%2213162352330%22%2C%22nickname%22%3A%22%5Cu7528%5Cu6237583d6400%22%2C%22pnickname%22%3A%22%5Cu7528%5Cu6237583d6400%22%2C%22type%22%3A11%2C%22email%22%3A%22%22%7D

params = {
    userId: getUserId(),
    authCookie: getCookie('P00001'),
}
2.相关函数
    function getCookie (objname) {
        let arrstr = document.cookie.split("; ");
        for(let i = 0; i < arrstr.length; i++) {
            let temp = arrstr[i].split("=");
            if(temp[0] == objname)
                return unescape(temp[1]); //unescape() 函数可对通过 escape() 编码的字符串进行解码。
        }
        return '';
    };

    function getUserId() {
        let json = getCookie('P00002');
        if(json == '') {
            return ''
        }
        let _userId = JSON.parse(json).uid;
        if(userId != '' && userId != _userId) {
            userHasChanged = true;
        }
        userId = _userId;
        return _userId;
    }
    getCookie('P00002')：unescape('%7B%22uid%22%3A%221480418304%22%2C%22pru%22%3A1480…00%22%2C%22type%22%3A11%2C%22email%22%3A%22%22%7D')
用户信息：JSON.parse(getCookie('P00002'))的值为：
    {
        email: ""
        nickname: "用户583d6400"
        pnickname: "用户583d6400"
        pru: 1480418304
        type: 11
        uid: "1480418304"
        user_name: "13162352330"
    }

*/

