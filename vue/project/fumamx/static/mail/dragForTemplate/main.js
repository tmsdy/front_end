'use strict'
var fatherId = null
function addModule(id) {
    console.log(' jkjk ')
    console.log(id)
    if (typeof id !== 'number') { return }
    $('html,body').animate({scrollTop:0},'slow'); // 拉到顶先
    $('.templateWrap').find('#demoPlaceholder').remove(); // 移除提示
    let modules = [
        ['<li class="moduleItem">',
            '<div class="moduleTxt">这是一个文本模块，鼠标悬浮这里，可以编辑此模块。</div>',
        '</li>'],
        ['<li class="moduleItem">',
            '<div class="moduleTxt"><hr></div>',
        '</li>'],
        ['<li class="moduleItem">',
        '<div class="imageBox">',
            '<div class="imageObj">',
                '<span class="btnPic" onclick="getPic(this)">浏览</span>',
            '</div>',
        '</div>',
        '</li>'],
        ['<li class="moduleItem">',
            '<table>',
                '<tr>',
                    '<td valign="top" style="padding:0 15px;">',
                            '<div class="imageBox">',
                                    '<div class="imageObj">',
                                        '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                                    '</div>',
                                '</div>',
                    '</td>',
                    '<td valign="top" style="padding:0 15px;">',
                            '<div class="imageBox">',
                                    '<div class="imageObj">',
                                        '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                                    '</div>',
                                '</div>',
                    '</td>',
                '</tr>',
            '</table>',
        '</li>'],
        ['<li class="moduleItem">',
            '<div class="imageBox">',
                '<div class="imageObj">',
                    '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                '</div>',
            '</div>',
            '<div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div>',
        '</li>'],
        ['<li class="moduleItem">',
            '<table>',
                '<tr>',
                    '<td valign="top" style="padding:0 15px;">',
                        '<div class="imageBox">',
                            '<div class="imageObj">',
                                '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                            '</div>',
                        '</div>',
                    '</td>',
                    '<td valign="top" style="padding:0 15px;">',
                        '<div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div>',
                    '</td>',
                '</tr>',
            '</table>',
        '</li>'],
        ['<li class="moduleItem">',
            '<table>',
                '<tr>',
                    '<td valign="top" style="padding:0 15px;">',
                        '<div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div>',
                    '</td>',
                    '<td valign="top" style="padding:0 15px;">',
                        '<div class="imageBox">',
                            '<div class="imageObj">',
                                '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                            '</div>',
                        '</div>',
                    '</td>',
                '</tr>',
            '</table>',
        '</li>'],
        ['<li class="moduleItem">',
        '<div class="moduleTxt">',
            '<div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div>',
        '</div>',
        '</li>'],

        ['<li class="moduleItem">',
        '<div class="moduleGoods">',
        '<div class="goodsListCard">',
        '<div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://up.fumamx.com/v2/image/1,08deb6d949a8/@100"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div><div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://up.fumamx.com/v2/image/1,08deb6d949a8/@100"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div><div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://up.fumamx.com/v2/image/1,08deb6d949a8/@100"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div><div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://up.fumamx.com/v2/image/1,08deb6d949a8/@100"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div>',
        '                        </div>',
        ' </div>',
        '</div>',
        '</li>']

    ]
    // console.log(id)
    var module_html = $(modules[id - 1].join('')) // $字符串转对象
    // console.log(module_html)
    var target = $('.templateWrap').find('.moduleList')[0]
    module_html.clone().prependTo(target)
    insetrToolbar() // 加载工具栏
}
// 选图片点击 ========================================================== 图片
function getPic(_this) {
    // console.log('ppp')
    $('body').find('.template_editing').removeClass('template_editing')
    $(_this).closest('.moduleItem').addClass('template_editing')
    window.parent[fatherId.toPic](_this) // 传给vue
}
function getMail() {
    $('body').find('.template_editing').removeClass('template_editing')
    // $('body').find('.toolbar').remove()
    var html = $('body').html()
    // console.log(html)
    return html
}
// 更新模块html`
function updateModuleHtml(val) {
    $('body').find('.template_editing .moduleTxt').html(val)
    // console.log(val)
}
// 模块文字位置 ========================================================== 模块
function moduleTextColorChange(val) {
    $('body').find('.template_editing').css('color', val)
}
// 模块背景
function moduleBgColorChange(val) {
    $('body').find('.template_editing').css('background-color', val)
}
function modulePositionChange(val) {
    $('body').find('.template_editing').css('text-align', val)
}
// 模块上边框
function moduleBorderTopChange(val, bdColor) {
    $('body').find('.template_editing').css({ 'border-top-width': val, 'border-top-style': 'solid', 'border-top-color': bdColor })
}
// 模块下边框
function moduleBorderBottomChange(val, bdColor) {
    $('body').find('.template_editing').css({ 'border-bottom-width': val, 'border-bottom-style': 'solid', 'border-bottom-color': bdColor })
}
function moduleBorderLeftChange(val, bdColor) {
    $('body').find('.template_editing').css({ 'border-left-width': val, 'border-left-style': 'solid', 'border-left-color': bdColor })
}
function moduleBorderRightChange(val, bdColor) {
    $('body').find('.template_editing').css({ 'border-right-width': val, 'border-right-style': 'solid', 'border-right-color': bdColor })
}
// 模块边框色
function moduleBdColorChange(val) {
    $('body').find('.template_editing').css('border-color', val)
}
// 模块圆角
function moduleBdRadiusChange(val) {
    $('body').find('.template_editing').css('border-radius', val)
}
// 邮件边框颜色 ========================================================== 邮件
function mailBorderColorChange(val) {
    $('body').find('.templateWrap .template').css('border-color', val)
}
// 邮件主边框宽度
function mailBdWChange(val, bdColor) {
    $('body').find('.templateWrap .template').css('border-width', val)
    $('body').find('.templateWrap .template').css('border-color', bdColor)
    $('body').find('.templateWrap .template').css('border-style', 'solid')
}
// 正文背景
function mailBodyBgColorChange(val) {
    $('body').find('.templateWrap .template').css('background-color', val)
}
// 邮件背景
function mailBgColorChange(val) {
    $('body').find('.templateWrap').css('background-color', val)
}
// 复制模块 ============================================================= 模块操作
function module_clone(_this) {
    var copyObj = $(_this).parent().parent()
    // $(_this).parent().parent().find('.toolbar').remove();
    copyObj.clone().removeClass("template_editing").insertAfter(copyObj)
}
// 删除模块
function module_del(_this) {
    // $(_this).parent().parent().remove();
    window.parent[fatherId.del](_this)
}
// 删除模块，绕过来再删
function delCurrent() {
    $('body').find('.template_editing').remove()
}
// 编辑模块
function hightLight(_this) {
    $('body').find('.template_editing').removeClass('template_editing')
    $(_this).parent().parent().addClass('template_editing')
}
// 初始模板 内容 ============================================================= 初始化
function initHtml(html, randomId) {
    $("body").html(html)
    fatherId = randomId // 随机 obj

    for (var i = 1; i <= 5; i++) {
        Sortable.create(document.getElementById("moduleList" + i), {
            group: "group",
            handle: ".drag",
            animation: 150,
        });
    }
    insetrToolbar() // 加载工具栏
    console.log('iframe 内容加载完成')
}
// 加载工具栏
function insetrToolbar(){
    var toolbar = ['<div class="toolbar">',
        '             <span class="drag"><i class="iconfont icon-move"></i></span>',
        '             <span class="edit" onclick="hightLight(this);window.parent.' + fatherId.edit + '(this)"><i class="iconfont icon-edit"></i></span>',
        '             <span class="copy" onclick="hightLight(this);module_clone(this);"><i class="iconfont icon-copy"></i></span>',
        '             <span class="del"  onclick="hightLight(this);module_del(this)"><i class="iconfont icon-del"></i></span>',
        '       </div>'].join('')
    $('body').find('.moduleList .moduleItem').hover(function () {
        $(this).append(toolbar)
    }, function () {
        $(this).find('.toolbar').remove()
    })
}
// 图片更新
function updatePic(val, baseUrl, index) {
    // console.log(val)
    if (val.length === 0) { return }
    var picObj = val[val.length - 1] // 原为追加的，故取最后一个
    var picUrl = baseUrl + picObj.url + '/640,640'
    var img = '<img src="' + picUrl + '" title="' + picObj.name + '">'
    var thisObj = $('body').find('.template_editing .imageObj')[index]
    $(thisObj).html(img)
}

