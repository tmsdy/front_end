<template>
    <!-- 跟单流程 -->
    <el-dialog v-dialogDrag :title="tabData == '2'?'添加环节': '新建模板'" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false" :before-close="cancel">
        <div class="addLowerCust" v-show="tabData == '1'">
            <div class="formBox">
                <div class="documentModule">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
                        <el-form-item label="模板名称" prop="name">
                            <el-input v-model="ruleForm.name" style="width: 300px;" placeholder="请输入模板名称"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="addModule" v-if="processList.length == 0">
                    <span>您尚未添加任何流程环节</span>
                    <el-button type="primary" @click="addLink">添加环节</el-button>
                </div>
                <template v-else>
                    <div class="documentModule">
                        <span>包含流程环节</span>
                        <el-button type="primary" @click="addLink">添加环节</el-button>
                    </div>
                    <div class="listBox MXscroll" style="height:220px;overflow-y: auto;">
                        <div class="listTit">
                            <el-row>
                                <el-col :span="3">
                                    <div>序号</div>
                                </el-col>
                                <el-col :span="4">
                                    <div>跟单环节</div>
                                </el-col>
                                <el-col :span="5">
                                    <div>任务类型</div>
                                </el-col>
                                <el-col :span="7">
                                    <div>负责人</div>
                                </el-col>
                                <el-col :span="5">
                                    <div>操作</div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="listItem" v-for="(item, index) in processList" :key="index">
                            <el-row style="overflow: hidden;">
                                <el-col :span="3">
                                    <div>{{index+1}}</div>
                                </el-col>
                                <el-col :span="4">
                                    <div>{{item.nodeName}}</div>
                                </el-col>
                                <el-col :span="5">
                                    <span v-if="item.nodeType == 0">{{item.nodeStatus == 1?'任务金额状态':item.nodeStatus == 2?'任务核销状态':'未指定'}}</span>
                                    <el-select v-model="item.nodeStatus" placeholder="请选择" style="width:110px;" v-else>
                                        <el-option v-for="item in taskOption" :key="item.type" :label="item.name" :value="item.type">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="7">
                                    <div>
                                        <el-select v-model="item.chargeCtId" placeholder="请选择" style="width:110px;">
                                            <el-option label="未指定" value=""></el-option>
                                            <el-option label="拥有人" value="${ownerCtId}"></el-option>
                                            <el-option-group key="1" label="指定人员">
                                                <el-option v-for="(item, index) in contactValue" v-show="item.inUse == '1'" :label="item.realName" :value="item.ctId+''" :key="index"></el-option>
                                            </el-option-group>
                                        </el-select>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div>
                                        <span style="cursor: pointer;" @click="moveUp(index)"><i class="iconfont icon-move-up"></i></span>
                                        <span style="cursor: pointer;" @click="moveDown(index)"><i class="iconfont icon-move-down"></i></span>
                                        <span @click="processList.splice(index, 1)" style="cursor: pointer;"><i class="iconfont icon-del"></i></span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="addLowerCust" v-show="tabData == '2'">
            <div class="mailBox MXscroll">
                <add-linklist @setList="setList" ref="addLinklist" :nodeList="nodeList" @getOrderNode="getOrderNode" :processList="processList"></add-linklist>
            </div>
        </div>
        <div v-if="tabData == '1'" slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 保存 -->
            <el-button type="primary" @click="submit('ruleForm')" :disabled="(processList.length == 0?btnDisable:!btnDisable)">保存</el-button>
        </div>
        <div v-else slot="footer" class="dialogFooter" style="text-align:center">
            <el-button @click="tabData = '1'">取消</el-button>
            <!-- 确定 -->
            <el-button type="primary" :loading="subLoading" @click="saveAddLink">{{$t('mxpcweb.client.list.1542173184801')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import AddLinklist from '../AddLinklist/index'
import { mapGetters } from 'vuex'
export default {
    name: 'sendEmail',
    props: {
    },
    data() {
        return {
            dialog: false,
            firstChild: true,
            tabData: '1',
            ruleForm: {
                name: ''
            },
            dialogVisible: false,
            documentModule: '',
            subLoading: false,
            rules: {
                name: [
                    { required: true, message: '请输入模板名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ]
            },
            btnDisable: true,
            title: '新建模板',
            processList: [],
            checkList: [], // 添加的环节
            isEdit: false,
            nodeList: [],
            taskOption: [
                {
                    name: '任务金额状态',
                    type: '1'
                },
                {
                    name: '任务核销状态',
                    type: '2'
                }
            ],
            cloneData: {} // 获取传入的节点数据
        }
    },
    created() {
        // this.getpersonOption()
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'contactValue'
        ])
    },
    methods: {
        moveUp(x) {
            if (x == 0) {
                this.$message.error('当前已在首位')
            } else {
                this.processList[x] = this.processList.splice(x - 1, 1, this.processList[x])[0]
                return this.processList
            }
        },
        moveDown(x) {
            let length = this.processList.length
            if (x == length - 1) {
                this.$message.error('当前已在末位')
            } else {
                this.processList[x] = this.processList.splice(x + 1, 1, this.processList[x])[0]
                return this.processList
            }
        },
        cancel() {
            this.dialog = false
            this.ruleForm.name = ''
            this.processList = []
            this.$emit('changeOpenDialog')
        },
        showDialog() {
            this.dialog = true
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.isEdit) { // 新增时调用
                        this.addOrderTemplate()
                    } else {
                        // 编辑时调用
                        this.editOrderTemplate()
                    }
                } else {
                    return false
                }
            })
        },
        editOrderTemplate() {
            this.cloneData.templateInfo.map(item => {
                delete item.deadline
                delete item.templateNodeId
            })
            let cloneListData = {
                templateName: this.cloneData.templateName,
                templateInfo: this.cloneData.templateInfo
            }
            let currentListData = {
                templateName: this.ruleForm.name,
                templateInfo: []
            }
            let isFinish = true
            this.processList.forEach((item, index) => {
                if (item.nodeType == 1 && item.nodeStatus == '') {
                    this.$message.error('请选择' + item.nodeName + '任务类型')
                    isFinish = false
                    return
                }
                let obj = {}
                obj.nodeName = item.nodeName
                obj.sortOrder = index + 1
                obj.nodeId = item.nodeId
                obj.nodeType = item.nodeType
                if (item.hasOwnProperty('chargeCtId')) { // 负责人ctid
                    obj.chargeCtId = item.chargeCtId
                }
                if (item.hasOwnProperty('nodeStatus')) {
                    obj.nodeStatus = item.nodeStatus // 任务状态
                }
                currentListData.templateInfo.push(this.objKeySort(obj))
            })
            let filterList = this.processList.filter(item => item.nodeStatus == '1')
            if (filterList.length > 1) {
                isFinish = false
                this.$message.warning('任务金额状态最多为一项！')
            }
            let that = this
            if (isFinish) {
                if (JSON.stringify(cloneListData) != JSON.stringify(currentListData)) {
                    let data = {
                        templateId: this.cloneData.templateId
                    }
                    that.dialog = true
                    data = Object.assign(data, currentListData)
                    this.$http.put(this.Global.baseURL + this.Global.api.v2.orderTemplate, data)
                        .then(res => {
                            that.dialog = false
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                that.$emit('getOrderList')
                                that.$emit('changeOpenDialog')
                            } else {
                                that.$message.error(that.msg(res.body))
                            }
                        }
                        ).catch(
                            res => {
                                that.$message.error(that.$t(that.Global.errorTitle))
                            }
                        )
                } else {
                    this.$message.warning('暂时没有修改项！')
                }
            }
        },
        // 对象排序
        objKeySort(obj) {
            var newkey = Object.keys(obj).sort()
            var newObj = {} // 创建一个新的对象，用于存放排好序的键值对
            for (var i = 0; i < newkey.length; i++) { // 遍历newkey数组
                newObj[newkey[i]] = obj[newkey[i]] // 向新创建的对象中按照排好的顺序依次增加键值对
            }
            return newObj // 返回排好序的新对象
        },
        addOrderTemplate() {
            let that = this
            let templateInfo = []
            let isFinish = true
            this.processList.forEach((item, index) => {
                if (item.nodeType == 1 && item.nodeStatus == '') {
                    this.$message.warning('请选择' + item.nodeName + '任务类型')
                    isFinish = false
                    return
                }
                let obj = {}
                obj.nodeName = item.nodeName
                obj.sortOrder = index + 1
                obj.nodeId = item.nodeId
                obj.nodeType = item.nodeType
                if (item.hasOwnProperty('chargeCtId')) { // 负责人ctid
                    obj.chargeCtId = item.chargeCtId
                }
                if (item.hasOwnProperty('nodeStatus')) {
                    obj.nodeStatus = item.nodeStatus // 任务状态
                }
                templateInfo.push(obj)
            })
            let filterList = this.processList.filter(item => item.nodeStatus == '1')
            if (filterList.length > 1) {
                isFinish = false
                this.$message.warning('任务金额状态最多为一项！')
            }
            let params = {
                templateName: this.ruleForm.name,
                templateInfo: templateInfo
            }
            if (isFinish) {
                that.dialog = true
                this.$http.post(this.Global.baseURL + this.Global.api.v2.orderTemplate, params)
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            that.dialog = false
                            that.$emit('getOrderList')
                            that.$emit('changeOpenDialog')
                        } else {
                            that.$message.error(that.msg(res.body))
                        }
                    }
                    ).catch(
                        res => {
                            that.$message.error(that.$t(that.Global.errorTitle))
                        }
                    )
            }
        },
        addLink() {
            this.tabData = '2'
            this.$refs.addLinklist.clearCheckList()
        },
        getOrderNode() {
            let data = {
                type: 'list'
            }
            let that = this
            return new Promise(function (resolve, reject) {
                that.$http.get(that.Global.baseURL + that.Global.api.v2.orderNode, { params: data })
                    .then(res => {
                        if (res.body.code.toString() == that.Global.RES_OK) {
                            that.nodeList = res.body.data.list
                        } else {
                            that.$message.error(that.msg(res.body))
                        }
                        resolve('返回成功')
                    },
                        res => {
                            that.$message.error(that.$t(that.Global.errorTitle))
                        }
                    )
            })
        },
        setList(n) {
            this.checkList = n
        },
        saveAddLink() {
            this.tabData = '1'
            this.checkList.forEach(item => {
                let filterArr = this.nodeList.filter(ele => ele.nodeId == item)
                this.processList.push(filterArr[0])
            })
        },
        edit(x) {
            this.cloneData = JSON.parse(JSON.stringify(x))
            this.ruleForm.name = JSON.parse(JSON.stringify(this.cloneData.templateName))
            this.processList = JSON.parse(JSON.stringify(this.cloneData.templateInfo))
            this.isEdit = true
        },
        clear() {
            this.ruleForm.name = ''
            this.processList = []
        }
    },
    watch: {
    },
    components: {
        'add-linklist': AddLinklist
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addLowerCust {
    .mailBox {
        padding: 0 20px;
        min-height: 180px;
        max-height: 240px;
        overflow-y: auto;
        .contentsBox {
            .contents1 {
                height: 40px;
                line-height: 40px;
            }
            .contents2 {
                height: 40px;
                line-height: 40px;
                .content {
                    height: 40px;
                    line-height: 40px;
                }
            }
        }
    }
    .dialogFooter {
        height: 80px;
    }

    .formBox {
        padding-bottom: 20px;
        color: #606266;
        .documentModule {
            height: 40px;
            margin-top: 10px;
            .labelBox {
                display: inline-block;
                vertical-align: top;
                width: 86px;
                height: 28px;
                line-height: 28px;
            }
            span {
                margin-right: 20px;
            }
        }
        .addModule {
            height: 180px;
            text-align: center;
            padding-top: 40px;
            span {
                color: #606266;
                display: block;
                margin-bottom: 20px;
            }
        }
        .listBox {
            margin-top: 10px;
            font-size: 12px;
            .listTit {
                height: 32px;
                line-height: 32px;
                background: #f7f8f9;
                padding-left: 20px;
            }
            .listItem {
                color: #222222;
                padding-left: 20px;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #eaeaea;
            }
        }
    }
}
</style>
