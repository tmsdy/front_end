<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :modal-append-to-body="false" class="emailBox" :close-on-click-modal='true' v-if="dialogVisible">
        <div class="dialogWrap" v-loading="loading">
            <div class="box">
                <span style="margin-right:15px;" class="boxLabel">订阅者</span>
                <div class="boxchild">
                    <div class="box-header">
                        <span>
                            <el-tag :key="index" v-for="(tag,index) in checkList" :closable="true" :close-transition="false" @close="handleClose1(tag)">
                                {{tag.name?tag.name:tag.value}}
                            </el-tag>
                        </span>
                        <i @click="show3 = !show3">添加对象</i>
                    </div>
                    <div class="box-main MXscroll" v-show="show3" v-on:mouseleave="hiddenTabs">
                        <el-collapse-transition>
                            <div>
                                <el-tabs v-model="activeName" @tab-click="handleClick" class="tabBox">
                                    <el-tab-pane label="人员" name="first" v-if="empsArray.length > 0">
                                        <el-checkbox-group v-model="checkList" class="checkbox">
                                            <div v-for="(item,key) in empsArray" :key="key">
                                                <el-checkbox :label='item'>{{item.name}}</el-checkbox>
                                            </div>
                                        </el-checkbox-group>
                                    </el-tab-pane>
                                    <el-tab-pane label="角色" name="second" v-if="rolesArray.length > 0">
                                        <el-checkbox-group v-model="checkList" class="checkbox">
                                            <div v-for="(item,key) in rolesArray" :key="key">
                                                <el-checkbox :label='item'>{{item.value}}</el-checkbox>
                                            </div>
                                        </el-checkbox-group>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </el-collapse-transition>
                    </div>
                </div>
            </div>
            <div>
                <span class="formLeft">订阅周期</span>
                <el-radio-group v-model="cycle">
                    <el-radio :label="1">单次</el-radio>
                    <el-radio :label="2">每天</el-radio>
                    <el-radio :label="3">每周</el-radio>
                    <el-radio :label="4">每月</el-radio>
                </el-radio-group>
            </div>
            <div style="margin-top: 15px;">
                <el-date-picker v-model="single" type="datetime" placeholder="选择日期时间" default-time="9:00:00" v-show="cycle == 1" format="yyyy-MM-dd HH:mm">
                </el-date-picker>
                <el-time-picker v-show="cycle == 2" v-model="everyday" placeholder="任意时间点" format="HH:mm">
                </el-time-picker>
                <div v-show="cycle == 3">
                    <el-select v-model="weekday" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-time-picker v-model="weekeveryday" placeholder="任意时间点" format="HH:mm">
                    </el-time-picker>
                </div>
                <div v-show="cycle == 4">
                    <el-select v-model="monthday" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in monthdayList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-time-picker v-model="montheveryday" placeholder="任意时间点" format="HH:mm">
                    </el-time-picker>
                </div>
            </div>
            <div>
                <span class="formLeft">发送方式</span>
                <el-checkbox v-model="checked2" disabled>邮件</el-checkbox>
            </div>
            <div class="themeBox">
                <span class="formLeft">订阅信息</span>
                <span style="margin-right:15px;">主题</span>
                <el-input v-model="theme" placeholder="请输入内容"></el-input>
            </div>
            <div>
                <span class="formLeft">正文</span>
                <ueditor :config="config" @ready="editorReady" ref="ueditor" :closeInsertField="true"></ueditor>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveSubscribe" :loading="isLoading">保存并订阅</el-button>
                <el-button @click="dialogVisible = false">取消订阅</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import UEditor from '@/components/UEditor/component.vue' // 编辑器
