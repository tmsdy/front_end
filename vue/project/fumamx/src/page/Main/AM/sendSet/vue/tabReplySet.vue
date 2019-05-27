
<template>
    <div class="tabSendset" v-loading="loading">
        <div class="add">
            <!-- 添加回复人 -->
            <el-button type="primary" @click="$emit('openAddSendPeople','1')">{{$t('mxpcweb.am.1531903052274')}}</el-button>
        </div>
        <div class="tableBox">
            <el-row class="title">
                <el-col :span="8">
                    <!-- 回复人地址 -->
                    {{$t('mxpcweb.am.1531904277108')}}
                </el-col>
                <el-col :span="7">
                    <!-- 回复人名称 -->
                    {{$t('mxpcweb.am.1531904282297')}}
                </el-col>
                <el-col :span="7">
                    <!-- 使用人员 -->
                    {{$t('mxpcweb.am.1531904286368')}}
                </el-col>
                <el-col :span="2">
                    <!-- 操作 -->
                    {{$t('mxpcweb.am.1531902668646')}}
                </el-col>
            </el-row>
            <no-data v-if="!loading&&sendList.length==0" style="background:rgba(255,255,255,0)"></no-data>
            <el-row v-else class="list" v-for="(item,index) in sendList" :key="index">
                <el-col :span="8" class="ellipsis">
                    {{item.address}}
                </el-col>
                <el-col :span="7" class="ellipsis">
                    {{item.name}}
                </el-col>
                <el-col :span="7" class="ellipsis">
                    <people-show :ctid="item.ctId" :owners="owners"></people-show>
                </el-col>
                <el-col :span="2">
                    <!-- 删除 -->
                    <span class="text-hover" @click="deleteItem(item)">{{$t('mxpcweb.am.1531893085173')}}</span>
                </el-col>
            </el-row>
        </div>
        <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
    </div>
</template>

<script>

import NoData from '@/basecomponents/NoData/index'
import listPage from '@/components/listPageTwo/index'
import peopleShow from './peopleShow'
import { isArray } from '@/libs/utils.js'
export default {
    name: 'tabSendset',
    props: {
        owners: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            sendList: [],
            loading: true,
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            }
        }
    },
    created() {
        this.getListData()
    },
    methods: {
        getListData() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.sendAndReply_Delete, {
                params: {
                    pageN: parseInt(this.blockData.fromNum / this.blockData.pageSize) + 1,
                    pageSize: this.blockData.pageSize,
                    type: 'replyTo'
                }
            }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    if (isArray(res.body.data.addressList)) {
                        this.sendList = res.body.data.addressList
                        this.blockData.total = res.body.data.rowTotal
                    } else {
                        this.sendList = []
                        this.blockData.total = 0
                    }
                    this.loading = false
                } else if (res.body.code.toString() != '-3') {
                    this.$message.error(this.msg(res.body))
                    this.loading = false
                } else {
                    this.loading = false
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
                this.loading = false
            })
        },
        deleteItem(item) {
            // 即将删除回复人地址
            // 是否继续?
            // 提示
            // 确定
            // 取消
            this.$confirm(this.$t('mxpcweb.am.1531904295969') + '（' + item.name + '）,' + this.$t('mxpcweb.am.1531904306656'), this.$t('mxpcweb.am.1531893166645'), {
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                cancelButtonText: this.$t('mxpcweb.am.1531893140621'),
                type: 'warning'
            }).then(() => {
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.sendAndReply_Delete, { params: { addressId: item.addressId
                    } }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getListData()
                    } else if (res.body.code.toString() != '-3') {
                        this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        }
    },
    components: {
        'no-data': NoData,
        'list-page': listPage,
        'people-show': peopleShow
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tabSendset {
  min-height: 100%;
  padding-bottom: 67px;
  .add {
    height: 47px;
    line-height: 47px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding: 0 10px;
    text-align: right;
  }
  .tableBox {
    min-height: 200px;
    width: 100%;
    font-size: 12px;
    margin-top: 20px;
    color: #333333;
    .title {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      background: rgba(239, 242, 244, 1);
      color: RGBA(144, 147, 153, 1);
    }
    .list {
      height: 54px;
      line-height: 54px;
      padding-left: 20px;
      color: RGBA(34, 34, 34, 1);
      border-bottom: 1px solid rgba(234, 237, 239, 1);
      background: white;
      &:hover {
        background: #fcf2f3;
      }
    }
  }
}
</style>
