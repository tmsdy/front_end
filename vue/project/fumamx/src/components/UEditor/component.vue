/*
 * Discription:
 * -----
 * Created Date: 2017-11-03 06:24:38
 * Author: 向士键
 * -----
 * Last Modified: 2019-05-05 03:40:33
 * Modified By: guobing (email)
 */
<template>
    <div class="component">
        <script :id="randomId" type="text/plain"></script>

        <template v-if="needComArr.includes('goods')">
            <!-- 添加商品 -->
            <goods-add ref="goodsAdd" title="选择商品" :isReturnData="true" :isMail="true" @goodsAddChange="goodsAddChange" />
            <!-- 商品预览 -->
            <dialog-commodity-view ref="DialogCommodityView" @Insertgoods="Insertgoods"></dialog-commodity-view>
        </template>

        <!-- 开发信 -->
        <dialog-development-letter v-if="needComArr.includes('letter')" ref="DialogDevelopmentLetter" @TemplateAddChange="TemplateAddChange"></dialog-development-letter>

        <!-- 模板 -->
        <dialog-template v-if="needComArr.includes('templet')" ref="DialogTemplate" @toAddTemplateDrag="toAddTemplateDrag"></dialog-template>

        <!-- 选字段 -->
        <dialog-field v-if="needComArr.includes('insertfield')" ref="dialogField" :moduleCode="moduleCode" :config="config" />

        <!--快速文本， 签名 -->
        <dialog-text v-if="needComArr.includes('inserttext')||needComArr.includes('insertautograph')" ref="dialogText" :SignatureArray="SignatureArray" :FastTextArray="FastTextArray"></dialog-text>
    </div>
</template>

<script>

