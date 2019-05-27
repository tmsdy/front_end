<template>
    <div class="DialogSetTags">
        <!-- 标签管理 -->
        <el-dialog :title="$t('mxpcweb.mail.1531101421774')" :close-on-click-modal="false" :visible.sync="isOpen" custom-class="width520" :modal-append-to-body="false" v-dialogDrag>
            <div v-if="isMoreModule" style="margin:10px 0;">
                模块: <el-select v-model="moduleCode" @change="moduleChange()" placeholder="请选择">
                    <el-option v-for="(item,key) in modules" :key="key" :label="item.showName" :value="item.moduleCode">
                    </el-option>
                </el-select>
            </div>
            <div class="tagSelected">
                <!-- 暂无标签，请选择标签 -->
                <div class="noTag" v-if="selectedTagsItem.length<1">{{$t('mxpcweb.mail.1531101455222')}}</div>

                <el-tag type="primary" style="height:32px;line-height:32px;font-size:12px; border-radius: 16px;" @close="closeTag(item,index)" :closable="item.color!=11" v-for="(item,index) in selectedTagsItem" :key="index" :style="setBgColor(item.color)">{{item.labelName}}</el-tag>

            </div>

            <dl class="tagSet">
                <!-- 常见标签 -->
                <dt>{{$t('mxpcweb.mail.1531101476906')}}</dt>
                <dd>
                    <span v-for="(tag,index) in dynamicTags" :key="index">
                        <span v-if="tag.color!=11" :class="[tag.useFlag !=1 ? 'disabled' : '']" class="tagEdit" :style="setBgColor(tag.color)" @click="tagClick(tag)">
                            <span class="label">{{tag.labelName}}</span>
                            <input :value="tag.labelName" @blur="tagBlur">
                            <i v-if="tag.color!=11" :class="[tag.useFlag ==1 ? 'el-icon-edit' : '']" @click.stop="tagEditClick(tag)"></i>
                            <em v-if="tag.color!=11" class="iClose" @click.stop="handleClose(tag.labelId,index)">
                                <i class="iconfont icon-close"></i>
                            </em>
                        </span>
                    </span>
                    <el-input style="width:100px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"> </el-input>
                    <!-- 新增 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{$t('mxpcweb.mail.1531101578211')}}</el-button>
                </dd>
            </dl>
            <div class="text-center">
                <el-button class="footerButton" @click="isOpen = false">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                <!-- 保存 -->
                <el-button type="primary" @click="submit" :loading="submitLoading">
                    {{$t('mxpcweb.mail.1528786401856')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import { isArray, tagsBgColor } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'DialogSetTags',
    props: {

    },
    data() {
        return {
            isMoreModule: false,
            isOpen: false, // 弹窗开关
            dynamicTags: [], // 常规标签
            selectedTags: [], // 选中标签id
            selectedTagsBase: [], // 选中标签id备份
            selectedTagsItem: [], // 选中标签
            SaveTags: [], // 保存选中标签
            inputVisible: false, // 输入框显示
            inputValue: '', // 输入框值
            identFieldValue: '', // id
            editDialog: {
                labelEnName: '',
                labelName: '',
                labelId: '',
                description: '',
                useFlag: 1,
                color: ''
            },
            moduleCode: '', // 模块号
            modules: [],
            tagMap: {},
            mIds: [], // 邮件ID
            havingcolor: [], // 已拥有颜色
            itemObj: {}, // 数据对象
            submitLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    created() {

    },
    methods: {
        ...mapMutations('mail', {
            set_refurbishlabelList: 'SET_REFURBISHLABELLIST'
        }),
        moduleChange() {
            this.maillabelsGet()
            this.selectedTagsItem = [].concat((this.tagMap[this.moduleCode] || []))
        },
        // 父组件来调用
        isDialog(to) {
            if (to == 'open') {
                this.isOpen = true
                // 获取选中标签数组
                // 2个数组比较
                this.maillabelsGet()
            } else {
                this.isOpen = false
            }
        },
        // 编辑失去焦点时
        tagBlur() {
            let $this = $(event.target)
            $this.parent().removeClass('tagEditActive')
            let _this = this
            // 编辑
            let data = { moduleCode: _this.moduleCode, labelEnName: _this.editDialog.labelEnName, labelName: $this[0].value, labelId: _this.editDialog.labelId, description: _this.editDialog.description, useFlag: 1, color: _this.editDialog.color }
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.label_put, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.maillabelsGet()
                    _this.editDialog = { labelEnName: '', labelName: '', labelId: '', description: '', useFlag: 1, color: '' }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 编辑tag点击时
        tagEditClick(tag) {
            let $this = $(event.target)
            $this.parent().addClass('tagEditActive').find('input').focus()
            let _this = this
            _this.editDialog.labelEnName = tag.labelEnName
            _this.editDialog.labelId = tag.labelId
            _this.editDialog.description = tag.description
            _this.editDialog.useFlag = tag.useFlag
            _this.editDialog.color = tag.color
        },
        // 选择标签
        tagClick(tag) {
            if (tag.useFlag == 1) { // 未选择过
                let data = { labelId: tag.labelId, labelName: tag.labelName, color: tag.color, useFlag: 1 }
                this.selectedTagsItem.push(data)
                this.selectedTags.push(tag.labelId)
                tag.useFlag = 0// 颜色变灰 不允许再次选择
            }
        },
        // 选择标签移除
        closeTag(item, index) {
            for (let i = 0; i < this.selectedTags.length; i++) {
                const element = this.selectedTags[i]
                if (item.labelId == element) {
                    this.selectedTags.splice(i, 1)
                    break
                }
            }

            this.selectedTagsItem.splice(index, 1)
            for (let i = 0; i < this.dynamicTags.length; i++) {
                if (this.dynamicTags[i].labelName == item.labelName) {
                    this.dynamicTags[i].useFlag = 1// 颜色变蓝允许再次选择
                    break
                }
            }
        },
        // 列表标签移除
        handleClose(tagLabelId, index) {
            let _this = this
            _this.$http.delete(_this.Global.baseURL + _this.Global.api.v2.label_delete, { params: { moduleCode: _this.moduleCode, labelId: tagLabelId } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.havingcolor.splice(index, 1)
                    _this.dynamicTags.splice(index, 1)
                    this.set_refurbishlabelList(1)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 输入框出现
        showInput() {
            this.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
            this.inputType = 0
        },
        // 回车和失去焦点
        handleInputConfirm() {
            // debugger;
            let colorInt = -1
            let _this = this
            let inputValue = _this.inputValue
            let count = 0
            let lengthCount = this.havingcolor.length
            let bag = true
            for (let i = 1; i <= 10; i++) {
                count = 0
                bag = true
                for (let j = 0; j < this.havingcolor.length; j++) {
                    if (i == this.havingcolor[j]) {
                        bag = false
                        break
                    } else {
                        count++
                    }
                }
                if (bag == true && count == lengthCount) {
                    colorInt = i
                    break
                }
            }
            if (colorInt == -1) {
                colorInt = this.havingcolor[lengthCount - 1] + 1
                if (colorInt > 10) {
                    colorInt = colorInt % 10
                }
            }
            this.havingcolor.push(colorInt)
            if (inputValue) {
                // 添加
                let data = { color: colorInt, moduleCode: _this.moduleCode, labelName: inputValue, useFlag: 1 }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.label_add, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.dynamicTags.push(res.body.data)
                        _this.set_refurbishlabelList(1)
                    } else {
                        _this.inputValue = ''
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.inputValue = ''
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
            }
            this.inputVisible = false
            this.inputValue = ''
        },
        // 保存提交
        submit() {
            let _this = this
            // let { ctId, cId } = _this.company
            // if (_this.moduleCode == 'EM001' && _this.identFieldValue == '') {
            if (_this.identFieldValue == '') {
                _this.isDialog('c')
                _this.$emit('UpdataTagsData', _this.dynamicTags, _this.selectedTags, _this.selectedTagsItem, this.moduleCode)
                return
            }
            _this.SaveTags = []
            if (_this.selectedTags.join(',') == _this.selectedTagsBase.join(',')) {
                _this.$message('单据标签未发现变动，不能提交！')
                return false
            }
            _this.submitLoading = true
            let data = { moduleCode: _this.moduleCode, identFieldValue: _this.identFieldValue, labelIds: _this.selectedTags }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.billLabelPut, data).then(function (res) {
                _this.submitLoading = false
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.isDialog('c')
                    if (_this.moduleCode == 'EM001') {
                        _this.$emit('LastListCenter', [_this.identFieldValue], 'tages')
                    } else {
                        _this.$emit('UpdataListCenterData')
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.submitLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 获取用户标签列表
        maillabelsGet() {
            let _this = this
            _this.havingcolor = []
            _this.selectedTagsItem = []
            let selectedTags2 = _this.selectedTags
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.label_get, { params: { searchType: 'list', moduleCode: _this.moduleCode } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    let datas = res.body.data
                    let arry = []
                    for (let i = 0; i < datas.length; i++) {
                        for (let j = 0; j < selectedTags2.length; j++) {
                            if (datas[i].labelId == selectedTags2[j]) {
                                datas[i].useFlag = 0// 变灰，不允许再次选择
                                _this.selectedTagsItem.push({ labelId: datas[i].labelId, color: datas[i].color, labelName: datas[i].labelName })
                                break
                            }
                        }
                        if (datas[i].useFlag != 0) {
                            datas[i].useFlag = 1
                        }
                        _this.havingcolor.push(datas[i].color)
                        arry.push(datas[i])
                    }
                    _this.dynamicTags = arry
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 弹出标签框   id/item(当前单据对象)/moduleCode（模块号）
        DialogSetTagShow(id = '', tags = [], moduleCode = '', item = {}, pickTags = []) {
            this.identFieldValue = id
            this.selectedTags = Object.assign([], tags)
            this.selectedTagsBase = Object.assign([], tags)
            this.itemObj = item
            this.moduleCode = moduleCode// 当前模块号
            this.isDialog('open')
            this.selectedTagsItem = pickTags.concat() // 外面已选中的标签
        },
        DialogSetTagOpen(moduleCode = '', modules = {}, tagMap = {}) {
            this.isMoreModule = true
            this.moduleCode = moduleCode// 当前模块号
            this.selectedTags = []
            this.selectedTagsBase = []
            this.modules = modules
            this.tagMap = tagMap
            this.isDialog('open')
            this.selectedTagsItem = [].concat((tagMap[moduleCode] || []))
        },
        // 颜色设置
        colorSeting() {

        },
        // 背景色
        setBgColor(colorId) {
            return tagsBgColor(colorId)
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