export default {
    name: 'DialogSubscribe',
    data() {
        const generateData = _ => {
            const data = []
            for (let i = 1; i <= 31; i++) {
                data.push({
                    value: i,
                    label: `${i}号`
                })
            }
            return data
        }
        return {
            monthdayList: generateData(),
            monthday: '',
            weekeveryday: '',
            montheveryday: '',
            options: [{
                value: '1',
                label: '周一'
            }, {
                value: '2',
                label: '周二'
            }, {
                value: '3',
                label: '周三'
            }, {
                value: '4',
                label: '周四'
            }, {
                value: '5',
                label: '周五'
            }, {
                value: '6',
                label: '周六'
            }, {
                value: '7',
                label: '周日'
            }],
            activeName: 'first',
            checkList: [],
            show3: false,
            dialogVisible: false,
            dialogTitle: '订阅选项',
            cycle: 1,
            single: '',
            everyday: '',
            weekday: '',
            checked2: true,
            theme: '',
            // 编辑器配置
            config: {
                initialContent: '请输入内容', // 初始化编辑器的内容
                initialFrameHeight: 320, // 内容初始高度
                toolbars: [[// 'source', '|',
                    'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
                    'horizontal', 'removeformat', 'formatmatch', '|',
                    'inserttable'
                ]]
            },
            empsArray: [],
            rolesArray: [],
            isLoading: false,
            subscribeReport: {}, // 后端返回的订阅过的信息
            loading: false,
            isEdit: false,
            flagCheckList: false, // 标记订阅人员和角色是否改变
            cloneCheckKey: [] // 复制处理后后端返回的订阅人员和角色的key或ctId
        }
    },
    props: {
        subscriberAuthor: {
            type: Object,
            default: function () {
                return {}
            }
        },
        reportType: {
            type: Number,
            default: -1
        }
    },
    created() {
    },
    mounted() { },
    computed: {
        notProd() {
            return window.runtime != 'prod'
        }
    },
    watch: {
        subscriberAuthor(val, old) {
            this.empsArray = val.emps
            this.rolesArray = val.roles
            this.allEmps = []
            this.rolesArray.forEach(item => {
                this.allEmps.push(...item.result)
            })
            this.allEmps.push(...this.empsArray)
            if (this.empsArray.length == 0) {
                this.activeName = 'second'
            }
        },
        checkList(val, old) {
            let afterCheck = []
            val.forEach(item => {
                let obj = {}
                if (item.hasOwnProperty('key')) {
                    obj['key'] = item.key
                } else if (item.hasOwnProperty('ctId')) {
                    obj['ctId'] = item.ctId
                }
                afterCheck.push(obj)
            })
            if (JSON.stringify(afterCheck) != JSON.stringify(this.cloneCheckKey)) {
                this.flagCheckList = true
            } else {
                this.flagCheckList = false
            }
        }
    },
    methods: {
        // 获取订阅信息
        getSubscribe() {
            this.loading = true
            var param = this.$route.query
            let params = {
                reportId: param.selected,
                reportType: this.reportType
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.subscribe, { params: params })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // 判断有没有订阅过
                        if (JSON.stringify(res.body.data) != '{}') {
                            this.isEdit = true // 是否是编辑状态
                            this.subscribeReport = res.body.data.subscribeReport
                            this.theme = this.subscribeReport.title
                            this.cycle = this.subscribeReport.type // 订阅周期
                            this.setTimeData()
                            // 订阅角色
                            let roleId = this.subscribeReport.roleIdList
                            // 在全部可以订阅角色中过滤出之前选择过的角色
                            if (roleId.length > 0) {
                                let returnRole = []
                                roleId.forEach(item => {
                                    let filter = this.rolesArray.filter(ele => ele.key == item)
                                    returnRole.push(filter[0])
                                })
                                this.checkList.push(...returnRole)
                            }
                            // 在全部可以订阅人员中过滤出之前选择过的人员
                            // 订阅人员
                            let ctId = this.subscribeReport.ctIdList
                            if (ctId.length > 0) {
                                let returnEmps = []
                                ctId.forEach(item => {
                                    let filter = this.empsArray.filter(ele => ele.ctId == item)
                                    returnEmps.push(filter[0])
                                })
                                this.checkList.push(...returnEmps)
                            }
                            this.checkList.forEach(item => {
                                let obj = {}
                                if (item.hasOwnProperty('key')) {
                                    obj['key'] = item.key
                                } else if (item.hasOwnProperty('ctId')) {
                                    obj['ctId'] = item.ctId
                                }
                                this.cloneCheckKey.push(obj)
                            })
                        } else {
                            this.isEdit = false
                        }
                        console.log('++', res.body.data)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.loading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                        // reject('统一数据返回失败')
                    }
                )
        },
        setTimeData() {
            switch (this.cycle) {
                case 1:
                    this.single = this.subscribeReport.deliverTime
                    break
                case 2:
                    this.deliverDate = 0
                    this.everyday = '2019-05-23 ' + this.subscribeReport.deliverTime + ':00'
            }
        },
        saveSubscribe() {
            // console.log(this.$m_unifiedTime(this.everyday))
            let roleIdList = []
            let ctIdList = []
            if (this.checkList.length == 0) {
                this.$message.error('请选择订阅者')
                return false
            } else {
                this.checkList.forEach(item => {
                    if (item.hasOwnProperty('key')) { // 角色
                        roleIdList.push(item.key)
                    } else if (item.hasOwnProperty('ctId')) {
                        ctIdList.push(item.ctId)
                    }
                })
            }
            if (this.theme == '') {
                this.$message.error('请输入主题')
                return false
            }
            var param = this.$route.query
            let parames = {
                reportId: param.selected,
                type: this.cycle,
                deliverType: 1,
                title: this.theme,
                reportType: this.reportType
            }
            let text = '请选择订阅时间段'
            switch (this.cycle) { // 根据选择周期类型不同对应不同deliverDate
                case 1:
                    if (this.single == '') {
                        this.$message.error(text)
                        return false
                    }
                    parames.deliverDate = 0
                    parames.deliverTime = this.$moment(this.single).format('HH:mm')
                    break
                case 2:
                    if (this.everyday == '') {
                        this.$message.error(text)
                        return false
                    }
                    parames.deliverDate = 0
                    parames.deliverTime = this.$moment(this.everyday).format('HH:mm')
                    break
                case 3:
                    if (this.weekday == '' || this.weekeveryday == '') {
                        this.$message.error(text)
                        return false
                    }
                    parames.deliverDate = this.weekday
                    parames.deliverTime = this.$moment(this.weekeveryday).format('HH:mm')
                    break
                case 4:
                    if (this.monthday == '' || this.montheveryday == '') {
                        this.$message.error(text)
                        return false
                    }
                    parames.deliverDate = this.monthday
                    parames.deliverTime = this.$moment(this.montheveryday).format('HH:mm')
                    break
            }
            if (roleIdList.length > 0) {
                parames.roleIdList = roleIdList
            }
            if (ctIdList.length > 0) {
                parames.ctIdList = ctIdList
            }
            parames.value = this.instance.getContent()
            if (!this.isEdit) { // 新增订阅
                this.postSubscribe(parames)
            } else { // 编辑订阅
                // isChange除订阅人员和角色以外的其他字段是否改变 true是没改变
                let isChange = parames.value == this.subscribeReport.value && parames.type == this.subscribeReport.type && parames.deliverDate == this.subscribeReport.deliverDate && parames.deliverTime == this.subscribeReport.deliverTime
                console.log(isChange, this.flagCheckList)
                if (!isChange || this.flagCheckList) { // 改变过
                    this.postSubscribe(parames)
                } else {
                    this.$message('暂无需要保存的修改')
                }
            }
        },
        postSubscribe(parames) {
            this.isLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.v1.subscribe, {
                subscribe: parames
            })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(res.body.msg)
                        this.dialogVisible = false
                    } else {
                        this.$message.error(this.msg(res.body))
                        this.dialogVisible = false
                    }
                },
                    res => {
                        this.isLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        hiddenTabs() {
            this.show3 = false
        },
        handleClose1(tag) {
            this.checkList.splice(this.checkList.indexOf(tag), 1)
        },
        handleIconClick(ev) {
            console.log(ev)
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
        open() {
            this.dialogVisible = true
            this.getSubscribe()
        },
        // handleClose() {
        //     this.dialogVisible = false
        //     $('.v-modal').click()
        // },
        handleSelect() {
            // console.log(this.textarea)
        },
        // 编辑器加载完成时
        editorReady(instance) {
            let email = '<div>尊敬的%sign%,您好</div>'
            this.instance = instance
            if (this.subscribeReport.hasOwnProperty('value')) {
                email = this.subscribeReport.value
            }
            instance.setContent(email)
        }
    },
    components: {
        ueditor: UEditor
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.tabBox {
    width: 100%;
    .el-tabs__item {
        width: 50%;
    }
    .el-tabs__nav {
        width: 100%;
    }
}
</style>
