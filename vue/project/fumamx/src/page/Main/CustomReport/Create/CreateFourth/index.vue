<template>
    <div class="createfourth MXscroll">
        <div class="userList" v-show="users.length>0">
            <div class="userListHeader">
                <el-row>
                    <el-col :span="5" class="userListItem">使用者</el-col>
                    <el-col :span="4" class="userListItem">对象类型</el-col>
                    <el-col :span="3">全部</el-col>
                    <el-col :span="3">允许运行</el-col>
                    <el-col :span="3">允许导出</el-col>
                    <el-col :span="3">允许订阅</el-col>
                    <el-col :span="3">允许打印</el-col>
                </el-row>
            </div>
            <div class="userListBody">
                <el-row class="listBodyrow" v-for="(item,index) in users" :key="index">
                    <el-col :span="5" class="userListItem">{{item.value}}</el-col>
                    <el-col :span="4" class="userListItem">{{item.userType}}</el-col>
                    <el-col :span="3">
                        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.manage" @change="handleCheckAllChange($event,index)">
                            <div style="display:none">全选</div>
                        </el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item.checkedCities,index)">
                            <template v-for="city in checkList">
                                <el-checkbox :label="city" :key="city" :disabled="(city == 'run')? true : false">
                                    <div style="display:none">{{city}}</div>
                                </el-checkbox>
                            </template>
                        </el-checkbox-group>
                        <div class="iconBox">
                            <span class="optButton" @click="delList(item,index)"><i class="iconfont icon-del" style="font-size: 14px"></i></span>
                        </div>
                    </el-col>
                </el-row>
            </div>

        </div>
        <p>如需要增加“使用者”，请选择</p>
        <div class="addBtn">
            <el-button @click="addPerson">添加人员</el-button>
            <el-button @click="addRole">添加角色</el-button>
        </div>
        <p>选择报表归属</p>
        <div class="owner">
            <span style="margin-right: 30px;">拥有人：
                <label v-if="!isEdit">{{company.nickName}}</label>
                <el-select v-else v-model="ownerPerson" placeholder="请选择" style="width:180px;" @change="changeOwner">
                    <el-option v-for="(item,index) in ownerPersonList" :key="index" :label="item.realName" :value="item.ctId">
                    </el-option>
                </el-select>
            </span>
            <span><em>*</em>所属部门</span>
            <el-select v-model="value" placeholder="请选择" style="width:180px;">
                <el-option v-for="(item,index) in departmentList" :key="index" :label="item.deptName" :value="item.dkey">
                </el-option>
            </el-select>
        </div>
        <p class="tips">注：报表管理员具有最大权限可对报表设置权</p>
        <div class="addBtn">
            <el-button type="primary" @click="save" :loading="isLoading" v-if="isEdit">保存</el-button>
            <el-button type="primary" @click="running" :loading="isLoading" v-if="isEdit">运行</el-button>
            <el-button type="primary" @click="submitForm" :loading="isLoading" v-if="!isEdit">保存并运行</el-button>
            <el-button type="primary" @click="backPrev">上一步</el-button>
        </div>
        <!-- 弹出框 -->
        <el-dialog title="请选择" :visible.sync="dialogFormVisible" class="choiceDialogBox">
            <span>{{selectTitle}}</span>
            <el-select v-model="form" placeholder="请选择" style="margin-top: 15px;" value-key="value">
                <el-option v-for="item in listOptions" :key="item.key" :label="item.value" :value="item">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureAdd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// const cityOptions = ['run', 'export', 'subscribe', 'print']
