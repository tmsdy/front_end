/*


4.webpack的主要改造
    1）配了less和postcss，引入了公共的less
        单独抽取css，压缩css,js,
    2）支持es6、7及其以上的语法，对象扩展运算符、解构、装饰器、动态import
        babelrc文件加了容易报错
    3）加了alias公共的别名
    4）在package.json里面加了这个就大部分的能加前缀了
        "browserslist": [
            "last 2 versions",
            "> 1% in CH",
            "not ie <= 8"
        ],

5.把积分h5的跳app、登录、一些工具、公共组件等功能搬过来了

6.从先获取到后端返回数据再去转改造成先转得到数据后再去跑到对应位置
    1）后端接口性能不行，单抽400ms+连抽3倍的延迟，当时版本改来不及，得前端做优化
    2）去掉了Pro成功返回promiseLock锁，提高400ms左右响应速度
    3）charles开了最低网速限流，跑起来跟正常网速效果差不多
处理：点击同时请求和转动，拉长曲线保证跑起来效果不变全程时长加大(第一段动效)，接近全程前要是还没请求到数据就显示网络不给力
    若请求到数据了就停止当前动效，衔接到下一段动效

7.用transition: transform .8s; 造成页面文字模糊抖动

8.加eslint
    1）装eslint插件配置里配"eslint.options": {
        "configFile": ".eslintrc"
    },
    2）创建.eslintrc文件
    3）https://www.npmjs.com/package/babel-eslint 记得全局装下babel-eslint不然插件找不到


*/