// import '../../../static/UEditor/ueditor.config'
// import '../../../static/UEditor/ueditor.all'
// import '../../../static/UEditor/lang/zh-cn/zh-cn'
import goodsAdd from '../goodsAdd/index'
import DialogDevelopmentLetter from '../DialogDevelopmentLetter/index'
import DialogTemplate from '../DialogTemplate/index'
import DialogCommodityView from '../DialogCommodityView/index'
import dialogField from '@/components/editorTemplate/dialogField/index' // 选字段
import dialogText from '@/components/editorTemplate/dialogText/index'
import { isArray } from '@/libs/utils.js'
export default {
    name: 'UEditor',
    props: {
        // 传进来的配置
        config: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // 覆盖内容
        converContent: {
            type: String,
            default: function () {
                return ''
            }
        },
        // 选字段模块号
        moduleCode: {
            type: String,
            default: 'allModule'
        },
        closeInsertField: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            needComArr: [],
            SignatureArray: [],
            FastTextArray: [],
            currencyList: [],

            randomId: 'editor_' + new Date().getTime(),
            instance: null,
            language: this.$i18n.locale,
            addTemplateCss: '<style>.templateWrap ul,.templateWrap li{list-style:none;margin:0;padding:0}.templateWrap{font-family:-apple-system,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",Arial,sans-serif;-webkit-font-smoothing:antialiased;padding:12px 0;color:#666}.templateWrap a{text-decoration:none}.templateWrap hr{border:0;height:1px;background-color:#ddd}.templateWrap .template{background-color:#fff;max-width:600px;margin:0 auto}.templateWrap .template .moduleList{min-width:120px;position:relative}.templateWrap table{border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%}.templateWrap table.col3 td{width:33.33333%}.templateWrap table.col2 td{width:50%}.templateWrap .template .moduleItem{position:relative;padding:5px 0}.templateWrap .template .moduleItem>div{padding:5px 15px}.templateWrap .template .moduleItem .imageBox .imageObj img{width:100%}.templateWrap .template .moduleItem .imageBox .imageObj .btnPic{display:none}.templateWrap .M_scrawl{border:0;border-radius:3px;background:#008cee;color:#fff;font-size:12px;margin-right:3px}@media only screen and (max-width:640px){.templateWrap{padding:0!important}.templateWrap table td{display:block!important;width:100%!important}}.moduleGoods td{width:50%}.goodsListCard .goodsItem{display:inline-block;width:278px;margin-bottom:15px;font-size:14px;vertical-align:top}.goodsListCard .goodsItem:nth-child(2n-1){margin-right:9px}.goodsListCard .goodsItem .goodsPic{width:278px;height:278px;background-color:#eee;overflow:hidden}.goodsListCard .goodsItem .goodsName{margin:8px 0 2px;color:#303133}.goodsListCard .goodsItem .goodsDescr{color:#909399}.goodsListCard .goodsItem .goodsPrice{color:red}.goodsListLine .goodsItem{clear:both;margin-bottom:15px;font-size:15px}.goodsListLine .goodsItem .goodsPic{width:200px;height:200px;margin-right:15px;float:left}.goodsListLine .goodsItem .goodsName{margin:8px 0 2px;color:#303133}.goodsListLine .goodsItem .goodsDescr{color:#909399}.goodsListLine .goodsItem .goodsPrice{color:red}</style>',
            addTemplateDiv: Object.freeze([
                {
                    id: 0,
                    content: {
                        cn: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><div id="demoPlaceholder" style="text-align: center;padding-top:8px;color:#999">空白模板，可以在右侧工具栏添加模块</div></ul><ul class="moduleList" id="moduleList2"></ul><ul class="moduleList" id="moduleList3"></ul><ul class="moduleList" id="moduleList4"></ul><ul class="moduleList" id="moduleList5"></ul></div></div>',
                        tw: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><div id="demoPlaceholder" style="text-align: center;padding-top:8px;color:#999">空白模板，可以在右側工具欄添加模塊</div></ul><ul class="moduleList" id="moduleList2"></ul><ul class="moduleList" id="moduleList3"></ul><ul class="moduleList" id="moduleList4"></ul><ul class="moduleList" id="moduleList5"></ul></div></div>',
                        en: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><div id="demoPlaceholder" style="text-align: center;padding-top:8px;color:#999">A blank template that can be added to the right toolbar.</div></ul><ul class="moduleList" id="moduleList2"></ul><ul class="moduleList" id="moduleList3"></ul><ul class="moduleList" id="moduleList4"></ul><ul class="moduleList" id="moduleList5"></ul></div></div>'
                    }
                },
                {
                    id: 1,
                    content: {
                        cn: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用这个区域来为你的邮件内容提供一个简短的说明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。不用担心，你可以随时删除模块和重新布局。然后点击设计栏来定义字体、颜色和样式。</div></div></li></ul><div id="moduleList2"></div><div id="moduleList3"></div><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        tw: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用這個區域來為你的郵件內容提供一個簡短的說明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。不用擔心，你可以隨時刪除模塊和重新布局。然後點擊設計欄來定義字體、顔色和樣式。</div></div></li></ul><div id="moduleList2"></div><div id="moduleList3"></div><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        en: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">Use this area to provide a short description of your email content.</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail. Don"t worry, you can delete modules and re layout at any time. Then click the design bar to define fonts, colors and styles.</div></div></li></ul><div id="moduleList2"></div><div id="moduleList3"></div><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>'
                    }
                },
                {
                    id: 2,
                    content: {
                        cn: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用这个区域来为你的邮件内容提供一个简短的说明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。不用担心，你可以随时删除模块和重新布局。然后点击设计栏来定义字体、颜色和样式。</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。</div></div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。</div></div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        tw: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用這個區域來為你的郵件內容提供一個簡短的說明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。不用擔心，你可以隨時刪除模塊和重新布局。然後點擊設計欄來定義字體、顔色和樣式。</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。</div></div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。</div></div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        en: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">Use this area to provide a short description of your email content.</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail. don"t worry, you can delete modules and re layout at any time. Then click the design bar to define fonts, colors and styles.</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail.</div></div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail.</div></div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>'
                    }
                },
                {
                    id: 3,
                    content: {
                        cn: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用这个区域来为你的邮件内容提供一个简短的说明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。不用担心，你可以随时删除模块和重新布局。然后点击设计栏来定义字体、颜色和样式。</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。</div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。</div></div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        tw: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用這個區域來為你的郵件內容提供一個簡短的說明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。不用擔心，你可以隨時刪除模塊和重新布局。然後點擊設計欄來定義字體、顔色和樣式。</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。</div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。</div></div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        en: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">Use this area to provide a short description of your email content.</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail. don"t worry, you can delete modules and re layout at any time. Then click the design bar to define fonts, colors and styles.</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail.</div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail.</div></div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>'
                    }
                },
                {
                    id: 4,
                    content: {
                        cn: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用这个区域来为你的邮件内容提供一个简短的说明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。不用担心，你可以随时删除模块和重新布局。然后点击设计栏来定义字体、颜色和样式。</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div><div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div><div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        tw: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用這個區域來為你的郵件內容提供一個簡短的說明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。不用擔心，你可以隨時刪除模塊和重新布局。然後點擊設計欄來定義字體、顔色和樣式。</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div><div class="moduleTxt">這是你的文字說明，你可以在設置欄改變它的位置和寬度。</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div><div class="moduleTxt">這是你的文字說明，你可以在設置欄改變它的位置和寬度。</div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        en: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">Use this area to provide a short description of your email content.</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail. don"t worry, you can delete modules and re layout at any time. Then click the design bar to define fonts, colors and styles.</div></div></li></ul><table class="col2"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div><div class="moduleTxt">This is your text description. You can change its location and width in the settings bar.</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div><div class="moduleTxt">This is your text description. You can change its location and width in the settings bar.</div></li></ul></td></tr></table><div id="moduleList4"></div><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>'
                    }
                },
                {
                    id: 5,
                    content: {
                        cn: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用这个区域来为你的邮件内容提供一个简短的说明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">设计你的邮件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">轻松创建优雅的邮件</div><div>现在你已经选择了一个邮件模板，你可以拖拽内容模块来对你的邮件进行排版和布局。不用担心，你可以随时删除模块和重新布局。然后点击设计栏来定义字体、颜色和样式。</div></div></li></ul><table class="col3"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div><div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div><div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList4"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏览</span></div></div><div class="moduleTxt">这是你的文字说明，你可以在设置栏改变它的位置和宽度。</div></li></ul></td></tr></table><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        tw: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">使用這個區域來為你的郵件內容提供一個簡短的說明。</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">設計你的郵件</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">輕松創建優雅的郵件</div><div>現在你已經選擇了一個郵件模板，你可以拖拽內容模塊來對你的郵件進行排版和布局。不用擔心，你可以隨時刪除模塊和重新布局。然後點擊設計欄來定義字體、顔色和樣式。</div></div></li></ul><table class="col3"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div><div class="moduleTxt">這是你的文字說明，你可以在設置欄改變它的位置和寬度。</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div><div class="moduleTxt">這是你的文字說明，你可以在設置欄改變它的位置和寬度。</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList4"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">浏覽</span></div></div><div class="moduleTxt">這是你的文字說明，你可以在設置欄改變它的位置和寬度。</div></li></ul></td></tr></table><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>',
                        en: '<div class="templateWrap"><div class="template"><ul class="moduleList" id="moduleList1"><li class="moduleItem"><div class="moduleTxt">Use this area to provide a short description of your email content.</div></li><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div></li><li class="moduleItem"><div class="moduleTxt"><div style="font-size:33px;font-weight:bold;color:#666">Design your mail</div><div style="font-size:18px;font-weight:700;margin:5px 0;color:#666">Easy to create elegant mail</div><div>Now that you have chosen an email template, you can drag and drop the content module to typeset and layout your mail. don"t worry, you can delete modules and re layout at any time. Then click the design bar to define fonts, colors and styles.</div></div></li></ul><table class="col3"><tr><td valign="top"><ul class="moduleList" id="moduleList2"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div><div class="moduleTxt">This is your text description. You can change its location and width in the settings bar.</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList3"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div><div class="moduleTxt">This is your text description. You can change its location and width in the settings bar.</div></li></ul></td><td valign="top"><ul class="moduleList" id="moduleList4"><li class="moduleItem"><div class="imageBox"><div class="imageObj"><span class="btnPic" onclick="getPic(this)">browse</span></div></div><div class="moduleTxt">This is your text description. You can change its location and width in the settings bar.</div></li></ul></td></tr></table><ul class="moduleList" id="moduleList5"><li class="moduleItem"><div class="moduleTxt"><div style="padding:15px 0">Copyright © 2018 fumamx.com, All rights reserved.</div></div></li></ul></div></div>'
                    }
                }
            ])
        }
    },
    mounted() {
        this.initEditor()
        let dynamicComArr = ['goods', 'letter', 'templet', 'insertfield', 'inserttext', 'insertautograph']
        let tools = this.config.toolbars[0]

        for (let i = 0; i < dynamicComArr.length; i++) {
            const toolItemName = dynamicComArr[i]
            if (tools.includes(toolItemName)) {
                this.needComArr.push(toolItemName)
            }
        }

        if (this.needComArr.includes('goods')) {
            this.getCurrency()
        }

        if (this.needComArr.includes('insertautograph')) {
            this.getMailsSignature() // 获取签名
        }

        if (this.needComArr.includes('inserttext')) {
            this.getLetterList() // 获取快速文本数组
        }
    },
    destroyed() {
        try {
            this.instance && this.instance.destroy()
            this.instance = null
        } catch (e) {
            console.log('this.instance.destroy' + e)
        }

        // 组件销毁的时候，要销毁 UEditor 实例
        // if (this.instance !== null && this.instance.destroy) {
        //   this.instance.destroy();
        // }
    },
    methods: {
        // 获取签名
        getMailsSignature() {
            let url = this.Global.baseURL + this.Global.api.SystemSet.mailset.sign.getMailsSignature
            this.$http.get(url, { params: { type: 'my', pageN: 1, pageSize: 100 } })
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK &&
                        isArray(res.body.data.signInfos) &&
                        res.body.data.signInfos.length > 0) {
                        this.SignatureArray = res.body.data.signInfos
                    }
                })
        },
        /**
         * 获取快速文本列表
         */
        getLetterList(resolve) {
            const url = this.Global.baseURL + this.Global.api.SystemSet.mailset.fastText.getFastTextList
            this.$http.get(url, { params: { type: 'all' } })
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data) && res.body.data.length > 0) {
                        this.FastTextArray = res.body.data
                    } else if (res.body.code.toString() == this.Global.RES_OK) {
                        // _this.defaultTemplateList = [];
                        resolve && resolve([])
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message.error(this.$t(this.$t(this.Global.errorTitle)))
                })
        },
        initEditor() {
            // eslint-disable-next-line
            let _this = this

            this.$nextTick(() => {
                this.instance = UE.getEditor(this.randomId, Object.assign({

                    initialContent: '请输入内容编辑', // 初始化编辑器的内容

                    autoClearinitialContent: true, // 是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
                    initialFrameWidth: null, // 内容初始高度 null为全屏
                    autoHeightEnabled: false, // 高度是否自增长
                    elementPathEnabled: false, // 是否启用元素路径，默认是true显示
                    autoFloatEnabled: false, // 工具栏漂浮
                    wordCount: false, // 是否开启字数统计
                    zIndex: 1, // 编辑器层级的基数,默认是900（一般不要开启）
                    UEDITOR_HOME_URL: '/static/UEditor/',
                    lang: this.language,
                    langPath: '/static/UEditor/lang/',
                    serverUrl: '/ueditor/ue',
                    serverUrlNode: this.Global.uploadUrl, // 图片上传接口
                    imagesUrlNode: this.Global.imgBaseSrc, // 图片展示接口
                    enableAutoSave: false, // 自动保存，默认开启
                    saveInterval: 99999999,
                    disabledTableInTable: false, // 禁止表格嵌套
                    allowDivTransToP: false, // true 为 允许进入编辑器的div标签自动变成p标签
                    toolbars: [[
                        'fullscreen', 'source', '|', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
                        'bold', 'italic', 'underline', 'strikethrough', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
                        'simpleupload',
                        'horizontal', 'emotion', 'removeformat', 'formatmatch', 'autotypeset', '|',
                        'inserttable'
                    ]],
                    labelMap: {
                        'macros': '宏', 'goods': '商品', 'letter': '开发信', 'templet': '模板', 'insertfield': '插入模块字段', 'inserttext': '快速文本', 'insertautograph': '插入签名'
                    }
                }, this.config))

                this.instance.commands['macros'] = {
                    execCommand: function () {
                        let html = '<input type="button" id="Fumasoft_MailWrite_Default_Autograph" class="M_scrawl" value="默认签名"/>'
                        this.execCommand('insertHtml', html)
                        return true
                    }
                }

                this.instance.commands['goods'] = {
                    execCommand: () => {
                        this.$refs.goodsAdd.open()// 商品插入
                        return true
                    }
                }

                this.instance.commands['letter'] = {
                    execCommand: () => {
                        this.$refs.DialogDevelopmentLetter.openDialog()// 开发信插入
                        return true
                    }
                }

                this.instance.commands['templet'] = {
                    execCommand: () => {
                        this.$refs.DialogTemplate.openShow()
                        return true
                    }
                }

                // console.log(this.config.toolbars[0])
                // 有就执行
                // if (this.config.toolbars && this.config.toolbars.length > 0 && this.config.toolbars[0].indexOf('autograph') !== -1) {
                //   // console.log('ooo')
                // }
                // 邮件变量
                // let hover = this.language == 'en' ? 'Macro' : '宏'
                // UE.registerUI(hover, function(editor, uiName) {
                //     let dataObj = {
                //       MailToName: '收件人名字',
                //       MailToTitle: '收件人称谓',
                //       CustomerName: '收件人客户名称',
                //       CustBriefName: '收件人客户简称',
                //       CNSEXNAME: '收件人中文性别',
                //       ENSEXNAME: '收件人英文性别',
                //       NowDate: '当前日期',
                //       NowTime: '当前时间',
                //       CNEmpName: '人员英文名',
                //       ENEmpName: '人员中文名',
                //       DeptName: '部门名称',
                //       Job_Name: '职位名称',
                //       Mobile1: '电话1',
                //       Mobile2: '电话2',
                //       Home_Tel1: '家庭电话1',
                //       Home_Tel2: '家庭电话2',
                //       Email: 'Email',
                //       MSN: 'MSN',
                //       Skype: 'Skype',
                //       CompanyName: '公司中文名称',
                //       CompanyEName: '公司英文名称',
                //       CompanyTel: '公司总机',
                //       CompanyFax: '公司传真'
                //     }
                //     editor.registerCommand(uiName, {
                //         execCommand: function(cmdName, value) {
                //           //let html = '<input type="button" class="M_scrawl" name="%' + value + '%" value="' + dataObj[value] + '"/>'
                // let html = '%' + value + '%'
                //             this.execCommand('insertHtml', html)
                //         }
                //     })
                //     // 创建下拉菜单中的键值对
                //     var items = []
                //     for (var i = 0, ci; ci = Object.keys(dataObj)[i++];) {
                //         items.push({
                //             label: '' + ci,
                //             value: ci,
                //             renderLabelHtml: function () {
                //                 return '<div class="edui-label %%-label" style="line-height:2;padding:0 8px">' + (dataObj[this.label] || '') + '</div>' // %money%
                //             }
                //         })
                //     }
                //     // 创建下拉框
                //     var combox = new UE.ui.Combox({
                //         editor: editor,
                //         items: items,
                //         onselect: function (t, index) {
                //             editor.execCommand(uiName, this.items[index].value)
                //         },
                //         title: uiName,
                //         initValue: hover
                //     })

                //     return combox
                // })

                // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
                this.instance.addListener('ready', () => {
                    this.$emit('ready', this.instance)
                })
                this.instance.addListener('keydown', (type, event) => {
                    if (event.key == '$' && !this.closeInsertField) {
                        this.$refs.dialogField.isOpen(this.instance, event.key) // 选模块字段
                    }
                })
                this.instance.commands['insertfield'] = {
                    execCommand: () => {
                        if (!this.closeInsertField) {
                            this.$refs.dialogField.isOpen(this.instance) // 选模块字段
                        }
                        this.$emit('clickInsertField')
                        return true
                    }
                }
                this.instance.commands['inserttext'] = {
                    execCommand: () => {
                        if (!this.closeInsertField) {
                            this.$refs.dialogText.isOpen(this.instance, 2) // 文本
                        }
                        this.$emit('clickInsertField')
                        return true
                    }
                }
                this.instance.commands['insertautograph'] = {
                    execCommand: () => {
                        if (!this.closeInsertField) {
                            this.$refs.dialogText.isOpen(this.instance, 1) // 签名
                        }
                        this.$emit('clickInsertField')
                        return true
                    }
                }
            })
        },
        // 获取内容
        getContent() {
            return this.instance.getContent()
        },
        // 替换内容/或追加内容 true
        setContent(val, isAppendTo) {
            let _this = this
            try {
                if (_this.converContent != '') {
                    this.instance.focus()
                    this.instance.setContent(_this.converContent)
                }
            } catch (err) { }
        },
        // 清空
        clearContent() {
            this.instance.setContent('')
        },
        // 商品添加
        goodsAddChange(multipleSelection) {
            this.$refs.DialogCommodityView.showdialog(multipleSelection, this.currencyList)
        },
        Insertgoods(removAuto) {
            removAuto += '<div><br></div><div><br></div>'
            this.instance.focus()
            // this.instance.setContent(removAuto, true)
            this.instance.execCommand('inserthtml', removAuto)
            // this.instance.focus()
        },
        // 插入开发信
        TemplateAddChange(removAuto) {
            removAuto += '<style>.templateWrap .template {background-color: #fff;max-width: 600px;margin:0;}</style>'
            removAuto += '<div><br></div><div><br></div>'
            this.instance.focus()
            // this.instance.setContent(removAuto, true)
            // this.instance.focus()
            this.instance.execCommand('inserthtml', removAuto)
        },
        // 插入模板
        toAddTemplateDrag(addTempIndex) {
            let currentHtml = ''
            if (addTempIndex >= 0) {
                let html = this.addTemplateDiv.filter((item) => {
                    return item.id == addTempIndex
                })
                if (html.length > 0) {
                    switch (this.language) {
                        case 'zh-tw':
                            currentHtml = this.addTemplateCss + html[0].content.tw
                            break
                        case 'en':
                            currentHtml = this.addTemplateCss + html[0].content.en
                            break
                        default:
                            currentHtml = this.addTemplateCss + html[0].content.cn
                    }
                }
            }
            var removAuto = currentHtml + '<style>.templateWrap .template {background-color: #fff;max-width: 600px;margin:0;}</style>'
            removAuto += '<div><br></div><div><br></div>'
            this.instance.focus()
            // this.instance.setContent(removAuto, true)
            // this.instance.focus()
            this.instance.execCommand('inserthtml', removAuto)
        },
        getCurrency() {
            const url = this.Global.baseURL + this.Global.api.v2.dictionary + 'currency'
            this.$http.get(url)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.currencyList = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
        }

    },
    watch: {
        // 监听变化，来设置编辑器高
        'config.initialFrameHeight': function (val, oldVal) {
            setTimeout(() => {
                this.instance.setHeight(val - 72)// 去掉
                // console.log(_this.instance)
            }, 300)
        },
        /* 'config.initialFrameHeight': {
            handler: function (val, oldVal) {
                setTimeout(() => {
                    this.instance.setHeight(val - 72)// 去掉
                    // console.log(_this.instance)
                }, 300)
            },
            deep: true
        }, */
        converContent: function (newVal, oldVal) {
            this.setContent()
        }
    },
    components: {
        'goods-add': goodsAdd,
        'dialog-field': dialogField,
        'dialog-development-letter': DialogDevelopmentLetter,
        'dialog-template': DialogTemplate,
        'dialog-commodity-view': DialogCommodityView,
        'dialog-text': dialogText
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
