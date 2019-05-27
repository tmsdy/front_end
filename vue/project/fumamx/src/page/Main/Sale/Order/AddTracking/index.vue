<template>
    <!-- 跟单流程 -->
    <el-dialog v-dialogDrag title="显示设置" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addLowerCust">
            <div class="formBox">
                <div class="listBox">
                    <div class="listTit">
                        <el-row>
                            <el-col :span="3">
                                <div>序号</div>
                            </el-col>
                            <el-col :span="7">
                                <div>跟单环节</div>
                            </el-col>
                            <el-col :span="6">
                                <div>显示状态</div>
                            </el-col>

                            <el-col :span="8">
                                <div>操作</div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="listItem" v-for="(item, index) in processList" :key="index">
                        <el-row style="overflow: hidden;">
                            <el-col :span="3">
                                <div>{{index}}</div>
                            </el-col>
                            <el-col :span="7">
                                <div>{{item.nodeName}}</div>
                            </el-col>
                            <el-col :span="6">
                                <!-- <el-select v-model="item.taskType" placeholder="请选择" style="width:120px;">
                                        <el-option v-for="item in taskOption" :key="item.type" :label="item.name" :value="item.type">
                                        </el-option>
                                    </el-select> -->
                                <el-switch :value="item.showFlag==1?true:false" @change="changeshow(index)" on-text="开" off-text="关">
                                </el-switch>
                            </el-col>
                            <el-col :span="8">
                                <div>
                                    <span style="cursor: pointer;" @click="moveUp(index)"><i class="iconfont icon-move-up"></i></span>
                                    <span style="cursor: pointer;" @click="moveDown(index)"><i class="iconfont icon-move-down"></i></span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>

        <div slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 保存 -->
            <el-button type="primary" @click="submit('ruleForm')" :disabled="(processList.length == 0?btnDisable:!btnDisable)">保存</el-button>
        </div>

    </el-dialog>
</template>
<script>
// import AddLinklist from '../AddLinklist/index'
export default {
    name: 'sendEmail',
    props: {
        filterTable: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            dialog: false,
            dialogVisible: false,
            documentModule: '',
            btnDisable: true,
            processList: [],
            checkList: [], // 添加的环节
            personOption: [],
            nodeList: []

        }
    },
    created() {
        // this.getpersonOption()
    },
    mounted() {
    },
    computed: {
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
            // this.$emit('changeOpenDialog')
        },
        showDialog() {
            this.dialog = true
            this.processList = []
            this.filterTable.forEach(element => {
                this.processList.push(Object.assign({}, element))
            })

            // this.processList = Object.assign([], this.filterTable)
        },
        submit(formName) {
            let data = {
                nodeInfo: this.processList
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.orderNode, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.dialog = false
                    this.$emit('filterTableRefresh', this.processList)
                } else {
                    this.$message.error(res.body.msg)
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        changeshow(index) {
            this.processList[index].showFlag = this.processList[index].showFlag == 1 ? 0 : 1
        }
    },
    watch: {
    },
    components: {
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
