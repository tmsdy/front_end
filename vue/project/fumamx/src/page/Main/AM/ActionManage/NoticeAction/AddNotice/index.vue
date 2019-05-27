<template>
    <div class="AddNotice">
        <page-detail :detailTitle="isModify?'修改提醒通知':'新建提醒通知'" @toList="pageBack()"></page-detail>
        <div class="mainBox MXscroll">
            <el-form ref="noticeForm" :model="noticeForm" :rules="rules" label-position="left" label-width="100px">
                <el-form-item label="关联模块" prop="moduleCode">
                    <el-select class="longItem" :disabled="isModify" v-model="noticeForm.moduleCode" @change="moduleChange" :loading="isLoadingModules">
                        <el-option v-for="(item,index) in modules" :key="index" :label="item.showName" :value="item.moduleCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主题" prop="subject">
                    <!--  <el-input class="longItem" v-model="noticeForm.subject" placeholder="请输入"></el-input> -->
                    <div ref="subject" class="longItem subject" contenteditable="true" placeholder="请输入" v-html="subjectStrShow"> </div>
                    <el-popover v-model="insertPopoverShow" placement="bottom" trigger="click" width="200">
                        <el-select value-key="showName_ph" v-model="selRelyModule" @change="relyModuleChange" :loading="isLoadingRelyModules" placeholder="请选择">
                            <el-option v-for="(item,index) in relyModules" :key="index" :label="item.showName" :value="item">
                            </el-option>
                        </el-select>
                        <el-select value-key="fieldName_ph" v-model="selField" @change="moduleFieldChange" :loading="isLoadingModuleFields" placeholder="请选择" style="margin-top:10px;">
                            <el-option v-for="(item,index) in moduleFields" :key="index" :label="item.showName" :value="item">
                            </el-option>
                        </el-select>
                        <span class="insetFieldBtn" slot="reference">插入字段</span>
                    </el-popover>
                </el-form-item>
                <el-form-item label="提醒时间" prop="timeValue">
                    <div class="longItem  noticeTimeBox clearfix">
                        <el-select class="remindTimeItem remindTime01 " v-model="noticeForm.remindTime.moduleDateKey" :loading="isLoadingDateFields" placeholder="请选择">
                            <el-option v-for="(item,index) in dateFields" :key="index" :label="item.showName" :value="item.fieldName_ph">
                            </el-option>
                        </el-select>
                        <template v-if="!isExecNow">
                            <el-select class="remindTimeItem remindTime02" v-model="noticeForm.remindTime.calculateType" placeholder="请选择">
                                <el-option v-for="(val,key) in calcType" :key="key" :label="val" :value="key">
                                </el-option>
                            </el-select>
                            <el-select v-if="noticeForm.remindTime.timeType=='m'" class="remindTimeItem remindTime03" v-model="noticeForm.remindTime.timeValue" placeholder="请选择">
                                <el-option v-for="(val,index) in [15,30,45]" :key="index" :label="val" :value="val">
                                </el-option>
                            </el-select>
                            <el-input v-else class="remindTimeItem remindTime03 " type="number" v-model="noticeForm.remindTime.timeValue"></el-input>
                            <el-select class="remindTimeItem remindTime04 " v-model="noticeForm.remindTime.timeType">
                                <el-option v-for="(val,key) in timeType" :key="key" :label="val" :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </el-form-item>
                <el-form-item label="提醒谁" prop="remind" class="clearfix">
                    <div class="longItem personBox">
                        <p class="persionItem" v-for="(item,index) in noticeForm.remindFields" :key="index+'a'">
                            {{getShowName(item)}}
                            <i @click="removeRemindField(index)" class="iconfont icon-close-bold removeBtn"></i>
                        </p>
                        <p class="persionItem" v-for="(val,index) in noticeForm.remindCtIds" :key="index+'b'">
                            {{contactList[val]}}
                            <i @click="removeRemindCtId(index)" class="iconfont icon-close-bold removeBtn"></i>
                        </p>
                    </div>
                    <el-popover v-model="popoverShow" placement="bottom" trigger="click" width="200">
                        <el-select v-model="selRemindField" value-key="fieldName_ph" :loading="isLoadingRemindFields" @change="remindFieldChange" placeholder="请选择">
                            <el-option v-for="(item,index) in remindFields" :disabled="isSelected(item)" :key="index" :label="item.showName" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-if="hasNextControl" clearable v-model="selPerson" filterable placeholder="请选择" @change="remindCtIdChange" style="margin-top:10px;">
                            <el-option v-for="(val,key) in contactList" :key="key" :disabled="noticeForm.remindCtIds.includes(key)" :label="val" :value="key">
                            </el-option>
                        </el-select>
                        <span class="addPersonBtn" slot="reference">添加人员</span>
                    </el-popover>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="isSaving" @click="saveForm()">保存</el-button>
                    <el-button @click="resetForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageDetail from '@/components/PageDetail/index' // 大标题
