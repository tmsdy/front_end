<template>
    <div>
        <!-- 插入开发信 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1542789391152')" :visible.sync="dialogLook" :closeOnClickModal="false" custom-class="width920" :modal-append-to-body="false" v-loading="loading">
            <div class="divbox">
                <div class="rightdiv">
                    <div class="contendiv">
                        <iframe ref="iframePC" src="/static/mail/view.html" @load="loadedContent" class="MXscroll" scrolling="auto" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>
                    </div>
                    <div class="actiondiv">
                        <!-- 确定 -->
                        <el-button type="primary" @click="submitAdd()">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
                        <!-- 取消 -->
                        <el-button @click="dialogLook=false">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    </div>
                </div>
                <div class="leftdiv">
                    <div class="serachdiv">
                        <el-input v-model="inputValue" placeholder="搜索开发信" :on-icon-click="handleIconClick" style="width:95%" icon="search"></el-input>
                    </div>
                    <div class="treediv">
                        <div v-for="(item,index) in options" :key="item.invokeName" :class="active==index?'activerow  text-hover':'row text-hover'" @click="changeLetter(index)"> {{item.subject}}</div>
                    </div>
                </div>

            </div>

        </el-dialog>
        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { isArray } from '@/libs/utils.js'
import editorPreview from '@/components/editorPreview/index' // 预览
export default {
    name: 'DialogDevelopmentLetter',
    props: {
    },
    data() {
        return {
            options: [],
            dialogLook: false,
            loading: false,
            selectValue: '',
            inputValue: '',
            active: 0,
            iframeShow: false,
            content: ''
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        changeLetter(index) {
            this.active = index
            this.selectValue = this.options[index].invokeName
            this.isShowTemplate(this.selectValue)
        },
        loadedContent() {
            this.iframeShow = true
            this.$refs.iframePC.contentWindow.initHtml(this.content) // PC
        },
        isShowTemplate(TemplateID) {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_one, {
                params: { invokeName: TemplateID }
            })
                .then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            let backData = res.body.data
                            // console.log(backData)
                            // console.log(backData)
                            this.content = backData.html
                            if (this.iframeShow) {
                                this.loadedContent()
                            }
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        },
        handleIconClick() {
            this.gettemplate_list()
        },
        openDialog() {
            this.dialogLook = true
            this.loading = true
            this.inputValue = ''
            this.gettemplate_list()
        },
        gettemplate_list() {
            let _this = this
            let data = {
                pageN: 1, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                pageSize: 1000,
                emailType: 1
            }
            if (this.inputValue != '') {
                data.keyword = this.inputValue
            }
            if (this.ownersSelect != '') {
                data.subCtId = _this.company.ctId
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.template_list, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.tmplList && isArray(res.body.data.tmplList)) {
                        _this.options = res.body.data.tmplList
                        _this.selectValue = _this.options[0].invokeName
                        _this.isShowTemplate(_this.selectValue)
                    } else {
                        _this.options = []
                    }
                    _this.loading = false
                } else {
                    _this.loading = false
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        submitAdd() {
            // tmplContent_Get
            let _this = this
            let data = {
                tmplInvokeName: _this.selectValue
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.tmplContent_Get, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.dialogLook = false
                    _this.loading = false
                    let htmlst = res.body.data.html
                    this.$emit('TemplateAddChange', htmlst)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
    },
    components: {
        'editor-preview': editorPreview
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.divbox {
    height: 550px;
    .leftdiv {
        border: 1px rgba(228, 228, 228, 1) solid;
        border-right: none;
        width: 25%;
        height: 100%;
        .serachdiv {
            height: 10%;
            border-bottom: 1px rgba(228, 228, 228, 1) solid;
            padding: 10px 5px;
        }
        .treediv {
            margin-top: 25px;
            height: 85%;
            overflow-y: auto;
            .row {
                padding: 6px;
                border: 1px solid transparent;
                background: #ffff;
            }
            .activerow {
                padding: 6px;
                border: 1px solid transparent;
                background: #e4e1e1;
            }
        }
    }
    .rightdiv {
        width: 75%;
        float: right;
        border: 1px rgba(228, 228, 228, 1) solid;
        height: 100%;
        .contendiv {
            height: 90%;
            border-bottom: 1px rgba(228, 228, 228, 1) solid;
        }
        .actiondiv {
            height: 10%;
            text-align: center;
            /* margin-bottom: 5px; */
            padding: 12px;
        }
    }
}
.tableClass {
    width: 100%;
    td {
        padding: 15px 10px;
        // border: 1px red solid;
        .tdTitle {
            display: inline-block;
            padding: 10px;
        }
    }
}
.dialogFooter {
    text-align: center;
    margin-bottom: 5px;
}
</style>