import { mapGetters } from 'vuex'
export default {
    name: 'createfourth',
    props: {
        deptPerson: {
            type: Object,
            default: function () {
                return {}
            }
        },
        summaryParames: {
            type: Object,
            default: function () {
                return {}
            }
        },
        tabData: {
            type: String,
            default: function () {
                return ''
            }
        }
    },
    data() {
        return {
            isLoading: false,
            tableData: [{
                date: '2016-05-03',
                name: '王小虎'
            }],
            checkAll: true,
            checkList: ['run', 'export', 'subscribe', 'print'],
            dialogFormVisible: false,
            formLabelWidth: '80px',
            users: [],
            selectTitle: '',
            listOptions: [],
            form: '',
            userType: '', // 对象类型
            cloneDeptPerson: {},
            flagRender: false, // 标记回显是否渲染
            isEdit: false,
            authorityData: [], // 获取的人员数据
            reportId: '',
            disabled: false,
            value: '',
            ownerPerson: '',
            getOwnerPerson: '', // 获取的所属人员
            getOwnerDeptKey: '', // 获取的所属部门
            departmentList: [], // 部门列表
            ownerPersonList: [] // 人员列表
        }
    },
    created() {
        this.users = []
        this.cloneDeptPerson = JSON.parse(JSON.stringify(this.deptPerson))
        let data = {
            dataType: 'department',
            funType: 'withRight',
            deptCascade: true,
            ctId: this.company.ctId,
            moduleCode: 'SR001',
            optCode: 'otNew'
        }
        this.getDropList(data)
    },
    mounted() {
    },
    computed: {
        ...mapGetters(['contactList', 'company'])
    },
    methods: {
        // 改变人员下拉值
        changeOwner() {
            let data = {
                dataType: 'department',
                funType: 'withRight',
                deptCascade: true,
                ctId: this.ownerPerson,
                moduleCode: 'SR001',
                optCode: 'otNew'
            }
            this.getDropList(data)
        },
        // 部门/人员列表
        getDropList(data) {
            // this.loading = true
            this.$http.get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let list = res.body.data
                        if (data.dataType == 'department') {
                            this.departmentList = list.filter(item => item.inUse != 0)
                        } else if (data.dataType == 'contact') {
                            this.ownerPersonList = list.filter(item => item.inUse != 0)
                            this.value = this.departmentList[0].dkey
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        addPerson() {
            // console.log(this.departmentList, this.cloneDeptPerson.empList)
            this.selectTitle = '添加人员'
            this.listOptions = this.cloneDeptPerson.empList
            this.form = ''
            this.userType = '人' // 对象类型是人员
            this.dialogFormVisible = true
        },
        addRole() {
            this.selectTitle = '添加角色'
            this.listOptions = this.cloneDeptPerson.roleList
            this.form = ''
            this.userType = '角色' // 对象类型是角色
            this.dialogFormVisible = true
        },
        sureAdd() {
            let arrObject = {
                value: this.form.value,
                key: this.form.key,
                userType: this.userType,
                manage: false,
                run: 0,
                export: 0,
                subscribe: 0,
                print: 0,
                isIndeterminate: true,
                checkedCities: ['run']
            }
            this.users.push(arrObject)
            // 删除下拉框原下拉数组中的下拉选择值
            var arrIndex = this.listOptions.indexOf(this.form)
            this.listOptions.splice(arrIndex, 1)
            this.dialogFormVisible = false
        },
        handleCheckAllChange(event, n) {
            this.users[n].checkedCities = event.target.checked ? this.checkList : ['run']
            this.$set(this.users[n], 'isIndeterminate', false)
        },
        handleCheckedCitiesChange(value, n) {
            let checkedCount = value.length
            this.users[n].manage = checkedCount === this.checkList.length
            let isIndeter = checkedCount > 0 && checkedCount < this.checkList.length
            this.$set(this.users[n], 'isIndeterminate', isIndeter)
        },
        backPrev() {
            this.$emit('changeTabData', '3')
        },
        submitForm() {
            if (this.users.length > 0) {
                if (this.value == '') {
                    this.$message.warning('请选择所属部门')
                    return
                }
                this.isLoading = true
                let fourthParames = {
                    authority: []
                }
                fourthParames.authority = this.processData()
                this.summaryParames.reportInfo.ownerCtId = this.company.ctId
                this.summaryParames.reportInfo.ownerDeptKey = parseInt(this.value)
                fourthParames = Object.assign(fourthParames, this.summaryParames)
                // console.log(this.summaryParames)
                this.$http.post(this.Global.baseURL + this.Global.api.v1.createReport,
                    fourthParames
                )
                    .then(res => {
                        this.isLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            let reportId = res.body.data.reportId
                            // 跳转到列表页 并传递参数 列表页根据此参数打开相应的弹框
                            this.$router.push({ path: '/main/customReport/reportdetail', query: { selected: reportId } })
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    },
                        res => {
                            this.isLoading = false
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
            } else {
                this.$message({
                    message: '请至少选择一位使用者！',
                    type: 'warning'
                })
            }
        },
        processData() { // 处理本页面数据
            let parames = {
                operatorType: -1, // 操作者类型(0:人员; 1:角色)
                operator: 0, // 操作者ctid或角色id
                manage: 1,
                run: 1,
                export: 1,
                subscribe: 1,
                print: 1
            }
            let newArr = []
            this.users.forEach(ele => {
                let cloneParames = JSON.parse(JSON.stringify(parames))
                if (ele.userType == '人') {
                    cloneParames.operatorType = 0
                } else {
                    cloneParames.operatorType = 1
                }
                cloneParames.operator = ele.key
                if (ele.checkedCities.length > 0) {
                    if (ele.checkedCities.indexOf('export') >= 0) {
                        cloneParames.export = 0
                    } else {
                        cloneParames.export = 1
                    }
                    if (ele.checkedCities.indexOf('run') >= 0) {
                        cloneParames.run = 0
                    } else {
                        cloneParames.run = 1
                    }
                    if (ele.checkedCities.indexOf('subscribe') >= 0) {
                        cloneParames.subscribe = 0
                    } else {
                        cloneParames.subscribe = 1
                    }
                    if (ele.checkedCities.indexOf('print') >= 0) {
                        cloneParames.print = 0
                    } else {
                        cloneParames.print = 1
                    }
                    if (ele.checkedCities.length == 4) {
                        cloneParames.manage = 0
                    } else {
                        cloneParames.manage = 1
                    }
                } else {
                    cloneParames.run = 1
                    cloneParames.export = 1
                    cloneParames.subscribe = 1
                    cloneParames.print = 1
                }
                newArr.push(this.objKeySort(cloneParames))
            })
            return newArr
        },
        // 删除使用者
        delList(x, y) {
            this.users.splice(y, 1)
            // 删除同时恢复在下拉值中删除项
            if (x.userType == '人') {
                this.cloneDeptPerson.empList.push(x)
            } else {
                this.cloneDeptPerson.roleList.push(x)
            }
        },
        async getReportPage4() {
            let { reportId } = this.$route.query
            this.reportId = reportId
            if (reportId) {
                this.isEdit = true
                await this.$http.get(this.Global.baseURL + this.Global.api.v1.reportPage4, { params: { reportId: reportId } })
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.authorityData = res.body.data.authority
                            this.getOwnerDeptKey = this.authorityData.filter(item => item.operatorType == 0)
                            this.ownerPerson = res.body.data.ownerCtId // 获取返回的拥有人用于回显
                            this.getOwnerPerson = res.body.data.ownerCtId // 获取返回的拥有人用于对比
                            this.value = res.body.data.ownerDeptKey
                            this.setAuthority(this.authorityData)
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    },
                        res => {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
            }
        },
        // 回显数据
        setAuthority(authority) {
            authority.forEach(item => {
                let arrObject = {
                    value: 0,
                    key: 0,
                    userType: '',
                    manage: false,
                    run: 0,
                    export: 0,
                    subscribe: 0,
                    print: 0,
                    isIndeterminate: false,
                    checkedCities: []
                }
                arrObject.value = item.name
                arrObject.key = item.operator
                if (item.operatorType == 0) {
                    arrObject.userType = '人'
                    // 删除添加下拉选项中已经显示的值
                    this.cloneDeptPerson.empList.forEach((ele, index) => {
                        if (ele.key == item.operator) {
                            this.cloneDeptPerson.empList.splice(index, 1)
                            return false
                        }
                    })
                } else {
                    arrObject.userType = '角色'
                    this.cloneDeptPerson.roleList.forEach((ele, index) => {
                        if (ele.key == item.operator) {
                            this.cloneDeptPerson.roleList.splice(index, 1)
                            return false
                        }
                    })
                }
                arrObject.manage = item.manage
                arrObject.run = item.run
                arrObject.subscribe = item.subscribe
                arrObject.print = item.print
                arrObject.export = item.export
                if (item.run == true) {
                    arrObject.checkedCities.push('run')
                }
                if (item.subscribe == true) {
                    arrObject.checkedCities.push('subscribe')
                }
                if (item.print == true) {
                    arrObject.checkedCities.push('print')
                }
                if (item.export == true) {
                    arrObject.checkedCities.push('export')
                }
                if (arrObject.checkedCities.length == 4) {
                    arrObject.isIndeterminate = false
                } else {
                    arrObject.isIndeterminate = true
                }
                this.users.push(arrObject)
            })
        },
        save() {
            if (this.users.length > 0) {
                // this.isLoading = true
                let currentData = []
                this.processData().forEach(item => currentData.push(JSON.stringify(item)))
                // console.log(currentData)
                // 转后端返回数据
                let returnData = []
                this.authorityData.forEach(item => {
                    (item.export == true) ? item.export = 0 : item.export = 1;
                    (item.manage == true) ? item.manage = 0 : item.manage = 1;
                    (item.print == true) ? item.print = 0 : item.print = 1;
                    (item.run == true) ? item.run = 0 : item.run = 1;
                    (item.subscribe == true) ? item.subscribe = 0 : item.subscribe = 1
                    delete item['name']
                    let toJSON = JSON.stringify(this.objKeySort(item))
                    returnData.push(toJSON)
                })
                // 数组求差
                function getSubtract(unionArr, subsetArr) {
                    var new_tmp = []
                    for (var i = 0; i < unionArr.length; i++) {
                        var flag = true
                        for (var j = 0; j < subsetArr.length; j++) {
                            if (unionArr[i] == subsetArr[j]) {
                                flag = false
                            }
                        }
                        if (flag) {
                            new_tmp.push(unionArr[i])
                        }
                    }
                    return new_tmp
                }
                var different = getSubtract(currentData, returnData)
                let difMerge = different.concat(getSubtract(returnData, currentData)) // getSubtract(returnData, currentData)是有删除选项的时候
                let difMergeId = []
                let concatId = [] // 把差值跟原来的数组合并后的operator和operatorType
                function setType(arr, target) { // 筛选对象出只有operator和operatorType的属性
                    arr.forEach(item => {
                        let toParse = JSON.parse(item)
                        let obj = {}
                        obj.operator = toParse.operator
                        obj.operatorType = toParse.operatorType
                        target.push(JSON.stringify(obj))
                    })
                }
                setType(difMerge, difMergeId) // 把合并后的不同项筛选出只有operator和operatorType的属性，然后去重
                let set = new Set(difMergeId)
                let concatArr = [...set].concat(returnData)
                setType(concatArr, concatId)
                console.log(concatId)
                // 数组去重 把差值跟原来的数组对比中重复的就是需要删除的
                let delArr = []
                concatId.filter(function (element, index, self) {
                    if (self.indexOf(element) != index) {
                        delArr.push(JSON.parse(element))
                    }
                    return false
                })
                let difArr = []
                different.map(item => difArr.push(JSON.parse(item)))
                console.log(difArr)
                console.log(delArr)
                let data = {
                    reportId: this.reportId,
                    info: {}
                }
                if (difArr.length > 0) {
                    data.info.addAuthority = difArr
                }
                if (delArr.length > 0) {
                    data.info.deleteAuthority = delArr
                }
                let flagOwnerChange = false // 标记用有人或拥有部门是否修改
                if (this.getOwnerPerson != this.ownerPerson || this.getOwnerDeptKey != this.value) {
                    flagOwnerChange = true
                    data.info.ownerDeptKey = this.value
                    data.info.ownerCtId = this.ownerPerson
                }
                if (difArr.length > 0 || flagOwnerChange) {
                    this.putReportPage(data)
                } else {
                    this.$message.error('您暂时没有需要保存的字段！')
                }
            } else {
                this.$message({
                    message: '请至少选择一位使用者！',
                    type: 'warning'
                })
            }
        },
        running() {
            this.$router.push({ path: '/main/customReport/reportdetail', query: { selected: this.reportId } })
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
        putReportPage(x) {
            this.isLoading = true
            this.$http.put(this.Global.baseURL + this.Global.api.v1.reportPage4, x)
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.isLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    watch: {
        deptPerson() {
            this.cloneDeptPerson = JSON.parse(JSON.stringify(this.deptPerson))
        },
        async tabData(val) {
            if (val == 4 && !this.flagRender) {
                this.flagRender = true
                await this.getReportPage4()
                let data = {
                    dataType: 'contact',
                    funType: 'withRight',
                    moduleCode: 'SR001',
                    optCode: 'otEdit'
                }
                this.getDropList(data)
            }
        }
    }
}
</script>
<style lang="less">
.choiceDialogBox {
    .el-dialog {
        width: 450px !important;
    }
    .el-select {
        width: 100%;
    }
    .el-dialog__footer {
        text-align: center;
    }
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