export default {
    name: 'AddNotice',
    data() {
        var checkTime = (rule, value, callback) => {
            let { remindTime } = this.noticeForm
            if (!remindTime.moduleDateKey) {
                return callback(new Error('请选择提醒时间类型'))
            }
            if (remindTime.timeValue === '') {
                return callback(new Error('时间值不能为空'))
            }
            setTimeout(() => {
                if (remindTime.timeValue < 0) {
                    callback(new Error('不能小于0'))
                } else {
                    callback()
                }
            }, 200)
        }
        var checkRemind = (rule, value, callback) => {
            if (this.noticeForm.remindFields.length <= 0 &&
                this.noticeForm.remindCtIds.length <= 0) {
                callback(new Error('请选择提醒人'))
            } else {
                callback()
            }
        }
        return {
            isModify: false,
            popoverShow: false,
            insertPopoverShow: false,
            isSaving: false,
            isLoadingModules: false,
            isLoadingDateFields: false,
            isLoadingRelyModules: false,
            isLoadingModuleFields: false,
            isLoadingRemindFields: false,
            modules: [],
            allFields: [],
            relyModules: [],
            moduleFields: [],
            dateFields: [],
            remindFields: [],
            selField: '',
            selRelyModule: '',
            selRemindField: '',
            selPerson: '',
            subjectStrShow: '',
            subjectStrHide: '',
            noticeForm: {
                moduleCode: '',
                subject: '',
                remindTime: {
                    moduleDateKey: '',
                    calculateType: '1',
                    timeValue: 15,
                    timeType: 'm'
                },
                remindFields: [],
                remindCtIds: []
            },
            hasNextControl: false,
            timeType: { m: '分钟', h: '小时', d: '天', wd: '工作日' },
            calcType: { 1: '加', 2: '减' },
            rules: {
                moduleCode: [
                    { required: true, message: '请选择关联模块', trigger: 'change' }
                ],
                subject: [
                    { required: true, message: '请输入主题', trigger: 'blur' }
                ],
                timeValue: [
                    { required: true, validator: checkTime, trigger: 'change' }
                ],
                remind: [
                    { required: true, validator: checkRemind, trigger: 'change' }]
            }
        }
    },
    created() {
        this.getAllModulefields()
        this.getModules()
    },
    mounted() {
        this.addListener()
    },
    computed: {
        ...mapGetters(['contactList']),
        isExecNow() {
            return this.noticeForm.remindTime.moduleDateKey === '${exec_rightNow}'
        }
    },
    methods: {
        addListener() {
            let $subject = $(this.$refs.subject)
            $subject.on('DOMSubtreeModified', e => {
                this.subjectStrHide = $subject.html()
                let arr = this.subjectStrHide.match(/<span(.+?)class="myActionSubject"(.+?)>(.+?)<\/span>/g)
                let copy = this.subjectStrHide

                arr && arr.forEach(item => {
                    let value = $(item).attr('data-phvalue')
                    copy = copy.replace(item, value)
                })
                this.noticeForm.subject = copy
            })
        },
        pageBack() {
            $(this.$refs.subject).off('DOMSubtreeModified ')
            this.$emit('pageBack')
        },
        inputChange() {
            console.log(456)
        },
        setModify(item) {
            this.isModify = true
            this.noticeForm = {
                detailActionId: item.detailActionId,
                moduleCode: item.moduleCode,
                subject: item.subject,
                remindTime: {
                    moduleDateKey: item.moduleDateKey,
                    calculateType: item.calculateType.toString(),
                    timeValue: item.deliveryTime.split('_')[0],
                    timeType: item.deliveryTime.split('_')[1]
                },
                remindFields: item.remindFields,
                remindCtIds: item.remindCtIds.map(item => item.toString())
            }
        },
        _validate() {
            return new Promise((resolve, reject) => {
                this.$refs.noticeForm.validate(valid => {
                    if (valid) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        },
        async saveForm() {
            try {
                let isValidate = await this._validate()
                if (!isValidate) {
                    return
                }
                this.isSaving = true
                let flag = await this.saveData()
                this.isSaving = false
                if (flag) {
                    this.$emit('pageBack')
                }
            } catch (error) {

            }
        },
        resetForm() {
            this.$emit('pageBack')
        },
        getShowName(val) {
            for (let index = 0; index < this.remindFields.length; index++) {
                const item = this.remindFields[index]
                if (item.fieldName_ph == val) {
                    return item.showName
                }
            }
        },
        async getAllModulefields() {
            let params = {
                dataType: 'module_info_init',
                actionId: 0,
                placeHolderFlag: 1
            }
            let res = await this.getData(params)
            if (res) {
                this.allFields = res.fieldsArray || []
                this.getSubjectContent()
            }
        },

        async getModules() {
            this.isLoadingModules = true
            let params = {
                dataType: 'modules',
                placeHolderFlag: 0,
                actionId: 2
            }
            let res = await this.getData(params)
            if (res) {
                this.modules = res.list || []
            }
            this.isLoadingModules = false
        },
        moduleChange(moduleCode) {
            if (!this.isModify) {
                this.noticeForm.subject = ''
                this.subjectStrShow = ''
                this.subjectStrHide = ''
                this.noticeForm.remindTime.moduleDateKey = ''
                this.noticeForm.remindFields = []
            }
            this.getRelyModules(moduleCode)
            this.getDateFields(moduleCode)
            this.getRemindFields(moduleCode)
        },
        isSelected(obj) {
            let { remindFields } = this.noticeForm
            for (let index = 0; index < remindFields.length; index++) {
                const item = remindFields[index]
                if (item === obj.fieldName_ph) {
                    return true
                }
            }
        },
        relyModuleChange(obj) {
            this.moduleFields = this.allFields.filter(item => item.moduleCode == obj.moduleCode)
        },
        moduleFieldChange(item) {
            this.subjectStrShow = this.subjectStrHide + this.getSpanEle(item)
            this.insertPopoverShow = false
        },
        getSpanEle(item) {
            let prefix = ['-webket-', '-moz-', '-ms-', '']
            let userSelect = ''
            prefix.forEach(item => {
                userSelect += item + 'user-select:none;'
            })

            let insertEle = `<span class="myActionSubject" data-phValue="${item.fieldName_ph}" contenteditable="false" style="margin:0 3px;padding:2px;background-color:#eee;${userSelect}" >${item.showName}</span>`
            return insertEle
        },
        remindFieldChange(item) {
            if (!item) { return }
            if (item.nextControlFlag) {
                this.hasNextControl = true
            } else {
                this.noticeForm.remindFields.push(item.fieldName_ph)
                this.selRemindField = ''
                this.popoverShow = false
            }
        },
        remindCtIdChange(val) {
            if (!val) { return }
            this.hasNextControl = false
            this.noticeForm.remindCtIds.push(val)
            this.selPerson = ''
            this.selRemindField = ''
            this.popoverShow = false
        },
        removeRemindField(index) {
            this.noticeForm.remindFields.splice(index, 1)
        },
        removeRemindCtId(index) {
            this.noticeForm.remindCtIds.splice(index, 1)
        },
        async getRelyModules(moduleCode) {
            this.isLoadingRelyModules = true
            let params = {
                dataType: 'modules_anti_rely',
                moduleCode,
                placeHolderFlag: 1,
                actionId: 2
            }

            let res = await this.getData(params)

            if (res) {
                this.relyModules = res.list || []
            }
            this.isLoadingRelyModules = false
        },

        getSubjectContent() {
            let reg = new RegExp(/\${(.+?)}/g)
            let arr = this.noticeForm.subject.match(reg) || []
            let map = {}
            this.allFields.forEach(item => {
                if (arr.includes(item.fieldName_ph)) {
                    map[item.fieldName_ph] = item.showName
                }
            })
            let str = this.noticeForm.subject
            Object.keys(map).forEach(item => {
                let rg = new RegExp('\\' + item, 'g')
                let spanEle = this.getSpanEle({ fieldName_ph: item, showName: map[item] })
                str = str.replace(rg, spanEle)
            })
            this.subjectStrShow = str
        },
        async getRemindFields(moduleCode) {
            this.isLoadingRemindFields = true
            let params = {
                dataType: 'module_remindField',
                moduleCode,
                placeHolderFlag: 1,
                actionId: 2
            }

            let res = await this.getData(params)

            if (res) {
                this.remindFields = res.list || []
            }
            this.isLoadingRemindFields = false
        },
        async getDateFields(moduleCode) {
            this.isLoadingDateFields = true
            let params = {
                dataType: 'module_dateField',
                moduleCode,
                placeHolderFlag: 1,
                actionId: 2
            }

            let res = await this.getData(params)

            if (res) {
                this.dateFields = res.list || []
            }
            this.isLoadingDateFields = false
        },
        async getData(params) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2
                let res = await this.$http.get(url, { params })
                if (res.body.code.toString() == this.Global.RES_OK) {
                    return res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        /* 保存和更新 */
        async saveData() {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
                let { remindTime } = this.noticeForm
                let data = {
                    actionId: 2,
                    moduleCode: this.noticeForm.moduleCode,
                    subject: this.noticeForm.subject,
                    remindTime: {
                        moduleDateKey: remindTime.moduleDateKey,
                        calculateType: remindTime.calculateType,
                        deliveryTime: remindTime.timeValue + '_' + remindTime.timeType
                    },
                    remindWho: {
                        remindFields: this.noticeForm.remindFields,
                        remindCtIds: this.noticeForm.remindCtIds
                    }
                }
                if (this.isModify) {
                    Object.assign(data, { detailActionId: this.noticeForm.detailActionId })
                }
                let res = this.isModify ? await this.$http.put(url, data) : await this.$http.post(url, data)

                if (res.body.code.toString() === this.Global.RES_OK) {
                    return true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        }
    },
    watch: {
        'noticeForm.remindTime.timeType': function () {
            if (this.noticeForm.remindTime.timeType == 'm') {
                this.noticeForm.remindTime.timeValue = 15
            }
        }
    },
    components: {
        'page-detail': PageDetail
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