// aaa
// function goodsEdit(fn) {
//     console.log(fn)
//     // function test() {
//     //     alert('ppp')
//     // }
// }

function myFunc()
    {
        console.log(11111);
    }
//     test("myFunc");
// 
function dynamicFun(funcName) {
    if (typeof(eval(funcName)) == "function") {        
        eval(funcName+"();");
    } else {
        console.log(' fun 不存在 ')
    }
}
// 商品编辑
function goodsEdit(data, config) {
//   console.log('jjj--- --- ')
  var globalPicUrl = 'https://aapi.laifuyun.com/v2/image/'
  var thisObj = $('body').find('.template_editing .moduleGoods')
  console.log(data)
  console.log(config)
  
  var goodsShowStyle = config.goodsShowStyle == 1 ? 'goodsListCard' : 'goodsListLine'
  var goodsDescrStyle = config.goodsShowContent.indexOf('1') === -1 ? 'style="display:none"' : ''

  var goodsDom = '<div data="'+ JSON.stringify(data) +' " config="' + JSON.stringify(config) + '" class="' + goodsShowStyle + '">'

  data.forEach((item) => {
      var price = item.salePrice ? '￥' + item.salePrice : ''
      var goodsPicId = (item.imagesId && item.imagesId.length !== 0) ? item.imagesId[0] : '1,08deb6d949a8'
      goodsDom += '<div class="goodsItem"><a href="' + item.spuLink + '" target="_blank">'
      goodsDom += '<div class="goodsPic"><img width="100%" height="100%" src="' + globalPicUrl + goodsPicId + '/@100"></div>'
      goodsDom += '<div class="goodsName">' + item.spuName + '</div>'
      goodsDom += '<div class="goodsDescr" ' + goodsDescrStyle + '>' + item.displayDesc + '</div>'
      goodsDom += '<div class="goodsPrice">' + price + '</div>'
      goodsDom += '<div style="clear:both;"></div>'
      goodsDom += '</a></div>'
  })
  goodsDom += '</div>'
  // console.log(goodsDom)
  $(thisObj).html(goodsDom)
}
