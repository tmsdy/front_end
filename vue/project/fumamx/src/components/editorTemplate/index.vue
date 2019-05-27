<template>
    <div class="TemplateEditor" v-if="visible">
        <div class="zoneHeader" v-if="showHeader">
            <el-form :inline="true">
                <el-form-item class="pull-right">
                    <!-- 取消 -->
                    <el-button @click="calcelEdit()">{{$t('fumamx-web-templateeditor.1531901134034')}}</el-button>
                    <!-- 预览 -->
                    <el-button @click="toPreview()">{{$t('fumamx-web-templateeditor.1531901186688')}}</el-button>
                    <!-- 确定 -->
                    <el-button type="primary" @click="submitAdd()" v-if="isAdd">{{$t('fumamx-web-templateeditor.1531901211609')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" @click="submitEdit()" v-else>{{$t('fumamx-web-templateeditor.1531901466047')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="zoneBody" :style="{'top': showHeader ? '45px' : '0'}">

            <div class="zoneLeft" v-loading="loading">
                <iframe ref="iframe" src="/static/mail/dragEdit/index.html" @load="loadedContent" class="MXscroll" scrolling="auto" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>
            </div>

            <div class="zoneRight MXscroll">

                <div class="rightHome" :class="[isOpenRightMain ? 'zIndexMain' : '']">
                    <el-form v-if="showHeader">
                        <!-- 邮件主题 -->
                        <el-form-item class="is-required" :label="$t('fumamx-web-templateeditor.1531894805040')">
                            <!-- 请输入邮件主题 -->
                            <el-input v-model="addTempSubject" ref="addTempSubject" :maxlength="100" :placeholder="'('+$t('mxpcweb.systemset.bizfield.1530328470247')+') '+$t('mxpcweb.companyregister.1528875730696',{a:100})"></el-input>
                        </el-form-item>
                        <!-- 邮件摘要 -->
                        <el-form-item :label="$t('fumamx-web-templateeditor.1531895008420')">
                            <!-- 请输入邮件摘要 -->
                            <el-input v-model="addTempSummary" ref="addTempSummary" :maxlength="20" :placeholder="'('+$t('fumamx-web-templateeditor.1533090068719')+') '+$t('mxpcweb.companyregister.1528875730696',{a:20})"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-tabs v-model="activeName1">
                        <!-- 模块 -->
                        <el-tab-pane :label="$t('fumamx-web-templateeditor.1533284247606')" name="first" class="editContent">
                            <!-- 模块添加组件 -->
                            <module-to-add @click="moduleToAddItem" />
                        </el-tab-pane>
                        <!-- 邮件样式 -->
                        <el-tab-pane :label="$t('fumamx-web-templateeditor.1531893821580')" name="second" class="editContent">
                            <el-form label-width="80px" label-position="left">
                                <!-- 邮件背景 -->
                                <el-form-item :label="$t('fumamx-web-templateeditor.1531895037068')">
                                    <el-color-picker v-model="mailBgColor" @change="mailBgColorChange"></el-color-picker>
                                </el-form-item>
                                <!-- 正文背景 -->
                                <el-form-item :label="$t('fumamx-web-templateeditor.1531895051916')">
                                    <el-color-picker v-model="mailContBgColor" @change="mailBodyBgColorChange"></el-color-picker>
                                </el-form-item>
                                <!-- 边框宽度 -->
                                <el-form-item :label="$t('fumamx-web-templateeditor.1531895065324')">
                                    <el-input-number size="small" v-model="mailBdW" @change="mailBdWChange" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                                <!-- 边框颜色 -->
                                <el-form-item :label="$t('fumamx-web-templateeditor.1531895082115')">
                                    <el-color-picker v-model="mailBdColor" @change="mailBorderColorChange"></el-color-picker>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="rightHome">
                    <el-tabs v-model="activeName2">
                        <!-- 内容编辑 -->
                        <el-tab-pane :label="$t('fumamx-web-templateeditor.1531895098868')" name="first" class="editContent">
                            <!-- 图片编辑 -->
                            <edit-pic :attachments="attachments" @change="changeEditPic" ref="refEditPic" v-if="attachments.length > 0" />
                            <!-- 文本编辑 -->
                            <ueditor v-if="moduleHtml != ''" :config="config" :converContent="moduleHtml" ref="ueditor" @ready="editorReady" :moduleCode="moduleCode" style="margin:0 15px;"></ueditor>
                            <!-- 编辑商品 -->
                            <edit-goods @change='goodsEdit' :goodsDom="editingDomArr" v-if="editingDomArr[0].className && editingDomArr[0].className == 'moduleGoods'" />
                        </el-tab-pane>
                        <!-- 模块样式 -->
                        <el-tab-pane :label="$t('fumamx-web-templateeditor.1531895119923')" name="second" class="editContent">
                            <module-style @change="setModuleStyle" :editingDomArr="editingDomArr" v-if="editingDomArr[0].className != ''" />
                        </el-tab-pane>
                        <!-- 模块设置 -->
                        <el-tab-pane :label="$t('fumamx-web-templateeditor.1531895624090')" name="fourth" class="editContent">
                            <module-set @change="setModuleSet" :editingDomArr="editingDomArr" v-if="editingDomArr[0].className != ''" />
                        </el-tab-pane>
                    </el-tabs>
                    <div class="zoneSure">
                        <el-button type="primary" style="padding:8px 30px;" @click="submitContentEdit()">完成</el-button>
                        <dl>
                            <dt>提示：</dt>
                            <dd>输入 <strong>$</strong> 可以弹出菜单选择插入模块相关字段 </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>
    </div>
</template>

<script>
import editorPreview from '@/components/editorPreview/index' // 预览
import UEditor from '@/components/UEditor/component.vue' // 编辑器
import moduleToAdd from './moduleToAdd/index' // 添加模块
import editGoods from './editGoods/index' // 编辑商品
import editPic from './editPic/index' // 编辑图片
import moduleStyle from './moduleStyle/index' // 模板样式
import moduleSet from './moduleSet/index' // 模板设置
export default {
    name: 'TemplateEditor',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        TemplateID: {
            type: String,
            default: ''
        },
        showHeader: {
            type: Boolean,
            default: true // 是否显示头部操作
        }
    },
    data() {
        return {
            loading: false,
            attachments: [], // 图片附件数据
            addTempIndex: -1, // 新增时的模板index，只有新增时会>=0，可用来判断状态是编辑还是新增
            addTempName: '',
            addTempSubject: '',
            addTempSummary: '',
            addTempType: 0, // 0：触发，1：批量
            addTempIsPublic: '0', // 是否公开模板，0为仅自己，1为全体人员
            currentHtml: '', // 正在编辑的邮件html

            moduleCode: '', // 选字段的模块号
            // 编辑器配置
            config: {
                initialContent: '请输入内容', // 初始化编辑器的内容
                initialFrameHeight: 320, // 内容初始高度
                toolbars: [[// 'source', '|',
                    'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
                    'horizontal', 'removeformat', 'formatmatch', '|',
                    'inserttable', '|', 'insertfield'
                ]]
            },
            ueflag: 0,
            moduleHtml: '', // 正在编辑的模块html

            addTemplateCss: '<style>.templateWrap ul,.templateWrap li{list-style:none;margin:0;padding:0}.templateWrap{font-family:-apple-system,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",Arial,sans-serif;-webkit-font-smoothing:antialiased;padding:12px 0;color:#666}.templateWrap a{text-decoration:none}.templateWrap .template{background-color:#fff;max-width:600px;margin:0 auto}.templateWrap .template .moduleList{min-width:120px;position:relative}.templateWrap table{border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%}.templateWrap table.col3 td{width:33.33333%}.templateWrap table.col2 td{width:50%}.templateWrap .template .moduleItem{position:relative}.templateWrap .template .moduleItem .imageBox .imageObj img{width:100%}.templateWrap .template .moduleItem .imageBox .imageObj .btnPic{display:none}.templateWrap .M_scrawl{border:0;border-radius:3px;background:#008cee;color:#fff;font-size:12px;margin-right:3px}@media only screen and (max-width:640px){.templateWrap{padding:0!important}.templateWrap table td{display:block!important;width:100%!important}}.moduleGoods td{width:50%}.goodsListCard .goodsItem{display:inline-block;width:290px;margin-bottom:15px;font-size:14px;vertical-align:top}.goodsListCard .goodsItem:nth-child(2n){float:right}.goodsListCard .goodsItem .goodsPic{width:290px;height:290px;background-color:#eee;overflow:hidden}.goodsListCard .goodsItem .goodsName{margin:8px 0 2px;color:#303133}.goodsListCard .goodsItem .goodsDescr{color:#909399}.goodsListCard .goodsItem .goodsPrice{color:red}.goodsListLine .goodsItem{clear:both;margin-bottom:15px;font-size:15px}.goodsListLine .goodsItem .goodsPic{width:200px;height:200px;margin-right:15px;float:left}.goodsListLine .goodsItem .goodsName{margin:8px 0 2px;color:#303133}.goodsListLine .goodsItem .goodsDescr{color:#909399}.goodsListLine .goodsItem .goodsPrice{color:red}</style>',
            addTemplateDiv: [
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
            ],
            activeName1: 'first', // 活动TAB
            activeName2: 'first', // 活动TAB
            isOpenRightMain: true, // 打开主层的活动TAB
            mailBgColor: '#fff',
            mailContBgColor: '#fff',
            mailBdW: 0,
            mailBdColor: '#888',
            randomObj: {
                edit: 'edit_' + new Date().getTime(),
                toPic: 'toPic_' + new Date().getTime(),
                del: 'del_' + new Date().getTime()
            },
            language: this.$i18n.locale,
            editingDomArr: [{className: ''}], // 正在编辑的模块dom
            isAdd: false, // 当前是新增&编辑
            templateMarketId: '' // 模板市场所选ID
        }
    },
    created() {
        window[this.randomObj.del] = (_this) => {
            this.module_del(_this)
        }
        window[this.randomObj.toPic] = (_this) => {
            this.getPic(_this) // 打开浏览图片
        }
        window[this.randomObj.edit] = (_this) => {
            let root = $(_this).closest('.moduleItem')

            this.editingDomArr = $(root[0].children[0])
            // console.log('this.editingDomArr[0]')
            // console.log(root)
            // console.log(this.editingDomArr)
            // console.log(this.editingDomArr[0])

            this.editCurrentModel(root)
        }
    },
    methods: {
        // 图片变更
        changeEditPic(item) {
            this.$refs.iframe.contentWindow.updatePic(item) // 页面更新展示
        },
        // 设置模板样式
        setModuleStyle(obj) {
            this.$refs.iframe.contentWindow.setModuleStyle(obj)
        },
        setModuleSet(obj) {
            this.$refs.iframe.contentWindow.setModuleSet(obj)
        },
        // 商品操作
        goodsEdit(list, config) {
            this.$refs.iframe.contentWindow.goodsEdit(list, config)
        },
        // 点击 添加一个模块
        moduleToAddItem(item) {
            this.$refs.iframe.contentWindow.addOneModule(item.id)
        },
        // 是否，关掉编辑
        calcelEdit() {
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = this.$t('fumamx-web-templateeditor.1531903987620') // 将关闭当前编辑器？
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            }).then(() => {
                this.closeEditor()
            }).catch(() => { })
        },
        // 取消，清零
        closeEditor() {
            this.$emit('update:visible', false)
            this.addTempName = this.addTempSubject = this.addTempSummary = this.currentHtml = ''

            this.attachments = [] // 图片清空
            this.mailBgColor = this.mailContBgColor = this.bgColor = '#fff'

            this.isOpenRightMain = true
            this.addTempIndex = '-1'
            this.ueflag = 0
        },
        // 预览
        toPreview() {
            let html = this.$refs.iframe.contentWindow.getMail()
            this.$refs.preview.isShowEditor(html)
            this.isOpenRightMain = true
        },
        // 模块删除，带确认
        module_del(current) {
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = this.$t('fumamx-web-templateeditor.1531904437472') // 确定删除这个模块吗？
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            }).then(() => {
                this.$refs.iframe.contentWindow.delCurrent()
                this.isOpenRightMain = true
            }).catch(() => { })
        },
        // 边框颜色 ========================================================== 邮件
        mailBorderColorChange(val) {
            if (this.mailBdW == 0) {
                this.$message(this.$t('fumamx-web-templateeditor.1531904722668')) // 请调整边框宽度
            }
            this.$refs.iframe.contentWindow.mailBorderColorChange(val)
        },
        // 边框宽度
        mailBdWChange(val) {
            this.$refs.iframe.contentWindow.mailBdWChange(val, this.mailBdColor)
        },
        // 正文背景
        mailBodyBgColorChange(val) {
            this.$refs.iframe.contentWindow.mailBodyBgColorChange(val)
        },
        // 邮件背景
        mailBgColorChange(val) {
            this.$refs.iframe.contentWindow.mailBgColorChange(val)
        },
        // 编辑器加载完成时 ========================================================== 编辑器
        editorReady(instance) {
            // this.instance = instance
            this.ueflag++
            instance.setContent(this.moduleHtml)
            // 内容变化时：
            instance.addListener('contentChange', () => {
                console.log('UE 监听...')
                try {
                    this.$refs.iframe.contentWindow.updateModuleHtml(instance.getContent())
                } catch (e) {
                    console.log('this.$refs.iframe.contentWindow.updateModuleHtml(instance.getContent())' + e)
                }
            })
        },
        // iframe 加载出来后：
        loadedContent() {
            let _this = this
            // _this.$refs.iframe.contentWindow.initHtml(_this.currentHtml, _this.randomObj) // iframe加载工具
            // return
            // 新增
            if (this.isAdd) {
                if (this.addTempIndex >= 0) {
                    // 来自默认模板
                    let html = this.addTemplateDiv.filter((item) => {
                        return item.id == this.addTempIndex
                    })
                    if (html.length > 0) {
                        switch (this.language) {
                            case 'zh-tw':
                                this.currentHtml = this.addTemplateCss + html[0].content.tw
                                break
                            case 'en':
                                this.currentHtml = this.addTemplateCss + html[0].content.en
                                break
                            default:
                                this.currentHtml = this.addTemplateCss + html[0].content.cn
                        }
                    }
                    _this.$refs.iframe.contentWindow.initHtml(_this.currentHtml, _this.randomObj) // iframe加载工具
                    _this.loading = false
                } else {
                    // 来自模板市场
                    this.$http.get(this.Global.baseURL + this.Global.api.v2.templateMarket, {
                        params: {
                            type: 'detail',
                            templateId: this.templateMarketId
                        }
                        }).then(res => {
                            _this.loading = false
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                _this.currentHtml = res.body.data.templateUrl
                            //   console.log(res.body.data.templateUrl)
                               _this.$refs.iframe.contentWindow.initHtml(_this.currentHtml, _this.randomObj) // iframe加载工具
                            } else {
                            this.$message.error(res.body.msg)
                            }
                        }, res => {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        })
                }
            } else {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_one, { params: { invokeName: this.TemplateID } }).then(function (res) {
                    _this.loading = false
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        let backData = res.body.data
                        // console.log(backData)
                        _this.addTempName = backData.name
                        _this.addTempSubject = backData.subject
                        _this.addTempSummary = backData.summary
                        _this.addTempType = backData.type
                        _this.currentHtml = backData.html
                        _this.addTempIsPublic = backData.isPublic
                        _this.moduleCode = backData.moduleCode
                        _this.$refs.iframe.contentWindow.initHtml(_this.currentHtml, _this.randomObj) // iframe加载工具
                    } else {
                        console.log('返回数据有误')
                        _this.$message.error(res.body.msg)
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }
        },
        // 编辑当前点击的模块 =============================================================== 点击编辑 模块
        editCurrentModel(_this, picsIndex) {
            // console.log('eeeed')
            this.activeName2 = 'first'
            this.isOpenRightMain = false

            let editing = $(_this)

            let isTxt = editing.find('.moduleTxt')
            let hasPic = editing.find('.imageObj')

            // 如有文本
            this.moduleHtml = isTxt.length ? isTxt.html() : '' // 如为空编辑器会隐藏

            // 如有图片，把图片放进数组，>0 图片控件出现
            this.attachments = [] // 先清空一下
            if (hasPic.length) {
                // 图片工具打开
                for (var i = 0; i < hasPic.length; i++) {
                    let thisObj = $(hasPic[i])
                    let img = thisObj.find('img')[0]
                    let a = thisObj.find('a')[0]
                    this.attachments.push([{
                        url: img ? $(img).attr('src') : '',
                        link: a ? $(a).attr('href') : '',
                        showLink: false
                    }])
                }
            }
            // console.log(this.attachments)
            if (picsIndex !== undefined && typeof picsIndex === 'number') {
                this.$nextTick(() => {
                    this.$refs.refEditPic.pickPic(picsIndex)
                })
            }
        },
        // 图片上传 ========================================================== 图片
        getPic(_this) {
            console.log('图片上传')
            let root = $(_this).closest('.moduleItem')
            let picsIndex = $(root).find('.imageObj').index($(_this).parent()) // 取到所点图片index
            this.editCurrentModel(root, picsIndex)
        },
        // 外面来调用的
        addOneTemp(option) {
            this.isAdd = true
            // console.log(option)
            this.addTempName = option.name
            this.addTempType = option.type
            this.addTempIsPublic = option.IsPublic
            this.moduleCode = option.moduleCode
            // console.log(option)
            if (option.id && option.id != '') {
                this.addTempIndex = option.id
            } else {
                this.templateMarketId = option.templateMarketId
            }
        },
        // 来自模板市场，减库存
        useTemplateMarket() {
            let data = {
                templateId: this.templateMarketId,
                type: 'count'
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.templateMarket, data).then(
                res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        console.log(res.body)
                    } else {
                        this.$message.error(res.body.msg)
                    }
                },
                res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        // 提交检查
        submitCheck() {
            // let html = this.$refs.iframe.contentWindow.getMail() // 执行此可消除左编辑区活动红框
            this.isOpenRightMain = true // 打开主编辑
            if (this.addTempSubject == '') {
                this.$refs.addTempSubject.$refs.input.focus()
                this.$message(this.$t('fumamx-web-templateeditor.1531896646036')) // 请输入邮件主题
                return false
            }
            return true
        },
        // 提交新增
        submitAdd() {
            if (!this.submitCheck()) { return }
            let html = this.$refs.iframe.contentWindow.getMail()
            let _this = this
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.template_add, {
                'name': this.addTempName,
                'subject': this.addTempSubject,
                'summary': this.addTempSummary,
                'templateType': this.addTempType,
                'editType': 0,
                'htmlObject': {
                    'html': html
                },
                'isPublic': this.addTempIsPublic,
                'moduleCode': this.moduleCode
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(res.body.msg)
                    _this.$emit('success')
                    _this.closeEditor() // 关窗
                    if (this.templateMarketId != '') {
                        this.useTemplateMarket() // 来自模板市场，减库存
                    }
                } else {
                    _this.$message.error(res.body.msg)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 提交编辑
        submitEdit() {
            if (!this.submitCheck()) { return }
            let html = this.$refs.iframe.contentWindow.getMail()
            let _this = this
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.template_update, {
                'name': this.addTempName,
                'subject': this.addTempSubject,
                'summary': this.addTempSummary,
                'templateType': this.addTempType,
                'editType': 0,
                'htmlObject': {
                    'html': html
                },
                'invokeName': this.TemplateID,
                'moduleCode': this.moduleCode,
                'isPublic': this.addTempIsPublic
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(res.body.msg)
                    _this.$emit('success')
                    _this.closeEditor() // 关窗
                } else {
                    _this.$message.error(res.body.msg)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getEditHtml() {
            let html = this.$refs.iframe.contentWindow.getMail()
            return html
        },
        doEditHtml(val) {
            this.$refs.iframe.contentWindow.initHtml(val, this.randomObj) // iframe加载工具
        },
        submitContentEdit() {
            this.$refs.iframe.contentWindow.getMail()
            this.isOpenRightMain = true
        }
    },
    components: {
        'ueditor': UEditor,
        'editor-preview': editorPreview,
        'module-to-add': moduleToAdd,
        'edit-goods': editGoods,
        'edit-pic': editPic,
        'module-style': moduleStyle,
        'module-set': moduleSet
    },
    watch: {
        visible: function (newval) {
            if (newval) {
                this.loading = true
            } else {
                this.isAdd = false
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
