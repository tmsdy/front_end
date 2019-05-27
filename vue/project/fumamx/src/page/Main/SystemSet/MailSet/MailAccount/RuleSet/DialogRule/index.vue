<template>
    <div class="DialogRule">
        <!-- 分发规则 -->
        <el-dialog :title="$t('mxpcweb.systemset.mailset.mailaccount.1533538365114')" :visible.sync="dialogVisible" size="tiny" v-dialogDrag :before-close="handleClose">
            <div class="ruleBody">
                <el-form label-position="left" label-width="96px" ref="addRuleBox" :model="ruleForm" :rules="contentRule">
                    <!-- 邮箱账号 -->
                    <el-form-item :label="$t('mxpcweb.systemset.mailset.mailaccount.1533539316002')">
                        <div>
                            {{mailItem.mailAddress}}
                        </div>
                        <!--  <div v-if="type==='edit'">
                            {{mailItem.mailAddress}}
                        </div>
                        <div v-if="type==='add'">
                            <el-select v-model="mailItem.mailAddress" placeholder="请选择">
                                <el-option v-for="item in mailAddressArr" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div> -->
                    </el-form-item>
                    <!-- 分发规则 -->
                    <el-form-item :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538365114')">
                        <div>
                            <!-- 请选择 -->
                            <el-select v-model="ruleNo" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033277257')">
                                <el-option v-for="item in rules" :key="item.ruleNo" :label="item.ruleName" :value="item.ruleNo">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="hasContent" prop="content" :label="contentLabel">
                        <div>
                            <el-input v-model="ruleForm.content" :placeholder="contentPlaceholder"></el-input>
                        </div>
                    </el-form-item>
                    <!-- 接收人 -->
                    <el-form-item v-if="hasReceiver" :label="$t('mxpcweb.systemset.mailset.mailaccount.1533538725243')">
                        <div>
                            <template v-if="addBtnShow">
                                <el-button type="primary" size="small" @click="addReceiver()">
                                    <!-- 添加内部接收人员 -->{{$t('mxpcweb.systemset.mailset.mailaccount.1533539560714')}}</el-button>
                            </template>
                            <template v-else>
                                <el-table :data="receiverArr" style="width: 100%" class="tableBox">
                                    <!-- 人员 -->
                                    <el-table-column :label="$t('mxpcweb.systemset.mailset.mailaccount.1533539593147')" width="119">
                                        <template slot-scope="scope">
                                            <div v-if="scope.row.flag==1">
                                                {{getNameById(scope.row.ctId)}}
                                            </div>
                                            <div v-else>
                                                <!-- 请选择 -->
                                                <el-select v-model="scope.row.ctId" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033277257')">
                                                    <el-option v-for="item in personList" :key="item.ctId" :label="item.realName" :value="item.ctId" :disabled="receiverFilter(item.ctId)">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 操作 -->
                                    <el-table-column :label="$t('mxpcweb.systemset.mailset.mailaccount.1529042764362')">
                                        <template slot-scope="scope">
                                            <div class="opreationBtn iconfont icon-minus" @click="deleteReceiver(scope.$index,scope.row)"></div>
                                            <div v-if="scope.$index==(receiverArr.length-1)" class="opreationBtn iconfont icon-plus-file" @click="addReceiver()"></div>
                                        </template>
                                    </el-table-column>

                                </el-table>

                            </template>

                        </div>
                    </el-form-item>
                    <el-form-item label="">
                        <div>
                            <el-checkbox v-model="assignMark">
                                <!-- 标记为已分发 -->{{$t('mxpcweb.systemset.mailset.mailaccount.1533539699899')}}
                            </el-checkbox>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">
                    <!-- 取 消 -->{{$t('mxpcweb.systemset.mailset.mailaccount.1533539739884')}}</el-button>
                <el-button type="primary" @click="submitRule" :loading="isAdding">
                    <!-- 保 存 -->{{$t('mxpcweb.systemset.mailset.mailaccount.1533539753605')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
export default {
    name: 'DialogRule',
    props: {
        personList: {
            type: Array,
            default: () => []
        },
        propMailItem: {
            type: Object,
            default: () => { return {} }
        }
    },
    data() {
        return {
            dialogVisible: false,
            isAdding: false,
            type: '',
            ruleId: '',
            rules: [
                /* 01.按联系人的分配权限分发 */
                { ruleNo: '01', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533538962073') },
                /* 02.将此邮箱所有邮件分发接收人 */
                { ruleNo: '02', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533538991244') },
                /* 03.按邮件内容关键词分发 */
                { ruleNo: '03', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539037812') },
                /* 04.按邮箱的主题关键字分发 */
                { ruleNo: '04', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539051641') },
                /* 05.按发件人邮箱地址分发 */
                { ruleNo: '05', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539069962') },
                /* 06.按收件人邮箱地址或名字分发 */
                { ruleNo: '06', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539085226') },
                /* 07.来自陌生客户平均分配 */
                { ruleNo: '07', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539097515') },
                /* 08.来自指定发件人的邮件按平均分配 */
                { ruleNo: '08', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539112243') },
                /* 09.来自阿里陌生询盘按平均分配 */
                { ruleNo: '09', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539127506') },
                /* 10.来自制造网陌生询盘按平均分配 */
                { ruleNo: '10', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539143011') },
                /* 11.来自环球资源陌生询盘按平均分配 */
                { ruleNo: '11', ruleName: this.$t('mxpcweb.systemset.mailset.mailaccount.1533539156831') }
            ],
            ruleNo: '01',
            assignMark: false,
            ruleForm: {
                content: ''
            },
            contentRule: {},
            mailItem: this.propMailItem,
            mailAddressArr: [],
            receiverArr: [],
            delCtids: []
        }
    },
    computed: {
        contentLabel() {
            let str = ''
            switch (this.ruleNo) {
                case '03':
                    /* 关键词 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540833164')
                    break
                case '04':
                    /* 关键词 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540833164')
                    break
                case '05':
                    /* 发件人邮箱 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540848330')
                    break
                case '06':
                    /* 收件人 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540860883')
                    break
                case '08':
                    /* 邮箱 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533537709898')
                    break
                case '09':
                    /* 邮箱 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533537709898')
                    break
                case '10':
                    /* 邮箱 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533537709898')
                    break
                case '11':
                    /* 邮箱 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533537709898')
                    break
                default:
                    /* 关键字 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540833164')
                    break
            }
            return str
        },
        contentPlaceholder() {
            let str = ''
            switch (this.ruleNo) {
                case '03':
                    /* 输入匹配的内容关键词 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540950563')
                    break
                case '04':
                    /* 输入匹配的主题关键词 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540965483')
                    break
                case '05':
                    /* 输入发件人地址 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540978829')
                    break
                case '06':
                    /* 输入收件人名称或地址 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533540991512')
                    break
                case '08':
                    /* 输入发件人名称或地址 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533541005491')
                    break
                default:
                    /* 请输入邮件地址 */
                    str = this.$t('mxpcweb.systemset.mailset.mailaccount.1533541017866')
                    break
            }
            return str
        },
        addBtnShow() {
            return this.receiverArr.length <= 0
        },
        hasContent() {
            return ['03', '04', '05', '06', '08', '09', '10', '11'].includes(this.ruleNo)
        },
        hasReceiver() {
            return ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].includes(this.ruleNo)
        }
    },
    methods: {
        open(type, item = {}) {
            this.type = type
            if (type == 'edit') {
                this.ruleNo = this.rules[item.ruleNo - 1]['ruleNo']
                this.assignMark = item.assignMark == 1
                this.ruleId = item.ruleId
                this.ruleForm.content = item.content
                this.receiverArr = item.recCtids.map(ctId => {
                    return { ctId, flag: 1 }
                })
            }
            console.log(this.receiverArr)

            this.dialogVisible = true
        },
        handleClose() {
            this.receiverArr = []
            this.assignMark = false
            this.ruleForm.content = ''
            this.ruleId = ''
            this.delCtids = []
            this.dialogVisible = false
        },
        getNameById(ctId) {
            let name = ''
            for (let index = 0; index < this.personList.length; index++) {
                let item = this.personList[index]
                if (item.ctId == ctId) {
                    name = item.realName
                    break
                }
            }
            return name
        },
        receiverFilter(ctId) {
            let flag = false
            for (let i = 0; i < this.receiverArr.length; i++) {
                let item = this.receiverArr[i]
                if (item.ctId == ctId) {
                    flag = true
                }
            }
            return flag
        },
        /* 接收人删除 */
        deleteReceiver(index, row) {
            this.receiverArr.splice(index, 1)
            if (this.type = 'edit' && row.flag.toString() === '1') {
                this.delCtids.push(row.ctId)
            }
        },
        /* 添加接收人  */
        addReceiver() {
            this.receiverArr.push({ ctId: '', flag: 0 })
        },
        submitRule() {
            if (this.hasReceiver && this.receiverArr.length <= 0) {
                this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1555912289270'))
                return
            }
            this.type == 'add' ? this.addRule() : this.modifyRule()
        },
        valiContent() {
            return new Promise((resolve, reject) => {
                if (this.hasContent) {
                    this.$refs['addRuleBox'].validate((valid) => {
                        if (valid) {
                            resolve({ flag: true })
                        } else {
                            resolve({ flag: false })
                        }
                    })
                } else {
                    resolve({ flag: true })
                }
            })
        },
        async addRule() {
            let valid = await this.valiContent()
            if (!valid.flag) {
                return false
            }
            this.isAdding = true
            let recCtids = []
            this.receiverArr.forEach(item => {
                if (item.ctId && item.ctId !== '') {
                    recCtids.push(item.ctId)
                }
            })
            let url = this.Global.baseURL + this.Global.api.v2.mails_publicRules
            let data = {
                mailAccount: this.mailItem.mailAddress,
                assignMark: this.assignMark ? 1 : 0,
                ruleNo: this.ruleNo,
                recCtids: recCtids
            }
            //  ownerCtid: this.mailItem.ctid
            if (this.hasContent) {
                Object.assign(data, { content: this.ruleForm.content })
            }

            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(res.data.msg)
                        this.$emit('isCommit')
                        this.handleClose()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.isAdding = false
                })
                .catch(err => {
                    this.isAdding = false
                    this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        },
        async modifyRule() {
            let valid = await this.valiContent()
            if (!valid.flag) {
                return false
            }
            this.isAdding = true
            let addCtids = []
            this.receiverArr.forEach(item => {
                if (item.ctId && item.ctId !== '' && item.flag.toString() === '0') {
                    addCtids.push(item.ctId)
                }
            })
            let url = this.Global.baseURL + this.Global.api.v2.mails_publicRules
            let data = {
                ruleId: this.ruleId,
                mailAccount: this.mailItem.mailAddress,
                assignMark: this.assignMark ? 1 : 0,
                ruleNo: this.ruleNo,
                addCtids: addCtids,
                delCtids: this.delCtids
            }
            if (this.hasContent) {
                Object.assign(data, { content: this.ruleForm.content })
            }

            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(res.data.msg)
                        this.$emit('isCommit')
                        this.handleClose()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.isAdding = false
                })
                .catch(err => {
                    this.isAdding = false
                    this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        }
    },
    watch: {
        ruleNo() {
            delete this.contentRule.content
            var checkEmail = (rule, value, callback) => {
                const mailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
                if (!value) {
                    /* 邮箱账号不允许为空 */
                    return callback(new Error(this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463968')))
                }
                setTimeout(() => {
                    if (mailReg.test(value)) {
                        callback()
                    } else {
                        /* 请输入正确的邮箱账号 */
                        callback(new Error(this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463604')))
                    }
                }, 100)
            }
            if (['08', '09', '10', '11'].includes(this.ruleNo)) {
                this.contentRule['content'] = [{ validator: checkEmail, required: true, trigger: 'blur' }]
            }
            if (['03', '04', '05', '06'].includes(this.ruleNo)) {
                /* 请输入内容 */
                this.contentRule['content'] = [{ required: true, message: this.$t('mxpcweb.systemset.mailset.mailaccount.1529029414385'), trigger: 'blur' }]
            }
            this.$refs['addRuleBox'].validate()
        }
    },
    components: {

    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
