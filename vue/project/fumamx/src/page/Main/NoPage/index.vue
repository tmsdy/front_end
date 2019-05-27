<template>
    <div class="NoPage">
        <div class="NoPage-container">
            <div class="NoPage-main">
                <h3>
                    <strong>404</strong>无法打开页面
                </h3>
                <div class="NoPage-actions">
                    <div>
                        <h4>可能原因：</h4>
                        <ol>
                            <li>没有权限访问</li>
                            <li>当前网络信号弱</li>
                            <li>找不到请求的页面</li>
                        </ol>
                    </div>
                    <div>
                        <h4>可以尝试：</h4>
                        <ul>
                            <li><router-link class="transition_all" to="/main/workbench">返回工作台页</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .NoPage{padding:150px 0}
    .NoPage-container{position:relative;z-index:1}
    .NoPage-main{position:relative;background:#f9f9f9;margin:0 auto;width:617px;-ms-box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:50px 50px 70px}
    .NoPage-main:before{content:'';display:block;height:7px;position:absolute;top:-7px;width:100%;left:0}
    .NoPage-main h3{font-size:24px;font-weight:400;border-bottom:1px solid #d0d0d0}
    .NoPage-main h3 strong{font-size:54px;font-weight:400;margin-right:20px}
    .NoPage-main h4{font-size:20px;font-weight:400;color:#333;margin-bottom:8px;}
    .NoPage-actions{font-size:0;z-index:100}
    .NoPage-actions div{font-size:14px;display:inline-block;padding:30px 0 0 10px;width:50%;-ms-box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;color:#838383}
    .NoPage-actions ol{list-style:decimal;padding-left:20px}
    .NoPage-actions li{line-height:2em}
    .NoPage-actions li a {color:#008cee;padding-left:3px}
    .NoPage-actions li a:hover {color:#222;padding-left: 13px;}
    .NoPage-actions:before{content:'';display:block;position:absolute;z-index:-1;bottom:17px;left:50px;width:200px;height:10px;-moz-box-shadow:4px 5px 31px 11px #999;-webkit-box-shadow:4px 5px 31px 11px #999;box-shadow:4px 5px 31px 11px #999;-moz-transform:rotate(-4deg);-webkit-transform:rotate(-4deg);-ms-transform:rotate(-4deg);-o-transform:rotate(-4deg);transform:rotate(-4deg)}
    .NoPage-actions:after{content:'';display:block;position:absolute;z-index:-1;bottom:17px;right:50px;width:200px;height:10px;-moz-box-shadow:4px 5px 31px 11px #999;-webkit-box-shadow:4px 5px 31px 11px #999;box-shadow:4px 5px 31px 11px #999;-moz-transform:rotate(4deg);-webkit-transform:rotate(4deg);-ms-transform:rotate(4deg);-o-transform:rotate(4deg);transform:rotate(4deg)}
</style>
