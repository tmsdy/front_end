<template>
    <!-- 导入 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogAddPeople" :closeOnClickModal="false"  custom-class="width1020" :modal-append-to-body="false">
        <div class="importScoll" :style="'height:'+boxHeight">
            <div class="importBox">
                <el-steps :active="active"  :space="445"  finish-status="success" style="margin-left:11px;">
                    <!-- 选择数据 -->
                    <el-step style="margin-left:0px;" :title="$t('mxpcweb.client.1529048322729')"></el-step>
                    <!-- 字段映射 -->
                    <el-step style="margin-left:0px;" :title="$t('mxpcweb.client.1529048696613')"></el-step>
                    <!-- 开始导入 -->
                    <el-step style="margin-left:0px;" :title="$t('mxpcweb.client.1529048714007')"></el-step>
                </el-steps>
                <div class="listBox">
                    <div class="listBox1 listBox3 MXscroll" v-show="active==0">
                        <div class="content">
                            <div>
                                <!-- 选择要导入商品的大类 -->
                                1.{{$t('mxpcweb.PP001.PP001List.1550125591038')}}
                                <!-- 选择分类 -->
                                <el-select v-model="goodsType" filterable clearable @change="goodsTypeChange" :placeholder="$t('mxpcweb.PP001.PP001List.1543304945491')" style="margin:0 10px;">
                                    <div v-for="item in classTypeInUseList" :key="item.value+''">
                                        <el-option :label="item.label" :value="item.value+''">
                                        </el-option>
                                    </div>
                                </el-select>
                            </div>
                            <br>
                            <!-- <img style="width: 882px;height: 88px;" src="./img/u10896.png"> -->
                        </div>
                        <template v-if="goodsType != ''">
                            <div class="content">
                                <!-- 按照导入模板的格式准备导入数据 -->
                                <div>2.{{$t('mxpcweb.client.1529048732259')}}
                                    <span class="text-hover" style="color:#008cee;padding-left:10px;" @click="downloadModel">
                                        <i class="iconfont icon-download" style="margin-right:5px;"></i>
                                        <!-- 下载导入模板 -->
                                        {{$t('mxpcweb.client.1529048780122')}}
                                    </span>
                                    <!-- 提示：目前系统尚不支持200条数据以上的文件导入，编辑文件时，请注意限制哦！ -->
                                    <p class="titleTip" >{{$t('mxpcweb.client.list.1556082716795')}}</p>
                                </div>
                                <br>
                                <!-- <img style="width: 882px;height: 88px;" src="./img/u10896.png"> -->
                            </div>
                            <div class="content">
                                <!-- 表头字段名称、排列顺序无需与系统完全一致，在下一步"字段映射"中可以根据设置自由调整。 -->
                                <div>3.{{$t('mxpcweb.client.1529048818238')}}</div>
                                <br>
                                <!-- <img style="width:453px;height:30;" src="./img/u10739.png"> -->
                            </div>
                            <div class="content">
                                <!-- 选择导入文件 -->
                                4.{{$t('mxpcweb.client.1529048862022')}}
                                <input type="file"  v-if="dialogAddPeople" value="导入excel" id="importScollBox_excel" @change="excel($event)" style="position: absolute;display: none;">
                                <!-- 选择文件 -->
                                <!-- 重选文件 -->
                                <label for="importScollBox_excel" class="filedInput text-hover required">{{filesData.length==0?$t('mxpcweb.client.1529048918632'):$t('mxpcweb.client.1529048963909')}}</label>
                                <!-- 文件上传中... -->
                                <loading v-if="excelLoading" class="excelLoading" :title="$t('mxpcweb.client.1529048996939')"></loading>
                                <span v-else style="color: #BCBCBC;font-size:12px">
                                    <span v-if="filesName.substr(filesName.indexOf('.') + 1,filesName.length)=='xlsx'||filesName.substr(filesName.indexOf('.') + 1,filesName.length)=='xls'" style="color:#46b980;margin-left:10px">
                                        <i class="iconfile file-xlsx"></i>
                                    </span>
                                    {{filesName}}
                                </span>
                                <span style="color: red;font-size:12px">{{errMsg}}</span>
                            </div>
                        </template>
                    </div>
                    <div class="listBox1  MXscroll" v-show="active==1||active==2||active==3">
                        <div class="listBox2" style="margin: 0px 21px 0px 10px;;padding: 10px 0;">
                            <div>
                                <el-row  class="heard">
                                    <el-col :span="10" style="padding-left:100px;">
                                        <!-- Fuma MX中的字段 -->
                                        {{$t('mxpcweb.client.1529049125801')}}
                                    </el-col>
                                    <el-col :span="14" style="padding-left:13px;">
                                        <!-- 文件中的字段 -->
                                        {{$t('mxpcweb.client.1529049139890')}}
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="listBox2 listBox2b MXscroll addPeopleMXscroll" v-loading="loading" style="border-top:0;">
                            <div v-for="(items,indexs) in editSet" :key="indexs" v-if="items.fieldList && items.fieldList.length > 0">
                                <el-row class="contentTitle">
                                    <el-col :span="10">
                                        <h3>{{items.strucName}}</h3>
                                    </el-col>
                                    <el-col :span="14">
                                        <!-- 选择要导入的字段 -->
                                        <el-select ref="select"  v-model="items.itemData" filterable clearable placeholder="选择要导入的区块" size="mini" @change="isSelect()">
                                            <!-- 无 -->
                                            <el-option :label="$t('mxpcweb.client.1529049194152')" :value="0">
                                            </el-option>
                                            <el-option  v-for="(element,indexs) in filesData" :key="indexs" :label="element.name" :value="element.name" :disabled="element.select">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content" v-for="(item,index) in items.fieldList" :key="index" v-if="item.controlTypeId!=0 && item.cnFieldCaption" :dataId="'import'+item.fieldName+index">
                                    <el-col :span="10">
                                        <span :class="item.isNotNull?'required':''">{{item.cnFieldCaption}}</span>
                                    </el-col>
                                    <el-col :span="14">
                                        <!-- 选择要导入的字段 -->
                                        <el-select ref="select"  v-model="item.itemData" filterable clearable :placeholder="$t('mxpcweb.client.1529049168857')" size="mini" @change="isFieldSelect(items.fieldList, items.filesData)">
                                            <!-- 无 -->
                                            <el-option :label="$t('mxpcweb.client.1529049194152')" :value="0">
                                            </el-option>
                                            <el-option  v-for="(items,indexs) in items.filesData" :key="indexs" :label="items.name" :value="items.name" :disabled="items.select">
                                            </el-option>
                                        </el-select>
                                        <!-- 此字段必须映射 -->
                                        <span v-if="item.isNotNull&&item.itemData==''" style="color:red;margin-left:15px;">{{$t('mxpcweb.client.1529049220575')}}</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="active==2" class="listBox4">
                    <div class="importFialog">
                        <div v-if="importLoading" class="importLoading">
                            <!-- 正在上传...请稍等 -->
                            <loading :title="$t('mxpcweb.client.1529049246657')"></loading>
                        </div>
                        <img src="./img/u2060.png">
                        <!-- 数据导入是一种批量操作系统数据行为，需谨慎对待，建议您仔细检查，确认无误后开始导入！ -->
                        <div class="content" :class="importLoading?'filter':''">{{$t('mxpcweb.client.1529049266942')}}</div>
                        <el-button class="makeSure" :class="importLoading?'filter':''"  @click="submit()">
                            <!-- 开始导入 -->
                            {{$t('mxpcweb.client.1529048714007')}}
                        </el-button>
                        <div class="lookAgain text-hover" :class="importLoading?'filter':''" @click="active = 1">
                            <!-- 我再检查一下 -->
                            {{$t('mxpcweb.client.1529049292971')}}
                        </div>
                        <div class="text-hover cancel" @click="active = 1">
                            <i class="el-dialog__close el-icon el-icon-close"></i>
                        </div>
                    </div>
                </div>
                <div v-show="active==3" class="listBox4">
                    <div class="importFialog">
                        <img src="./img/u2060.png">
                        <!-- 完成这个导入需要几分钟的时间。导入完成后，您会收到邮件通知。 -->
                        <div class="content">{{$t('mxpcweb.client.1529049310930')}}</div>
                        <el-button class="makeSure1" @click="dialogAddPeople=false">
                            <!-- 确定 -->
                            {{$t('mxpcweb.client.1529047741736')}}
                        </el-button>
                        <div class="text-hover cancel" @click="dialogAddPeople=false">
                            <i class="el-dialog__close el-icon el-icon-close"></i>
                        </div>
                    </div>
                </div>
                <div class="dialogFooter">
                    <el-button class="button" type="primary" v-if="active==0" @click="active = 1" :disabled="filesData.length==0">
                        <!-- 下一步 -->
                        {{$t('mxpcweb.client.1529049376193')}}
                    </el-button>
                    <el-button class="button" v-if="active==1" @click="active = 0">
                    <!-- 上一步 -->
                    {{$t('mxpcweb.client.1529049356505')}}
                    </el-button>
                    <el-button class="button" type="primary" v-if="active==1||active==2||active==3" @click="redyImport()">
                    <!-- 开始导入 -->
                    {{$t('mxpcweb.client.1529048714007')}}
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-新增客户
 * 作者：何俊峰
 * 时间：2017/11/21
 */
