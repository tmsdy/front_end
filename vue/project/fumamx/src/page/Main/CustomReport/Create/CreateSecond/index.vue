<template>
    <div class="createsecond" v-loading="isLoading" :class="{ areaH: isLoading}">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <div class="selectWrap">
                <!-- <div class="leftTitle"></div> -->
                <el-form-item label="选择主数据" prop="mainModule">
                    <el-select v-model="ruleForm.mainModule" placeholder="请选择主数据" @change="changeModule" :disabled="isEdit">
                        <el-option v-for="(item,index) in mainModuleList" :key="index" :label="item.moduleName" :value="item.moduleCode">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>

        </el-form>
        <div class="selectWrap">
            <div class="leftTitle" style="height:36px;line-height: 36px;">选择关联数据</div>
            <el-select v-model="ruleForm.relyModule" placeholder="请选择" @change="changeRelyModule" :disabled="isEdit" clearable>
                <el-option v-for="item in relyModuleList" :key="item.moduleCode" :label="item.moduleName" :value="item.moduleCode">
                </el-option>
            </el-select>
            <!-- <div class="choiceTips">最多可选择1个相关</div> -->
        </div>
        <div class="selectWrap">
            <div class="leftTitle" style="height:40px;line-height: 40px;">选择数据内容</div>
            <div class="rightTabbox">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="列" name="first" v-if="reportData.reportType!=2">
                        <div class="tabBody">
                            <el-transfer v-model="dataColumn" :data="fieldInfo" :titles="['可选列', '已选列']" :button-texts="['移除', '添加']" class="bbb" @change="changeDataColumn"></el-transfer>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="分组" name="second" v-if="reportData.reportType!=0">
                        <div class="tabBody">
                            <!-- 普通,汇总报表的分组 -->
                            <div class="selectBoxWrap" v-if="reportData.reportType != 2">
                                <div class="selectBox">
                                    <!-- <span class="line"></span> -->
                                    <div class="selectBoxitem">
                                        <span class="selectBox-title">首先通过</span>
                                        <el-select v-model="XdataOptions[0]" placeholder="请选择" @change="selcetPass" value-key="fieldId">
                                            <el-option-group v-for="group in groupFieldInfo" :key="group.moduleName" :label="group.moduleName">
                                                <el-option v-for="(item,index) in group.field" :key="index" :label="item.fieldName" :value="item" :disabled="item.disabled">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </div>
                                    <div class="selectBoxitem">
                                        <span class="selectBox-title">排序顺序</span>
                                        <el-select v-model="title1Sort" placeholder="请选择">
                                            <el-option label="升序" value="0"></el-option>
                                            <el-option label="降序" value="1"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <!-- 交叉报表分组 -->
                            <div class="selectBoxWrap" v-if="reportData.reportType == 2">
                                <div class="selectBox">
                                    <div class="selectBoxitem">
                                        <span class="selectBox-title">指定行标题</span>
                                        <el-select v-model="XdataOptions[0]" placeholder="请选择" @change="selcetPass" value-key="fieldId">
                                            <el-option-group v-for="group in groupFieldInfo" :key="group.moduleName" :label="group.moduleName">
                                                <el-option v-for="(item,index) in group.field" :key="index" :label="item.fieldName" :value="item" :disabled="item.disabled">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </div>
                                    <div class="selectBoxitem">
                                        <span class="selectBox-title">排序顺序</span>
                                        <el-select v-model="title1Sort" placeholder="请选择">
                                            <el-option label="升序" value="0"></el-option>
                                            <el-option label="降序" value="1"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="selectBox">
                                    <div class="selectBoxitem">
                                        <span class="selectBox-title">指定列标题</span>
                                        <el-select v-model="XdataOptions[1]" placeholder="请选择" value-key="fieldId" @change="selcetPass">
                                            <el-option-group v-for="group in groupFieldInfo" :key="group.moduleName" :label="group.moduleName">
                                                <el-option v-for="(item,index) in group.field" :key="index" :label="item.fieldName" :value="item" :disabled="item.disabled">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </div>
                                    <div class="selectBoxitem">
                                        <span class="selectBox-title">排序顺序</span>
                                        <el-select v-model="title2Sort" placeholder="请选择">
                                            <el-option label="升序" value="0"></el-option>
                                            <el-option label="降序" value="1"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="求和的列" name="third">
                        <div class="tabBody">
                            <div class="checkBoxHeader">
                                <el-row :gutter="20">
                                    <el-col :span="8"><span style="padding-left: 20px;">列</span></el-col>
                                    <el-col :span="4"><span class="titlespan">总和</span></el-col>
                                    <el-col :span="4"><span class="titlespan">平均值</span></el-col>
                                    <el-col :span="4"><span class="titlespan">最小值</span></el-col>
                                    <el-col :span="4"><span class="titlespan">最大值</span></el-col>
                                </el-row>
                            </div>
                            <div class="checkBoxBody" v-if="reportData.reportType != 2">
                                <el-row :gutter="20" v-for="(list,indexs) in sumFieldInfo" :key="indexs">
                                    <el-col :span="8"><span style="padding-left: 10px;">{{list.moduleName}}-{{list.fieldName}}</span></el-col>
                                    <el-checkbox-group v-model="sumFieldInfo[indexs].checkList" @change="checkGroup">
                                        <el-col :span="4">
                                            <span class="titlespan">
                                                <el-checkbox label="isSum"><span class="checkboxText">a</span></el-checkbox>
                                            </span>
                                        </el-col>
                                        <el-col :span="4">
                                            <span class="titlespan">
                                                <el-checkbox label="isAvg"><span class="checkboxText">a</span></el-checkbox>
                                            </span></el-col>
                                        <el-col :span="4">
                                            <span class="titlespan">
                                                <el-checkbox label="isMin"><span class="checkboxText">a</span></el-checkbox>
                                            </span>
                                        </el-col>
                                        <el-col :span="4">
                                            <span class="titlespan">
                                                <el-checkbox label="isMax"><span class="checkboxText">a</span></el-checkbox>
                                            </span>
                                        </el-col>
                                    </el-checkbox-group>
                                </el-row>
                            </div>
                            <div v-if="reportData.reportType == 2">
                                <el-radio-group v-model="radio" @change="crossCheckGroup" style="width: 100%;font-size:14px!important">
                                    <el-row :gutter="20" v-for="(list,indexs) in sumFieldInfo" :key="indexs" style="height: 40px;line-height: 40px;">
                                        <el-col :span="8"><span style="padding-left: 10px;">{{list.moduleName}}-{{list.fieldName}}</span></el-col>
                                        <el-col :span="16">
                                            <div style="width: 100%">
                                                <el-col :span="6">
                                                    <span class="titlespan">
                                                        <el-radio :label="'isSum'+ '/' + list.fieldId"><span class="checkboxText">a</span></el-radio>
                                                    </span>
                                                </el-col>
                                                <el-col :span="6">
                                                    <span class="titlespan">
                                                        <el-radio :label="'isAvg'+ '/' + list.fieldId"><span class="checkboxText">a</span></el-radio>
                                                    </span></el-col>
                                                <el-col :span="6">
                                                    <span class="titlespan">
                                                        <el-radio :label="'isMin'+ '/' + list.fieldId"><span class="checkboxText">a</span></el-radio>
                                                    </span>
                                                </el-col>
                                                <el-col :span="6">
                                                    <span class="titlespan">
                                                        <el-radio :label="'isMax' + '/' + list.fieldId"><span class="checkboxText">a</span></el-radio>
                                                    </span>
                                                </el-col>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" style="height: 40px;line-height: 40px;">
                                        <el-col :span="8"><span style="padding-left: 10px;">记录数</span></el-col>
                                        <el-col :span="16">
                                            <el-col :span="6">
                                                <span class="titlespan">
                                                    <el-radio label="0"><span class="checkboxText">a</span></el-radio>
                                                </span>
                                            </el-col>
                                        </el-col>
                                    </el-row>
                                </el-radio-group>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- 图表在普通报表和汇总报表没有选择分组时候不显示 -->
        <div class="selectWrap" v-show="(reportData.reportType==1&&XdataOptions.length>0) || (reportData.reportType==2&&isCheck&&XdataOptions.length==2)">
            <div class="leftTitle" style="height:22px;line-height: 22px;">图表显示</div>
            <div class="rightTabbox chartBox">
                <el-switch v-model="chartSwitch" on-text="" off-text=""></el-switch>
                <div v-show="chartSwitch" class="chartChoice">
                    <div class="chartSpecies">
                        <img v-bind:src="imgSrc">
                    </div>
                    <el-form :inline="true" :model="formInline" class="chartModel">
                        <el-form-item>
                            <el-select v-model="formInline.modelOptions" placeholder="请选择图形" @change="chartChoice">
                                <el-option v-for="item in chartModeloptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="X轴">
                            <el-select v-model="formInline.Xdata" placeholder="请选择X轴" @change="changeXdata">
                                <el-option v-for="item in XdataOptions" :key="item.key" :label="item.fieldName" :value="item.fieldId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Y轴">
                            <el-select v-model="formInline.Ydata" placeholder="请选择Y轴" @change="changeYdata">
                                <el-option-group v-for="group in YdataOptions" :key="group.fieldName" :label="group.fieldName">
                                    <el-option v-for="(item,index) in group.checkList" :key="index" :label="item" :value="item+'_'+group.fieldId">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="selectWrap">
            <div class="leftTitle"></div>
            <div>
                <el-button type="primary" @click="backPrev">上一步</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
                <el-button type="primary" @click="save('ruleForm')" :loading="isLoading" v-show="this.$route.query.hasOwnProperty('reportId')">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'createsecond',
    props: {
        reportData: {
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
            radio: '',
            isLoading: false,
            ruleForm: {
                mainModule: '', // 主模块
                relyModule: '' // 相关模块
            },
            mainModuleList: [], // 主模块下拉
            relyModuleList: [], // 相关模块下拉
            groupFieldInfo: [], // 分组字段
            sumFieldInfo: [], // 求和字段
            fieldInfo: [], // 普通字段
            activeName: 'second',
            dataColumn: [],
            chartSwitch: true,
            chartModeloptions: [{
                value: '0',
                label: '饼图'
            }, {
                value: '3',
                label: '柱状图'
            }],
            //  {
            //     value: '1',
            //     label: '环形图'
            // }, {
            //     value: '4',
            //     label: '折线图'
            // }, {
            //     value: '2',
            //     label: '漏斗图'
            // },
            chartModel: '',
            formInline: {
                Xdata: '',
                modelOptions: '0',
                Ydata: '',
                Grouping: ''
            },
            title1Sort: '0',
            title2Sort: '0',
            title2: '',
            title3: '',
            imgSrc: '/static/customReport/Group1.png',
            rules: {
                mainModule: [
                    { required: true, message: '选择主数据', trigger: 'change' }
                ]
            },
            moduleCodes: [], // 选择的模块号
            XdataOptions: [], // X轴下拉数组
            YdataOptions: [], // Y轴下拉数组
            isCheck: false, // 求和的列是否有选择项
            message: '', // 警告内容
            parameObject: {
                fieldId: 0,
                isShow: 1,
                sortOrder: 0,
                isGroup: 1,
                groupOrder: -1,
                isOrder: 1,
                orderRule: -1,
                isSum: 1,
                isAvg: 1,
                isMin: 1,
                isMax: 1,
                isXAxial: 1,
                isYAxial: 1,
                isCharGroup: 1,
                groupSort: 0
            },
            commonArr: [],
            sumArr: [],
            groupArr: [],
            isYAxialId: 0,
            changeModuleFlag: false,
            isEdit: false,
            editData: [],
            getChartInfo: {},
            flagRender: false, // 标记回显是否渲染
            isRecords: 1 // 是否统计记录数(普通表格 1 汇总 0 交叉选择统计记录数是为0不选时为1)
        }
    },
    created() {
        this.getmainModule()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        changeFlag() {
            this.changeModuleFlag = false
        },
        checkGroup(value) {
            this.YdataOptions = []
            var isCheckList = this.sumFieldInfo.filter(item => item.checkList.length > 0) // 判断是否选择了求和列
            if (isCheckList.length > 0) {
                this.isCheck = true
            }
            let YOptions = this.sumFieldInfo.filter(item => item.checkList.length > 0)
            let cloneYOptions = JSON.parse(JSON.stringify(YOptions))
            var maps = { 'isSum': '求和', 'isAvg': '平均', 'isMin': '最小值', 'isMax': '最大值' }
            cloneYOptions.map(item => {
                item.checkList = item.checkList.map(i => { return maps[i] })
            })
            this.YdataOptions = cloneYOptions
            // 汇总报表求和的列改变项正好是y轴下拉选择值时 清空y轴选中值 start
            let flagHas = true // 标记checkList里有没有y轴选择值
            let flag = true // 标记fieldId有没有
            this.YdataOptions.map(item => {
                let idStr = this.formInline.Ydata.split('_')
                if (item.fieldId == idStr[1]) {
                    flag = false
                    if (item.checkList.indexOf(idStr[0]) < 0) {
                        flagHas = false
                    }
                }
            })
            if (!flagHas || flag) {
                this.formInline.Ydata = ''
            }
            // end
            let records = {
                fieldName: '选择',
                fieldId: 0,
                checkList: ['记录数']
            }
            this.YdataOptions.push(records)
        },
        // 交叉报表
        crossCheckGroup(value) {
            // 由于交叉报表求和的列全部选项只能选一个，每次选择后初始化之前的选项
            this.sumFieldInfo.map(item => {
                item.checkList = []
            })
            this.YdataOptions = []
            this.isCheck = true
            var maps = { 'isSum': '求和', 'isAvg': '平均', 'isMin': '最小值', 'isMax': '最大值' }
            let records = {
                fieldName: '选择',
                fieldId: 0,
                checkList: ['记录数']
            }
            if (this.radio.length > 1) {
                let index = this.radio.indexOf('/')
                let fieldId = this.radio.slice(index + 1, this.radio.length)
                let type = this.radio.slice(0, index)
                this.sumFieldInfo.map(item => {
                    if (item.fieldId == fieldId) {
                        item.checkList.push(type)
                        this.YdataOptions.push(JSON.parse(JSON.stringify(item)))
                    }
                })
            } else if (this.radio == 0) {
                this.isRecords = 0
            }
            this.YdataOptions.map(item => {
                item.checkList = item.checkList.map(i => { return maps[i] })
            })
            this.YdataOptions.push(records)
            // 当求和的列数据改变正好是y轴已选下拉值时，清除y轴已选下拉值
            let flagHas = false
            this.YdataOptions.map(item => {
                let idStr = this.formInline.Ydata.split('_')
                if (item.fieldId == idStr[1]) {
                    flagHas = true
                }
            })
            if (!flagHas) {
                this.formInline.Ydata = ''
            }
        },
        // x轴下拉值改变，把下拉数组中该下拉值isXAxial属性设置为0
        changeXdata() {
            let that = this
            var arr = this.XdataOptions.map(function (item) {
                item.isXAxial = 1
                if (item.fieldId == that.formInline.Xdata) {
                    item.isXAxial = 0
                    return item
                } else {
                    return item
                }
            })
            this.XdataOptions = arr
        },
        // y轴下拉值改变，把下拉数组中该下拉值isYAxial属性设置为0
        changeYdata(value) {
            // let that = this
            let indexNum = this.formInline.Ydata.indexOf('_')
            let yString = this.formInline.Ydata.substring(indexNum + 1, this.formInline.Ydata.length)
            this.isYAxialId = yString
        },
        // 穿梭框数据改变
        changeDataColumn(val) {
            // console.log(val)
        },
        chartChoice() {
            var value = this.formInline.modelOptions
            switch (value) {
                case '0': this.imgSrc = '/static/customReport/Group1.png'
                    break
                case '1': this.imgSrc = '/static/customReport/Group2.png'
                    break
                case '4': this.imgSrc = '/static/customReport/Group5.png'
                    break
                case '2': this.imgSrc = '/static/customReport/Group3.png'
                    break
                case '3': this.imgSrc = '/static/customReport/Group4.png'
                    break
            }
        },
        selectvalue() {
            if (this.value5.length > 2) {
                for (let item of this.options) {
                    // 删选出已经选择的数据
                    if (this.value5.indexOf(item.value) < 0) {
                        item.disabled = true
                    }
                }
            } else {
                for (let item of this.options) {
                    item.disabled = false
                }
            }
        },
        handleClick(tab, event) {
            // console.log(tab, event)
        },
        submitForm(formName) {
            let type = this.reportData.reportType
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    switch (type) {
                        case 0: // 普通报表：列必选，求和可选
                            if (this.isSelectCommon()) {
                                // this.processArrCommon() // 获取普通列参数
                                // this.processArrSum() // 获取求和列参数
                                this.$emit('getModuleCodes', this.moduleCodes)
                                this.SummaryParamesData()
                                this.$emit('changeTabData', '3')
                            } else {
                                this.$message({
                                    message: '请选择列',
                                    type: 'warning'
                                })
                            }
                            break
                        case 1: // 汇总报表：列必选，分组和求和的列可选，如果分组和求和的列都选择，X,Y轴下拉选择也必选
                            if (this.isSelectCommon() && this.isSelectXYdata()) {
                                console.log(111)
                                this.$emit('getModuleCodes', this.moduleCodes)
                                this.$emit('changeTabData', '3')
                            } else {
                                this.$message({
                                    message: this.message,
                                    type: 'warning'
                                })
                            }
                            break
                        case 2: // 交叉报表
                            if (this.isCheck && this.XdataOptions.length == 2) {
                                this.isSelectXYdata()
                                this.$emit('getModuleCodes', this.moduleCodes)
                                this.$emit('changeTabData', '3')
                            } else if (!this.isCheck) {
                                this.$message({
                                    message: '请选择求和的列',
                                    type: 'warning'
                                })
                            } else if (this.XdataOptions.length < 2) {
                                this.$message({
                                    message: '请选择分组',
                                    type: 'warning'
                                })
                            } else {
                                this.$message({
                                    message: '请选择分组和求和的列',
                                    type: 'warning'
                                })
                            }
                    }
                    this.$emit('flagModule', this.changeModuleFlag)
                } else {
                    return false
                }
            })
        },
        // 汇总参数
        SummaryParamesData() {
            var summaryParames = []
            this.processArrCommon()
            this.processArrGroup()
            this.processArrSum()
            // 合并列，分组，求和列数据
            summaryParames = summaryParames.concat(this.commonArr, this.groupArr, this.sumArr)
            // 合并重复fieldId的对象属性
            var repeatParmesMap = summaryParames.reduce((ret, cur) => {
                if (ret.has(cur.fieldId)) {
                    ret.set(cur.fieldId, Object.assign({}, ret.get(cur.fieldId), cur))
                } else {
                    ret.set(cur.fieldId, cur)
                }
                return ret
            }, new Map())
            let repeatParmes = [...repeatParmesMap.values()]
            // 把y轴选择值属性加入 并补齐其他属性
            repeatParmes.map((item, index) => {
                if (item.fieldId == this.isYAxialId) {
                    item.isYAxial = 0
                }
                item.sortOrder = index + 1
                for (let i in this.parameObject) {
                    if (!item.hasOwnProperty(i)) {
                        item[i] = this.parameObject[i]
                    }
                }
            })
            let secondParames = {
                fields: [],
                reportInfo: {}
            }
            secondParames.fields = repeatParmes
            // 主数据模块
            secondParames.reportInfo.mainModule = this.moduleCodes[0]
            // 依赖数据模块
            if (this.moduleCodes[1]) {
                secondParames.reportInfo.relyModule1 = this.moduleCodes[1]
            } else {
                secondParames.reportInfo.relyModule1 = ''
            }
            if (this.moduleCodes[2]) {
                secondParames.reportInfo.relyModule2 = this.moduleCodes[2]
            } else {
                secondParames.reportInfo.relyModule2 = ''
            }
            if (this.moduleCodes[3]) {
                secondParames.reportInfo.relyModule3 = this.moduleCodes[3]
            } else {
                secondParames.reportInfo.relyModule3 = ''
            }
            Object.assign(secondParames.reportInfo, this.reportData)
            // chartType 图表类型  bug 带完善
            if (secondParames.reportInfo.reportType == 0) {
                secondParames.reportInfo.chartType = -1
            } else {
                secondParames.reportInfo.chartType = parseInt(this.formInline.modelOptions)
            }
            // 增加字段yCountType
            // formInline.Ydata
            let indexNum = this.formInline.Ydata.indexOf('_')
            let yString = this.formInline.Ydata.substring(0, indexNum)
            switch (yString) {
                case '求和':
                    secondParames.reportInfo.yCountType = 1
                    break
                case '平均':
                    secondParames.reportInfo.yCountType = 2
                    break
                case '最小值':
                    secondParames.reportInfo.yCountType = 4
                    break
                case '最大值':
                    secondParames.reportInfo.yCountType = 3
                    break
                case '记录数':
                    secondParames.reportInfo.yCountType = 5
                    break
            }
            secondParames.reportInfo.isRecords = this.isRecords
            this.$emit('secondParames', secondParames)
            return secondParames
        },
        isSelectCommon() { // 是否选择列
            if (this.dataColumn.length > 0) {
                return true
            } else {
                this.message = '请选择列！'
            }
        },
        isSelectXYdata() { // 是否选择X,Y轴数据
            let that = this
            if (that.XdataOptions.length > 0) { // 如果选择了分组
                if (!that.formInline.Xdata) {
                    this.message = 'X轴数据不能为空'
                    return false
                } else if (!that.formInline.Ydata) {
                    this.message = 'Y轴数据不能为空！'
                    return false
                } else {
                    // this.processArrCommon()
                    // this.processArrGroup()
                    // this.processArrSum()
                    that.SummaryParamesData() // 拼接第二步参数
                    return true
                }
            } else {
                // this.processArrCommon()
                // this.processArrGroup()
                // this.processArrSum()
                that.SummaryParamesData() // 拼接第二步参数
                that.$emit('getModuleCodes', that.moduleCodes)
                that.$emit('changeTabData', '3')
                return true
            }
        },
        // 求和列参数
        processArrSum() {
            var arrCommon = []
            var that = this
            var filterSumFieldInfo = that.sumFieldInfo.filter(item => item.checkList.length > 0)
            filterSumFieldInfo.map(function (item) {
                // var newObjCommon = JSON.parse(JSON.stringify(that.parameObject))
                var newObjCommon = {}
                newObjCommon.fieldId = item.fieldId
                // 把checkList数组中的元素增加到对应的属性中
                item.checkList.forEach(ele => {
                    switch (ele) {
                        case 'isSum':
                            newObjCommon.isSum = 0
                            break
                        case 'isAvg':
                            newObjCommon.isAvg = 0
                            break
                        case 'isMin':
                            newObjCommon.isMin = 0
                            break
                        case 'isMax':
                            newObjCommon.isMax = 0
                            break
                    }
                })
                let _obj = JSON.stringify(newObjCommon)
                let objClone = JSON.parse(_obj)
                arrCommon.push(objClone)
            })
            this.sumArr = arrCommon
            // console.log('求和列', this.sumArr)
        },
        // 普通列参数
        processArrCommon() {
            var arrCommon = []
            var that = this
            for (let i = 0; i < this.dataColumn.length; i++) {
                // var newObjCommon = JSON.parse(JSON.stringify(that.parameObject))
                var newObjCommon = {}
                newObjCommon.fieldId = that.dataColumn[i]
                newObjCommon.isShow = 0
                // newObjCommon.sortOrder = i + 1
                let _obj = JSON.stringify(newObjCommon)
                let objClone = JSON.parse(_obj)
                arrCommon.push(objClone)
            }
            this.commonArr = arrCommon
            // console.log('列', this.commonArr)
        },
        // 分组参数
        processArrGroup() {
            var arrGroup = []
            var that = this
            // 设置x轴数据下拉选项
            if (this.XdataOptions[0]) {
                this.$set(this.XdataOptions[0], 'groupOrder', this.title1Sort)
            }
            if (this.XdataOptions[1]) {
                this.$set(this.XdataOptions[1], 'groupOrder', this.title2Sort)
            }
            // if (this.XdataOptions[2]) {
            //     this.$set(this.XdataOptions[2], 'groupOrder', this.title3Sort)
            // }
            if (this.XdataOptions.length > 0) {
                for (let i = 0; i < this.XdataOptions.length; i++) {
                    // let parameGroupObject = JSON.parse(JSON.stringify(that.parameObject))
                    let parameGroupObject = {}
                    parameGroupObject.groupSort = 1 // 分组排序
                    var newObjCommon = JSON.parse(JSON.stringify(parameGroupObject))
                    newObjCommon.fieldId = that.XdataOptions[i].fieldId
                    newObjCommon.isGroup = 0
                    newObjCommon.groupSort = i + 1
                    if (this.XdataOptions[i].isXAxial == 0) {
                        newObjCommon.isXAxial = this.XdataOptions[i].isXAxial
                    }
                    newObjCommon.groupOrder = parseInt(this.XdataOptions[i].groupOrder)
                    let _obj = JSON.stringify(newObjCommon)
                    let objClone = JSON.parse(_obj)
                    arrGroup.push(objClone)
                }
            }
            this.groupArr = arrGroup
            // console.log('分组', this.groupArr)
        },
        backPrev() {
            this.$emit('changeTabData', '1')
        },
        // 获取主数据下拉
        getmainModule() {
            this.$http.get(this.Global.baseURL + this.Global.api.v1.mainModule)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.mainModuleList = res.body.data.module
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 主数据选择值改变触发
        changeModule() {
            if (!this.isEdit) {
                this.relyModuleList = [] // 关联数据下拉初始化
                this.dataColumn = [] // 已选列初始化
                this.XdataOptions = [] // x轴下拉数组初始化
                this.ruleForm.relyModule = '' // 关联数据值初始化
                this.formInline.Xdata = '' // x轴下拉值初始化
                this.formInline.Ydata = '' // y轴下拉值初始化
                this.getRelyModule()
                this.getReportField()
                this.moduleCodes = []
                this.moduleCodes.push(this.ruleForm.mainModule) // 选择的主数据放入模块号
                this.changeModuleFlag = true
            } else {
                this.getRelyModule()
            }
        },
        // 获取关联数据下拉
        getRelyModule() {
            let data = {
                moduleCode: this.ruleForm.mainModule
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.relyModule, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.relyModuleList = res.body.data.module
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        changeRelyModule() {
            if (!this.isEdit) {
                this.moduleCodes = [] // 初始化
                this.moduleCodes.push(this.ruleForm.mainModule) // 选择的主数据放入模块号
                if (this.relyModuleList.length > 0) {
                    this.getReportField()
                }
                this.moduleCodes.push(this.ruleForm.relyModule)
            }
        },
        // 获取模块字段(数据内容)
        getReportField() {
            let moduleCodes = ''
            if (this.ruleForm.relyModule != '') {
                // newModuleCodes = moduleCodes.concat(this.ruleForm.relyModule)
                moduleCodes = this.ruleForm.mainModule + ',' + this.ruleForm.relyModule
            } else {
                moduleCodes = this.ruleForm.mainModule
            }
            let type
            switch (this.reportData.reportType) {
                case 0: type = 'simple'
                    break
                case 1: type = 'summary'
                    break
                case 2: type = 'matrix'
                    break
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.reportField, {
                params: {
                    moduleCodes: moduleCodes,
                    type: type
                }
            })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        if (res.body.data.sumFieldInfo) {
                            this.sumFieldInfo = res.body.data.sumFieldInfo
                        }
                        if (res.body.data.fieldInfo) {
                            this.fieldInfo = res.body.data.fieldInfo
                            this.processFieldInfo()
                        }
                        if (res.body.data.groupFieldInfo) {
                            this.groupFieldInfo = res.body.data.groupFieldInfo
                        }
                        // 求和字段数组降维 sumFieldInfo
                        let result = []
                        let arr = this.sumFieldInfo
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].field.length != 0) {
                                for (var n = 0; n < arr[i].field.length; n++) {
                                    arr[i].field[n].moduleName = arr[i].moduleName
                                    this.$set(arr[i].field[n], 'checkList', []) // 多选选中后的值
                                    result.push(arr[i].field[n])
                                }
                            }
                        }
                        this.sumFieldInfo = result
                        // 回显选择数据内容
                        if (this.isEdit) {
                            this.setEditData()
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
        // 处理普通字段数据格式
        processFieldInfo() {
            let data = []
            let that = this
            for (var item of that.fieldInfo) {
                for (let i = 0; i < item.field.length; i++) {
                    data.push({
                        key: item.field[i].fieldId,
                        label: item.moduleName + '_' + item.field[i].fieldName
                    })
                }
            }
            this.fieldInfo = data
        },
        selcetPass(value) {
            // 已经选择过的值给disabled属性
            let that = this
            for (let i = 0; i < this.groupFieldInfo.length; i++) {
                for (let y = 0; y < this.groupFieldInfo[i].field.length; y++) {
                    let objId = this.groupFieldInfo[i].field[y].fieldId
                    let filterArr = that.XdataOptions.filter(item => item.fieldId == objId) // 过滤出三个下拉值已经选择的fieldId
                    if (filterArr.length > 0) {
                        this.$set(this.groupFieldInfo[i].field[y], 'disabled', true)
                    } else {
                        this.$set(this.groupFieldInfo[i].field[y], 'disabled', false)
                    }
                }
            }
            // 当分组下拉值改变的是x轴已选项 就把x轴已选项清除
            let flagHas = false
            this.XdataOptions.map(item => {
                if (item.fieldId == this.formInline.Xdata) {
                    flagHas = true
                }
            })
            if (!flagHas) {
                this.formInline.Xdata = ''
            }
            // 汇总报表时，选择了分组，如果y轴下拉没有记录数时y轴下拉加入记录数
            if (this.reportData.reportType == 1) {
                let filter = this.YdataOptions.filter(item => item.fieldId == 0)
                if (filter.length == 0) {
                    let records = {
                        fieldName: '选择',
                        fieldId: 0,
                        checkList: ['记录数']
                    }
                    this.YdataOptions.push(records)
                }
            }
        },
        async getReportPage2() {
            let { reportId } = this.$route.query
            if (reportId) {
                this.isEdit = true
                await this.$http.get(this.Global.baseURL + this.Global.api.v1.reportPage2, { params: { reportId: reportId } })
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            var arr = Object.keys(res.body.data) // 对象非空校验
                            if (arr.length > 0) {
                                this.ruleForm.mainModule = res.body.data.mainModule
                                if (res.body.data.relyModule1 != '') {
                                    this.ruleForm.relyModule = res.body.data.relyModule1
                                }
                                this.editData = res.body.data.reportFields
                                if (res.body.data.yCountType != undefined) {
                                    this.getChartInfo.yCountType = res.body.data.yCountType
                                }
                                if (res.body.data.chartType != undefined) {
                                    this.getChartInfo.chartType = res.body.data.chartType
                                }
                                if (res.body.data.isRecords == 0 && this.reportData.reportType == 2) {
                                    this.radio = '0' // 在交叉报表求和的列选择记录数时，回显求和的列
                                }
                                if (res.body.data.yCountType == 5) { // 图表y轴选中值
                                    this.formInline.Ydata = '记录数_0'
                                }
                                this.getReportField()
                            }
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
        setEditData() {
            // 筛选普通列
            let filfterCommon = this.editData.filter(item => item.isShow == 0)
            function sortOrder(a, b) {
                return a.sortOrder - b.sortOrder
            }
            filfterCommon.sort(sortOrder)
            let commonArrId = []
            filfterCommon.forEach(item => {
                commonArrId.push(item.fieldId)
            })
            this.dataColumn = commonArrId
            // 筛选求和列
            let filfterSum = this.editData.filter(item => item.isSum == 0 || item.isAvg == 0 || item.isMax == 0 || item.isMin == 0)
            // console.log('求和', filfterSum)
            if (filfterSum.length > 0) {
                this.isCheck = true
            }
            filfterSum.forEach(item => {
                let sumObject = []
                if (item.isSum == 0) {
                    sumObject.push('isSum')
                }
                if (item.isAvg == 0) {
                    sumObject.push('isAvg')
                }
                if (item.isMax == 0) {
                    sumObject.push('isMax')
                }
                if (item.isMin == 0) {
                    sumObject.push('isMin')
                }
                if (this.reportData.reportType == 1) { // 汇总报表
                    this.sumFieldInfo.map(ele => {
                        if (ele.fieldId == item.fieldId) {
                            ele.checkList = JSON.parse(JSON.stringify(sumObject))
                        }
                    })
                }
                if (this.reportData.reportType == 2) { // 交叉报表
                    this.radio = sumObject.join('') + '/' + item.fieldId
                }
            })
            // 筛选分组
            let filfterGroup = this.editData.filter(item => item.isGroup == 0)
            // 降维数组
            let groupFieldInfoArr = []
            this.groupFieldInfo.forEach(item => {
                groupFieldInfoArr.push(...item.field)
            })
            // 筛选出的数组按groupSort排序
            function sortId(a, b) {
                return a.groupSort - b.groupSort
            }
            filfterGroup.sort(sortId)
            let groupArr = []
            filfterGroup.map(item => {
                let groupOb = {}
                groupOb.disabled = true
                groupOb.fieldId = item.fieldId
                groupFieldInfoArr.map(ele => {
                    if (ele.fieldId == item.fieldId) {
                        groupOb.fieldName = ele.fieldName
                    }
                })
                groupArr.push(JSON.parse(JSON.stringify(groupOb)))
            })
            this.XdataOptions = groupArr
            if (filfterGroup[0]) {
                this.title1Sort = filfterGroup[0].groupOrder + ''
            }
            if (filfterGroup[1]) {
                this.title2Sort = filfterGroup[1].groupOrder + ''
            }
            if (filfterGroup[2]) {
                this.title3Sort = filfterGroup[2].groupOrder + ''
            }
            // 图表
            if (this.getChartInfo.chartType > -1) {
                this.chartSwitch = true
                this.formInline.modelOptions = this.getChartInfo.chartType + ''
            } else {
                this.chartSwitch = false
            }
            // x轴数据
            let filfterXData = this.editData.filter(item => item.isXAxial == 0)
            if (filfterXData.length > 0) {
                this.formInline.Xdata = filfterXData[0].fieldId
            }
            // y轴数据
            let filfterYData = this.editData.filter(item => item.isYAxial == 0)
            if (filfterYData.length > 0) {
                let filfterYOption = filfterYData[0]
                let Ydata
                switch (this.getChartInfo.yCountType) {
                    case 2: Ydata = '平均'
                        break
                    case 3: Ydata = '最大值'
                        break
                    case 4: Ydata = '最小值'
                        break
                    case 1: Ydata = '求和'
                        break
                    case 0: Ydata = '记录数'
                }
                this.formInline.Ydata = Ydata + '_' + filfterYOption.fieldId
                // y轴下拉
                let YOptions = this.sumFieldInfo.filter(item => item.checkList.length > 0)
                let cloneYOptions = JSON.parse(JSON.stringify(YOptions))
                var maps = { 'isSum': '求和', 'isAvg': '平均', 'isMin': '最小值', 'isMax': '最大值' }
                cloneYOptions.map(item => {
                    item.checkList = item.checkList.map(i => { return maps[i] })
                })
                this.YdataOptions = cloneYOptions
            }
        },
        save(formName) {
            let editParamesData = this.SummaryParamesData()
            let currentFields = editParamesData.fields
            let that = this
            var sameResult = []
            var differentResult = []
            var differentResultId = [] // 改变的数据fieldId
            let currentResultId = []
            let originalId = [] // 获取到的数据that.editData的fieldId
            // 比对当前数据和返回数据的不同
            currentFields.forEach(item => {
                let cloneItem = {}
                // 对对象排序
                cloneItem.fieldId = item.fieldId
                cloneItem.groupOrder = item.groupOrder
                cloneItem.groupSort = item.groupSort
                cloneItem.isAvg = item.isAvg
                cloneItem.isCharGroup = item.isCharGroup
                cloneItem.isGroup = item.isGroup
                cloneItem.isMax = item.isMax
                cloneItem.isMin = item.isMin
                cloneItem.isOrder = item.isOrder
                cloneItem.isShow = item.isShow
                cloneItem.isSum = item.isSum
                cloneItem.isXAxial = item.isXAxial
                cloneItem.isYAxial = item.isYAxial
                cloneItem.orderRule = item.orderRule
                cloneItem.sortOrder = item.sortOrder
                let obj = JSON.stringify(cloneItem)
                currentResultId.push(item.fieldId)
                let isExist = false
                that.editData.forEach((ele, index) => {
                    let aj = JSON.stringify(ele)
                    if (obj == aj) {
                        isExist = true
                        sameResult.push(JSON.parse(aj))
                        return false
                    }
                })
                if (!isExist) {
                    differentResult.push(JSON.parse(obj))
                    differentResultId.push(JSON.parse(obj).fieldId)
                }
            })
            // console.log('sameResult', sameResult)
            // console.log('differentResult', differentResult)
            that.editData.forEach((ele, index) => {
                originalId.push(ele.fieldId)
            })
            let currentChartInfo = {} // 图表类型和Y轴统计方式
            currentChartInfo.yCountType = editParamesData.reportInfo.yCountType
            currentChartInfo.chartType = editParamesData.reportInfo.chartType
            // let _this = this
            // function saveField(params) {
            //     var deleteField = []
            //     let difChartInfo = {}
            //     if (currentChartInfo.yCountType != _this.getChartInfo.yCountType) {
            //         difChartInfo.yCountType = currentChartInfo.yCountType
            //     }
            //     if (currentChartInfo.chartType != _this.getChartInfo.chartType) {
            //         difChartInfo.chartType = currentChartInfo.chartType
            //     }
            //     console.log(differentResultId, originalId)
            //     //   删除的id包括当前数据对比后台返回数据不同的id，和后台返回数据对比当前数据少的部分id
            //     differentResultId.forEach(item => {
            //         originalId.forEach(ele => {
            //             if (item == ele) {
            //                 deleteField.push(item)
            //                 return false
            //             }
            //         })
            //     })
            //     originalId.forEach(item => {
            //         if (currentResultId.indexOf(item) < 0) {
            //             deleteField.push(item)
            //             return false
            //         }
            //     })
            //     let { reportId } = _this.$route.query
            //     let transferParams = {
            //         reportId: reportId,
            //         info: {}
            //     }
            //     if (deleteField.length > 0) {
            //         transferParams.info.deleteField = deleteField
            //     }
            //     if (Object.keys(difChartInfo).length > 0) {
            //         transferParams.info.chartInfo = difChartInfo
            //     }
            //     if (differentResult.length > 0) {
            //         transferParams.info.addField = differentResult
            //     }
            //     _this.putReportPage(transferParams)
            // }
            let { reportId } = this.$route.query
            let transferParams = {
                reportId: reportId,
                info: {}
            }
            let _this = this
            function dataParmas(params) {
                if (JSON.stringify(currentChartInfo) == JSON.stringify(_this.getChartInfo)) { // 如果图表类型没有改变
                    transferParams.info.addField = currentFields
                } else if (differentResult.length == 0) { // 如果没有改变字段
                    transferParams.info.chartInfo = currentChartInfo
                } else {
                    transferParams.info.addField = currentFields
                    transferParams.info.chartInfo = currentChartInfo
                }
                _this.putReportPage(transferParams)
            }
            if (differentResult.length == 0 && JSON.stringify(currentChartInfo) == JSON.stringify(this.getChartInfo)) {
                this.$message.error('您暂时没有需要保存的字段！')
            } else if (this.reportData.reportType != 2 && this.isSelectCommon()) {
                console.log('当前', currentFields, currentChartInfo)
                dataParmas()
            } else if (this.reportData.reportType == 2) {
                console.log('当前', currentFields, currentChartInfo)
                dataParmas()
            } else {
                this.$message({
                    message: this.message,
                    type: 'warning'
                })
            }
        },
        putReportPage(data) {
            this.isLoading = true
            this.$http.put(this.Global.baseURL + this.Global.api.v1.reportPage2, data)
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
        reportData: {
            handler(val, old) {
                var type = val.reportType
                switch (type) {
                    case 0:
                        this.isRecords = 1
                        this.activeName = 'first'
                        break
                    case 1:
                        this.isRecords = 0
                        this.activeName = 'first'
                        break
                    case 2:
                        this.isRecords = 1
                        this.activeName = 'second'
                        break
                }
            },
            deep: true
        },
        async tabData(val) {
            // this.getReportPage2().then(success => this.getReportField())
            //     .catch(error => console.log('失败', error))
            if (val == 2 && !this.flagRender) {
                this.flagRender = true
                await this.getReportPage2()
            }
        }
    }
}
</script>
<style lang="less">
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
