'use strict'
var fatherId = null
function addOneModule(id) {
    if (typeof id !== 'number') { return }
    $('html,body').animate({scrollTop: $(document).height()}, 'slow') // 拉到顶先
    $('.templateWrap').find('#demoPlaceholder').remove() // 移除提示
    let allAddmodules = [
        ['<li class="moduleItem" style="padding:5px 0 5px 0;">',
            '<div class="moduleTxt">这是一个文本模块，鼠标悬浮这里，可以编辑此模块。</div>',
        '</li>'],
        ['<li class="moduleItem" style="padding:10px 0 10px 0">',
            '<div class="moduleTxt"><hr style="border: none;height: 1px;background-color: #ddd;"></div>',
        '</li>'],
        ['<li class="moduleItem">',
        '<div class="imageBox">',
            '<div class="imageObj">',
                '<span class="btnPic" onclick="getPic(this)">浏览</span>',
            '</div>',
        '</div>',
        '</li>'],
        ['<li class="moduleItem">',
            '<table class="imageTable" border="0" cellpadding="0" cellspacing="0">',
                '<tr>',
                    '<td valign="top">',
                            '<div class="imageBox" style="margin:0 8px 0 0;">',
                                '<div class="imageObj">',
                                    '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                                '</div>',
                            '</div>',
                    '</td>',
                    '<td valign="top">',
                            '<div class="imageBox" style="margin:0 0 0 8px;">',
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
            '<div class="moduleTxt" style="padding:15px 0 15px 0;">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div>',
        '</li>'],
        ['<li class="moduleItem">',
            '<table class="imageTable" border="0" cellpadding="0" cellspacing="0">',
                '<tr>',
                    '<td valign="top">',
                        '<div class="imageBox">',
                            '<div class="imageObj">',
                                '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                            '</div>',
                        '</div>',
                    '</td>',
                    '<td valign="top">',
                        '<div class="moduleTxt" style="margin:0 0 0 15px;">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div>',
                    '</td>',
                '</tr>',
            '</table>',
        '</li>'],
        ['<li class="moduleItem">',
            '<table class="imageTable" border="0" cellpadding="0" cellspacing="0">',
                '<tr>',
                    '<td valign="top">',
                        '<div class="moduleTxt" style="margin:0 15px 0 0;">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div>',
                    '</td>',
                    '<td valign="top">',
                        '<div class="imageBox">',
                            '<div class="imageObj">',
                                '<span class="btnPic" onclick="getPic(this)">浏览</span>',
                            '</div>',
                        '</div>',
                    '</td>',
                '</tr>',
            '</table>',
        '</li>'],
        ['<li class="moduleItem" style="padding:15px 0 15px 0">',
        '<div class="moduleTxt">',
            '<div>Copyright © 2018 fumamx.com, All rights reserved.</div>',
        '</div>',
        '</li>'],

        ['<li class="moduleItem">',
        '<div class="moduleGoods">',
        '<div class="goodsListCard">',
        '<div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://sf.fumamx.com/img/orig/2,3d77417a2c0b"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsDescr">此处显示商品描述</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div><div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://sf.fumamx.com/img/orig/2,3d77417a2c0b"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsDescr">此处显示商品描述</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div><div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://sf.fumamx.com/img/orig/2,3d77417a2c0b"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsDescr">此处显示商品描述</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div><div class="goodsItem">',
        '                                <div class="goodsPic"><img width="100%" src="https://sf.fumamx.com/img/orig/2,3d77417a2c0b"></div>                                ',
        '                                <div class="goodsName">此处显示商品名称</div>',
        '                                <div class="goodsDescr">此处显示商品描述</div>',
        '                                <div class="goodsPrice">￥888.00</div>                                ',
        '                            </div>',
        '                        </div>',
        ' </div>',
        '</div>',
        '</li>']

    ]
    var module_html = $(allAddmodules[id - 1].join('')) // $把字符串转对象
    var target = $('.templateWrap').find('.moduleList').last()

    module_html.clone().appendTo(target) // prependTo()
    insetrToolbar() // 加载工具栏
}
// 选图片点击 ========================================================== 图片
function getPic(_this) {
    $('body').find('.template_editing').removeClass('template_editing')
    $(_this).closest('.moduleItem').addClass('template_editing')
    window.parent[fatherId.toPic](_this) // 传给vue
}
function getMail() {
    $('body').find('.template_editing').removeClass('template_editing')
    var html = $('body').html()
    return html
}
// 更新模块html`
function updateModuleHtml(val) {
    $('body').find('.template_editing .moduleTxt').html(val)
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
    copyObj.clone().removeClass('template_editing').insertAfter(copyObj)
}
// 删除模块
function module_del(_this) {
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
    $('body').html(html)
    fatherId = randomId // 随机 obj

    for (var i = 1; i <= 5; i++) {
        Sortable.create(document.getElementById('moduleList' + i), {
            group: 'group',
            handle: '.drag',
            animation: 150
        })
    }
    insetrToolbar() // 加载工具栏
    console.log('iframe 内容加载完成')
}
// 加载工具栏
function insetrToolbar() {
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
function updatePic(item) {
    var picLink = item.link !== '' ? item.link : item.url // 图片链接，没有给图片URL
    var img = '<a href="' + picLink + '" target="_blank"><img src="' + item.url + '" style="display:block;width:100%"></a>'
    var thisObj = $('body').find('.template_editing .imageObj')[item.index]
    $(thisObj).html(img)
}

// 商品编辑
function goodsEdit(data, config) {
  var thisObj = $('body').find('.template_editing .moduleGoods')
  var goodsShowStyle = config.goodsShowStyle == 1 ? 'goodsListCard' : 'goodsListLine'
  var goodsDescrStyle = config.goodsShowContent.indexOf('1') === -1 ? 'style="display:none"' : ''

  var goodsDom = '<div data="aaa123" config="' + JSON.stringify(config) + '" class="' + goodsShowStyle + '">'

  for (var i = 0; i < data.length; i++) {
    var price = data[i].salePrice ? data[i].salePrice : ''
    var goodsPicUrl = (data[i].imagesId && data[i].imagesId.length !== 0) ? (config.imgBlobalUrl + '500x500/' + data[i].imagesId[0]) : 'https://sf.fumamx.com/img/orig/2,3d77417a2c0b'
    goodsDom += '<div class="goodsItem"><a href="' + data[i].spuLink + '" target="_blank">'
    goodsDom += '<div class="goodsPic"><img src="' + goodsPicUrl + '" style="display:block;width:100%"></div>'
    goodsDom += '<div class="goodsName">' + data[i].spuName + '</div>'
    goodsDom += '<div class="goodsDescr" ' + goodsDescrStyle + '>' + data[i].displayDesc + '</div>'
    goodsDom += '<div class="goodsPrice">' + price + '</div>'
    goodsDom += '<div style="clear:both;"></div>'
    goodsDom += '</a></div>'
  }
  goodsDom += '</div>'
  $(thisObj).html(goodsDom)
}

// 设置模块样式
function setModuleStyle(obj) {
    $('body').find('.template_editing').css({
        'padding': obj.padding.top + 'px ' + obj.padding.right + 'px ' + obj.padding.bottom + 'px ' + obj.padding.left + 'px ',
        'margin': obj.margin.top + 'px ' + obj.margin.right + 'px ' + obj.margin.bottom + 'px ' + obj.margin.left + 'px ',
        'color': obj.color,
        'background-color': obj.background_color,
        'text-align': obj.text_align
    })
}
// 设置模块样式
function setModuleSet(obj) {
    $('body').find('.template_editing').css({
        'border-style': 'solid',
        'border-color': obj.border_color,
        'border-width': obj.border_width.top + 'px ' + obj.border_width.right + 'px ' + obj.border_width.bottom + 'px ' + obj.border_width.left + 'px ',
        'border-radius': obj.border_radius
    })
}