import Loading from '@/basecomponents/Loading/index'
import { mapGetters } from 'vuex'
export default {
    name: 'importBox',
    props: {
        classTypeInUseList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            goodsType: '',
            loading: true,
            dialogAddPeople: false,
            boxHeight: 0,
            title: '导入商品',
            active: 0,
            editSet: [],
            // 未选择文件
            filesName: this.$t('mxpcweb.client.1529049407272'),
            filesData: [],
            files: [],
            fieldMapList: {},
            errMsg: '',
            backMsg: [], // 错误信息
            excelLoading: false,
            importLoading: false,
            moduleCode: 'PP001'
        }
    },
    created() {
    },
    mounted() {
        this.setHeight()
    },
    methods: {
        goodsTypeChange(val) {
            if (val == '') {
                this.filesData = []
                this.files = []
                this.obj = {}
                this.editSet = []
                this.filesName = this.$t('mxpcweb.client.1529049407272')
            } else {
                this.getEditSet(this.moduleCode)
            }
        },
        isSelect() { // 选过的不可再选
            let time = setTimeout(() => {
                window.clearTimeout(time)
                this.editSet.forEach((item) => {
                    item.filesData = []
                })
                this.filesData.forEach((items) => {
                    let select = false
                    this.editSet.forEach((item) => {
                        if (items.name && items.name.replace('*', '') == item.itemData) {
                            select = true
                            let filesData2 = []
                            items.data.forEach(elements => {
                                let obj2 = {
                                    select: false,
                                    name: elements
                                }
                                item.fieldList.forEach(element => {
                                    if (elements && elements.replace('*', '') == element.cnFieldCaption) {
                                        element.itemData = elements
                                        obj2.select = true
                                    }
                                })
                                filesData2.push(obj2)
                            })
                            item.filesData = filesData2 || []
                        }
                    })
                    if (items.select != select) {
                        items.select = select
                    }
                })
            }, 20)
        },
        isFieldSelect(fieldList, filesData) { // 选过的不可再选
            filesData.forEach((items) => {
                let select = false
                fieldList.forEach((item) => {
                    if (items.name && items.name == item.itemData) {
                        select = true
                    }
                })
                items.select = select
            })
        },
        downloadModel() { // 下载处理
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_product_importExport, { params: {
                moduleCode: _this.moduleCode,
                catgId: _this.goodsType,
                type: 'template'
            }}).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    window.location.href = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            })
        },
        redyImport() { // 准备导入
            this.fieldMapList = []
            this.sheetMap = {}
            let fieldMapList = []
            let sheetMap = {}
            let isProp = false
            this.editSet.forEach((element, index) => {
                sheetMap[element.strucName] = element.itemData || ''
                let obj = {}
                element.fieldList.forEach(item => {
                    if (item.controlTypeId != 0) {
                        if (item.isNotNull == 1 && item.itemData == '') {
                            $('.addPeopleMXscroll').scrollTop($('[dataId=import' + item.fieldName + index + ']')[0].offsetTop)
                            item.isProp = true
                            isProp = true
                        } else {
                            item.isProp = false
                            obj[item.cnFieldCaption] = item.itemData
                        }
                    }
                    if (isProp) {
                        return false
                    }
                })
                fieldMapList.push({
                    strucId: element.strucId,
                    fieldMap: obj
                })
            })
            if (isProp) {
                return false
            }
            this.active = 2
            this.sheetMap = sheetMap
            this.fieldMapList = fieldMapList
        },
        submit() { // 开始导入
            let _this = this
            this.importLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.document_product_importExport
            let fd = new FormData()
            let accessToken = this.getToken()[this.Global.accessToken]
            fd.append('accessToken', accessToken)
            fd.append('sheetMap', encodeURI(JSON.stringify(_this.sheetMap)))
            fd.append('fieldMapList', encodeURI(JSON.stringify(_this.fieldMapList)))
            fd.append('moduleCode', _this.moduleCode)
            fd.append('catgId', _this.goodsType)
            fd.append('file', _this.files[0], _this.files[0].name)
            _this.$http.post(url, fd).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    _this.active = 3
                    _this.$emit('getListData')
                    _this.$message.success(_this.msg(res.body))
                    _this.importLoading = false
                } else {
                    _this.active = 3
                    _this.$message.error(_this.msg(res.body))
                    _this.importLoading = false
                }
            })
        },
        async excel(e) { // 导入excel解析
            this.errMsg = ''
            this.excelLoading = true
            let files = e.target.files
            this.files = files
            this.filesName = files[0].name
            this.editSet.forEach(function(item) {
                item.itemData = ''
                item.filesData = []
                item.fieldList.forEach(element => {
                    element.itemData = ''
                })
            })
            let fd = new FormData()
            for (let i = 0; i < files.length; i++) {
                fd.append(files[i].name, files[i], files[i].name)
            }
            let _this = this
            let res = await _this.$http.post(_this.Global.baseURL + _this.Global.api.UniversalInterface.excel, fd)
            if (res.body.code.toString() == _this.Global.RES_OK) {
                if (res.body.data[files[0].name][0].data.length > 501) {
                    this.excelLoading = false
                    // '文件条数超出系统导入限制条数，请重新编辑后再来导入吧！'
                    this.errMsg = this.$t('mxpcweb.client.list.1547183706857')
                    return false
                }
                let filesData = res.body.data[files[0].name].filter(data => data.name.indexOf('字典数据') == -1)
                let filesData1 = []
                if (filesData.length == 0) {
                    _this.excelLoading = false
                    // 格式错误，请选择与模板格式类似的excel文件
                    _this.errMsg = _this.$t('mxpcweb.client.1529049436289')
                    return false
                }
                _this.errMsg = ''
                filesData.forEach(function(items) {
                    let obj1 = {
                        select: false,
                        name: items.name,
                        data: items.data[0] || []
                    }
                    _this.editSet.forEach(function(item) {
                        if (items.name && items.name.replace('*', '') == item.strucName) {
                            item.itemData = items.name
                            obj1.select = true
                            let filesData2 = []
                            if (items.data && items.data[0]) {
                                items.data[0].forEach(elements => {
                                    let obj2 = {
                                        select: false,
                                        name: elements
                                    }
                                    item.fieldList.forEach(element => {
                                        if (elements && elements.replace('*', '') == element.cnFieldCaption) {
                                            element.itemData = elements
                                            obj2.select = true
                                        }
                                    })
                                    filesData2.push(obj2)
                                })
                            }
                            item.filesData = filesData2 || []
                        }
                    })
                    filesData1.push(obj1)
                })
                _this.filesData = filesData1
                _this.excelLoading = false
            } else {
                _this.$message.error(_this.msg(res.body))
                _this.excelLoading = false
            }
        },
        getEditSet(moduleCode) { // 获取数据
            if (this.goodsType == '') {
                this.editSet = []
            } else {
                let _this = this
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_importExport, { params: {
                    moduleCode: moduleCode,
                    type: 'fieldList',
                    catgId: _this.goodsType
                }}).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        let editSet = res.body.data
                        editSet.forEach(function(item) {
                            item.itemData = ''
                            item.filesData = []
                            item.fieldList.forEach(element => {
                                element.isProp = false
                                element.itemData = ''
                            })
                        })
                        _this.editSet = editSet
                        _this.loading = false
                    } else {
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, (res) => {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }
        },
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },
        openWindow() {
            this.errMsg = ''
            this.active = 0
            this.goodsType = ''
            // 未选择文件
            this.filesName = this.$t('mxpcweb.client.1529049407272')
            this.filesData = []
            this.files = []
            this.obj = {}
            this.editSet = []
            this.dialogAddPeople = true
        }
    },
    watch: {
        screenHeight (val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    components: {
        'loading': Loading
    },
     computed: {
        ...mapGetters([
            'domain',
            'screenHeight'
        ])
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.required:after {
    content: '*';
    color: #ff4949;
    margin-left: 3px;
    position: relative;
    top: 2px;
}
.titleTip{
    height: 30px;
    line-height: 30px;
    color:red;
    font-size:12px;
}
.importScoll{
    background:white;
    height:100%;
    min-height: 300px;
    .inportTitle{
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        border-bottom: 1px solid rgba(228, 228, 228, 1);
        padding-left: 28px;
        margin-bottom: 20px;
        position: relative;
        .cancel{
            position: absolute;
            top: -4px;
            right: 26px;
            font-size: 14px;
            color: #AEAEAE;
            i{
                font-weight: 100;
            }
        }
    }
    .importBox{
        padding:0 0 80px;
        min-height: 400px;
        .listBox{
            width: 100%;
            margin-top:20px;
            .listBox1{
                >.content{
                    font-size:14px;
                    color: #6B6B6B;
                    padding: 0 0 19px;
                    position: relative;
                    div{
                        line-height: 16px;
                    }
                    .excelLoading{
                        display:inline-block;
                        position: absolute;
                        top: -11px;
                    }
                }
                >.contentTitle{
                    line-height: 40px;
                    font-size: 16px;
                    font-weight: 500;
                    padding-left: 66px;
                    color: #666;
                    background: #eef1f6;
                }
                .filedInput{
                    width: 100px;
                    height: 28px;
                    line-height: 28px;
                    font-weight: 400;
                    font-size: 11px;
                    text-decoration: none;
                    color: #999;
                    text-align: center;
                    margin: 0 7px 0 14px;
                    border: 1px solid #999;
                    display: inline-block;
                    &:hover{
                        border-color:#E6001F;
                    }
                }
            }
            .listBox2{
                border:1px solid rgba(242, 242, 242, 1);
                font-size: 14px;
                .heard{
                    color: #6B6B6B;
                }
                .content{
                    padding:0 100px;
                    height: 53px;
                    line-height: 56px;
                    overflow: hidden;
                    border-bottom:1px solid #f9f9f9;
                }
                .contentTitle{
                    height: 53px;
                    line-height: 56px;
                    font-size: 16px;
                    font-weight: 500;
                    padding:0 100px;
                    background-color: #EFF2F4;
                }
                .content:nth-child(even){
                    background: #fcfcfc;
                }
                select{
                    border: 0;
                    border-bottom: 1px solid #d7d7d7;
                    background: rgba(255, 255, 255, 0)
                }
            }
            .listBox2b{
                overflow-y: auto;
                position: absolute;
                top: 183px;
                bottom: 66px;
                left: 30px;
                right: 40px;
            }
            .listBox3{
                overflow-y: auto;
                position: absolute;
                top: 153px;
                bottom: 66px;
                left: 30px;
                right: 40px;
            }
        }
        .listBox4{
            width:100%;
            height:100%;
            position:absolute;
            top:0;
            left:0;
            .importFialog{
                position: absolute;
                left: 50%;
                top: 40%;
                width: 616px;
                height: 234px;
                margin:-117px 0 0 -308px;
                background: inherit;
                background-color: rgba(255, 255, 255, 1);
                box-sizing: border-box;
                border: 1px solid rgba(215, 215, 215, 1);
                border-radius: 5px;
                z-index: 9;
                .importLoading{
                    position: absolute;
                    top: 52px;
                    left: 100px;
                    background: rgba(255, 255, 255, .8);
                    width: 440px;
                    height: 167px;
                    z-index: 9;
                }
                .filter{
                    -webkit-filter: blur(2px);
                    filter: blur(2px);
                }
                img{
                    position: absolute;
                    left: 107px;
                    top: 65px;
                    width: 39px;
                    height: 39px;
                }
                .content {
                    position: absolute;
                    left: 165px;
                    top: 67px;
                    width: 361px;
                    height: 100px;
                    font-size: 14px;
                    color: #1B1B1B;
                    overflow: auto;
                }
                .makeSure{
                    position: absolute;
                    left: 263px;
                    top: 172px;
                }
                .makeSure1{
                    position: absolute;
                    left: 278px;
                    top: 172px;
                }
                .lookAgain{
                    position: absolute;
                    left: 378px;
                    top: 172px;
                    width: 185px;
                    height: 37px;
                    line-height:37px;
                    color:#6CA2FF;
                    font-size:12px;
                }
                .cancel{
                    position:absolute;
                    top:20px;
                    right:20px;
                }
            }
        }
        .dialogFooter{
            height: 54px;
            padding-right: 40px;
            text-align: right;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            background: white;
            border-left: 1px solid #e4e4e4;
        }
        .el-step__title.is-process{
                font-weight: 100;
        }
    }
}
</style>
