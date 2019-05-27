<template>
    <div class="AddDocumentary">
        <!-- 选择跟单模板 -->
        <el-dialog :title="$t('mxpcweb.sale.components.1557564556023')" v-dialogDrag :visible.sync="dialogVisible" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
            <div class="formBox">
                <div class="documentModule">
                    <!-- 选择模板 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564595047')}}</span>
                    <el-select class="AddDocumentarySelect" size="mini" clearable :loading="loading" style="width:325px;" filterable remote :remote-method="getDataSeach" v-model="documentModule" @change="change">
                        <el-option v-for="(item, index) in list1" :label="item.templateName" :value="item.templateId + ''" :key="index"></el-option>
                    </el-select>
                </div>
                <!-- 流程环节 -->
                <div class="documentModule">{{$t('mxpcweb.sale.components.1557564596388')}}</div>
                <div class="listBox" v-show="documentModule != ''">
                    <no-data v-if="!checkData.templateInfo || checkData.templateInfo.length == 0"></no-data>
                    <template v-else>
                        <div class="listTit">
                            <el-row>
                                <!-- 序号 -->
                                <el-col :span="2"><div>{{$t('mxpcweb.sale.components.1557564596833')}}</div></el-col>
                                <!-- 跟单环节 -->
                                <el-col :span="4"><div>{{$t('mxpcweb.sale.components.1557564597088')}}</div></el-col>
                                <!-- 任务类型 -->
                                <el-col :span="5"><div>{{$t('mxpcweb.sale.components.1557564597306')}}</div></el-col>
                                <!-- 负责人 -->
                                <el-col :span="6"><div>{{$t('mxpcweb.sale.components.1557564615823')}}</div></el-col>
                                <!-- 指定时间 -->
                                <el-col :span="7"><div>{{$t('mxpcweb.sale.components.1557564616039')}}</div></el-col>
                            </el-row>
                        </div>
                        <div class="listItem" v-for="(item, index) in checkData.templateInfo" :key="index">
                            <el-row>
                                <el-col :span="2"><div>{{index + 1}}</div></el-col>
                                <el-col :span="4"><div>{{item.nodeName || '&nbsp;'}}</div></el-col>
                                <el-col :span="5"><div>{{returnState(item.nodeStatus) || '&nbsp;'}}</div></el-col>
                                <el-col :span="6"><div>
                                    <el-select size="mini" style="width:100px;" filterable v-model="item.chargeCtId">
                                        <!-- 未指定 -->
                                        <el-option :label="$t('mxpcweb.sale.components.1557564616258')" value=""></el-option>
                                        <!-- 拥有人 -->
                                        <el-option :label="$t('mxpcweb.sale.components.1557564616443')" value="${ownerCtId}"></el-option>
                                        <!-- 指定人员 -->
                                        <el-option-group key="1" :label="$t('mxpcweb.sale.components.1557564616635')">
                                            <el-option v-for="(item, index) in contactValue" v-show="item.inUse == '1'" :label="item.realName" :value="item.ctId + ''" :key="index"></el-option>
                                        </el-option-group>
                                    </el-select>
                                </div>
                                </el-col>
                                <el-col :span="7">
                                    <div>
                                        <el-date-picker v-model="item.deadline" type="date" style="width:120px;" format="yyyy-MM-dd" size="mini"></el-date-picker>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </div>
            </div>
            <div class="text-center">
                <el-button type="primary" @click="submitForm()" :loading="subLoading">
                    <!-- 保 存 -->
                    {{$t('mxpcweb.sale.components.1557564616847')}}
                </el-button>
                <el-button @click="dialogVisible = false">
                    <!-- 取 消 -->
                    {{$t('mxpcweb.sale.components.1557564617043')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import { mapGetters } from 'vuex'
export default {
    name: 'AddDocumentary',
    props: {

    },
    data() {
        return {
            list1: [],
            checkData: {},
            itemData: {},
            blockData: { // 分页
                pageN: 1,
                pageSize: 50
            },
            dialogVisible: false,
            documentModule: '',
            subLoading: false,
            loading: true
        }
    },
    created() {
    },
    mounted() {
        $(this.$el).find('.AddDocumentary .AddDocumentarySelect').scroll(() => {
            var h = $(this).height() // div可视区域的高度
            var sh = $(this)[0].scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $(this)[0].scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
            if (h + st >= sh - 4) {
                this.more()
            }
        })
    },
    computed: {
        ...mapGetters([
            'contactValue'
        ])
    },
    methods: {
        more() {
            this.pageN++
            this.getData()
        },
        getDataSeach() {
            this.pageN = 1
            this.getData()
        },
        showDialog(itemData) {
            this.documentModule = ''
            this.checkData = {}
            this.blockData = {
                pageN: 1,
                pageSize: 50
            }
            this.itemData = {}
            if (itemData) {
                this.itemData = itemData
            }
            this.getData()
            this.dialogVisible = true
        },
        // 提交表单
        submitForm() {
            let newdata = JSON.parse(JSON.stringify(this.checkData))
            let list = newdata.templateInfo
            delete newdata.templateInfo
            let newList = []
            list.forEach(item => {
                item.deadline = this.$m_unifiedTime(item.deadline, {format: 'YYYY-MM-DD HH:mm:ss'})
                newList.push(Object.assign({}, item, newdata))
            })
            newdata.strucId_3 = newList
            if (JSON.stringify(this.itemData) != '{}' && this.itemData.orderId) {
                this.subLoading = true
                this.getFormKey((formKey, msg) => {
                    if (formKey && formKey != '') {
                        this.$http.put(this.Global.baseURL + this.Global.api.v2.document_quotation_put, Object.assign({
                            moduleCode: 'SC002',
                            strucId: '1',
                            orderId: this.itemData.orderId,
                            SC003: newdata
                        }, {
                            'formKey': formKey
                        })).then((res) => {
                            this.subLoading = false
                            this.dialogVisible = false
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                this.$message.success(this.msg(res.body))
                                this.$emit('getData')
                            } else {
                                this.$message.error(this.msg(res.body))
                            }
                            this.updateFormKey()
                        }, (res) => {
                            this.subLoading = false
                            this.$message.error(this.$t(this.Global.errorTitle))
                        })
                    } else {
                        this.subLoading = false
                        this.$message.error(msg)
                    }
                })
            } else {
                this.$emit('submit', newdata)
                this.dialogVisible = false
            }
        },
        returnState(val) {
            if (val && val != '') {
                if (val == '1') {
                    // 金额状态任务
                    return this.$t('mxpcweb.sale.components.1557564617265')
                } else if (val == '2') {
                    // 核销状态任务
                    return this.$t('mxpcweb.sale.components.1557564649576')
                } else if (val == '10') {
                    // 未指定
                    return this.$t('mxpcweb.sale.components.1557564616258')
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        change(val) {
            this.checkData = {}
            this.list1.forEach(item => {
                if (item.templateId == val) {
                    this.checkData = JSON.parse(JSON.stringify(item))
                }
            })
            console.log(this.checkData)
        },
        getData() {
            if (this.list1.length == 0) {
                this.loading = true
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.orderTemplate, {
                params: {
                    type: 'list',
                    pageN: this.blockData.pageN,
                    pageSize: this.blockData.pageSize
                }
            }).then((res) => {
                this.loading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let list = res.body.data.list || []
                    list.forEach(item => {
                        if (item.templateInfo) {
                            item.templateInfo.forEach(items => {
                                items.deadline = items.deadline == '1970-01-01 00:00:00' ? '' : items.deadline
                            })
                        }
                    })
                    this.list1 = list
                } else {
                    this.list1 = []
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.list1 = []
                this.loading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 重置表单
        resetForm() {
        }
    },
    components: {
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.more {
  text-align: center;
  color: grey;
  margin-bottom: 10px;
}
</style>
