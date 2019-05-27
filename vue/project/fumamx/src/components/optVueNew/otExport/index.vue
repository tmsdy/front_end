<template>
<!-- 导出 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529051609617')" :visible.sync="dialogAddPeople" :closeOnClickModal="false"  custom-class="width1020" :modal-append-to-body="false">
        <div class="importScoll"  :style="'height:'+boxHeight" @click="stopPropagation">
            <div class="importBox">
                <div class="listBox">
                    <div class="listBox1 listBox3 MXscroll">
                        <div class="content">
                            <!-- 选择导出数据 -->
                            <div class="sortNum">1.{{$t('mxpcweb.client.1529051624531')}}
                            </div>
                            <br>
                            <el-radio-group v-model="dataSource" size="large" style="">
                                <!-- 导出选中记录 -->
                                <el-radio label="1" style="color: #6B6B6B;">{{$t('mxpcweb.client.1529051639045')}}</el-radio>
                                <!-- 导出查询出记录 -->
                                <el-radio label="2" class="radioEle">{{$t('mxpcweb.client.1529051654696')}}</el-radio>
                                <!-- 导出全部 -->
                                <el-radio label="3" class="radioEle">{{$t('mxpcweb.client.1529051669127')}}</el-radio>
                            </el-radio-group>
                        </div>
                        <br>
                        <!-- <div class="content" v-if="moduleCode=='BF001'">
                            <div class="sortNum">2.选择关联数据表和字段</div><br>
                            <el-checkbox v-model="allowContacts" style="color:#6B6B6B;">允许关联客户对应的联系人</el-checkbox>
                            <el-radio-group v-show="allowContacts" v-model="radio1" size="small">
                                <el-radio label="1" class="radioEle1">1个(最新联系人优先)</el-radio>
                                <el-radio label="2" class="radioEle1">全部联系人</el-radio>
                            </el-radio-group>
                            <div v-show="allowContacts" style="margin: 15px 0;"></div>
                            <div class="checkBox" v-show="allowContacts">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="position: absolute;">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedFields" @change="handleCheckedCitiesChange" style="margin-left: 54px;">
                                    <el-checkbox class="fieldSelect" v-for="(item,index) in fields" :label="item.cnFieldCaption" :key="index">{{item.cnFieldCaption}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div class="content">
                            <div class="sortNum">{{ moduleCode=='BF001'?3:2 }}.下载导出的数据文件</div><br>
                            <el-button class="button" type="primary" @click="submit()" style="width:120px;height: 37px;" :loading="loading">
                            导出Excel
                            </el-button>
                        </div> -->
                        <div class="content">
                            <!-- 下载导出的数据文件 -->
                            <div class="sortNum">2.{{$t('mxpcweb.client.1529051685669')}}</div><br>
                            <el-button class="button" type="primary" @click="submit()" :loading="loading">
                            <!-- 导出中... -->
                            <!-- 导出Excel -->
                            {{loading?$t('mxpcweb.client.1529051702911')+exportTime+'s':$t('mxpcweb.client.1529051727164')}}
                            </el-button>
                        </div>
                    </div>
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
import { mapGetters } from 'vuex'
export default {
    name: 'importBox',
    props: {
    },
    data() {
        return {
            loading: false,
            dialogAddPeople: false,
            boxHeight: 0,
            title: '',
            dataSource: '1',
            radio1: '',
            allowContacts: '', // 是否允许导出联系人
            checkAll: true,
            checkedFields: [],
            fields: [],
            baseFields: [],
            isIndeterminate: true,
            exportTime: 0,
            naxtArgument: {},
            billId: [],
            moduleCode: ''
        }
    },
    created() {
        if (this.moduleCode == 'BF001') {
            this.getEditSet()
        }
    },
    mounted() {
        this.setHeight()
    },
    methods: {
        submit() { // 开始导出
            let _this = this
            this.loading = true
            let time = setInterval(function() {
                if (!_this.loading) {
                    clearInterval(time)
                    _this.exportTime = 0
                } else {
                    _this.exportTime++
                }
            }, 1000)
            let {dataSource, moduleCode, billId, naxtArgument} = this
            let obj = {
                dataSource: dataSource,
                moduleCode: moduleCode
            }
            if (dataSource == '1') {
                obj.targets = billId.toString()
            } else if (dataSource == '2') {
                obj.queryCondition = naxtArgument
            };
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.document_importExport_do, obj).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    window.location.href = res.body.data
                    _this.loading = false
                } else {
                    _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        stopPropagation(e) { // 阻止冒泡事件
            if (e && e.stopPropagation) {
                // W3C取消冒泡事件
                e.stopPropagation()
            } else {
                // IE取消冒泡事件
                window.event.cancelBubble = true
            }
        },
        setHeight() {
            this.boxHeight = 0.6 * parseInt($(window).height()) + 'px'
        },
        openWindow(obj) {
            let { billId, naxtArgument } = obj
            this.moduleCode = obj.optData.optModuleCode
            this.billId = billId
            this.naxtArgument = naxtArgument
            // 未选择文件
            this.filesName = this.$t('mxpcweb.client.1529049407272')
            this.filesData = []
            // 客户
            // 联系人
            // this.title = moduleCode == 'BF001' ? this.$t('mxpcweb.client.1529049476377') : this.$t('mxpcweb.client.1529027235743')
            this.dataSource = '1'
            this.dialogAddPeople = true
        },
         handleCheckAllChange(event) { // 联系人字段全选反选
            this.checkedFields = event.target.checked ? this.returnLists() : []
            this.isIndeterminate = false
        },
        // 返回全选列表
        returnLists() {
            let num = []
            this.baseFields.forEach(function(item, indexs) {
                num.push(item.cnFieldCaption)
            })
            return num
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.fields.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.fields.length
        },
        getEditSet() { // 获取数据
            let _this = this
             _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_importExport_do, { params: {
                moduleCode: 'BF003',
                type: 'fieldList'
            }}).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let fields = res.body.data
                    fields.forEach(function(item) {
                        item.isSelect = false
                    })
                    this.fields = fields
                    this.baseFields = fields
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    computed: {
        ...mapGetters([
            'screenHeight'
        ])
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.setHeight()
        }
    },
    components: {
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
.importScoll{
    height:100%;
    min-height: 400px;
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
        .listBox{
            width: 100%;
            margin-top:20px;
            .listBox1{
                >.content{
                    font-size:14px;
                    color: #6B6B6B;
                    padding: 0 0 19px;
                    .checkBox{
                        width: 900px;
                        min-height: 50px;
                        .fieldSelect{
                            margin-left: 21px;
                            margin-bottom: 9px;
                            color: #6B6B6B;
                        }
                    }
                    .sortNum{
                        line-height: 16px;
                        margin-bottom: 5px;
                    }
                }
            }
            .listBox3{
                overflow-y: auto;
                position: absolute;
                top: 60px;
                bottom: 0;
                left: 36px;
                right: 40px;
                padding-top: 37px;
                .radioEle{
                    margin-left:66px;color: #6B6B6B;
                }
                .radioEle1{
                    margin-left:36px;color: #6B6B6B;
                }
            }
        }

    }
}
</style>
