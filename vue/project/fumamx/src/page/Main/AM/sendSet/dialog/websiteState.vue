<template>
    <div class="setWebsite">
        <!-- 域名状态 -->
        <el-dialog :close-on-click-modal="false" :title="$t('mxpcweb.am.1532501290838')" v-dialogDrag :visible.sync="dialogVisible1" custom-class="width620" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false" @close="cancleChange">
            <div class="contentBox" v-if="Object.keys(domainData).length==0">
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>SPF
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="verify>=2" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>DKIM
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="verify>=1" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>DMARC
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="verify>=32" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>MX
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="verify>=4" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <div class="text-center foot">
                    <!-- 取消 -->
                    <el-button @click="cancleChange">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 刷新 -->
                    <el-button type="primary" @click="getListData(true)" :loading="submitLoading">{{$t('mxpcweb.am.1532501319273')}}</el-button>
                </div>
            </div>
            <div class="contentBox" v-else>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>SPF
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="domainData.SPF" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>DKIM
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="domainData.DKIM" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>DMARC
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="domainData.DMARC" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col class="listItem" :span="20">
                        <span class="text-red">
                            <i class="iconfont icon-star" style="font-size:12px;"></i>
                        </span>MX
                    </el-col>
                    <el-col class="listItem" :span="4">
                        <i v-if="domainData.MX" class="el-icon-circle-check text-green"></i>
                        <i v-else class="el-icon-circle-close text-red"></i>
                    </el-col>
                </el-row>
                <div class="text-center foot">
                    <!-- 取消 -->
                    <el-button @click="cancleChange">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 刷新 -->
                    <el-button type="primary" @click="getListData(true)" :loading="submitLoading">{{$t('mxpcweb.am.1532501319273')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
export default {
    name: 'setWebsite',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {
                    domain_name: ''
                }
            }
        }
    },
    data() {
        return {
            website: '',
            dialogVisible1: false,
            domainData: {},
            submitLoading: false,
            verify: 0
        }
    },
    methods: {
        cancleChange() {
            this.dialogVisible1 = false
            this.$emit('getListData')
        },
        showDialog(verify) {
            this.domainData = {}
            this.verify = verify
            this.getListData(true)
            this.dialogVisible1 = true
        },
        getListData(update) {
            let _this = this
            if (update) {
                this.submitLoading = true
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.domainVerify_Put, {
                domainIds: [_this.itemData.domainid]
            }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // if (isArray(res.body.data.dataList)) {
                    //     _this.domainData = res.body.data.dataList[0]
                    // } else {
                    //     if (update) {
                    //         // 未查到数据
                    //         _this.$message(this.$t('mxpcweb.am.1531904017226'))
                    //     }
                    // }
                    if (isArray(res.body.data)) {
                        _this.domainData = res.body.data[0].configInfo
                    }
                    this.submitLoading = false
                } else {
                    this.submitLoading = false
                }
            }, function (res) {
                this.loading = false
                this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
    }
    // ,    watch: {
    // 'dialogVisible1': {
    //     handler(newValue, oldValue) {
    //         console.log(newValue)
    //         if (!newValue) {
    //             this.$emit('getListData')
    //         }
    //     }

    // }
    // }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.setWebsite {
    .contentBox {
        color: #3d425e;
        padding: 20px;
        > .list {
            font-size: 12px;
            height: 55px;
            background: rgba(255, 255, 255, 1);
            line-height: 55px;
            padding: 0 42px;
            border-bottom: 1px solid #f7f8f9;
            overflow: hidden;
        }
        .foot {
            margin-top: 50px;
        }
    }
}
</style>
