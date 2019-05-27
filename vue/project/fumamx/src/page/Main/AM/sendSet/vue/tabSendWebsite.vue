<template>
    <div class="tabSendWebsite" v-loading="loading">
        <template v-if="!loading">
            <div class="add">
                <span style="color:#bcbcbc;font-size:12px;">
                    <!-- 注：最多可以创建2个发信域名 -->
                    <i class="el-icon-warning"></i>&nbsp;&nbsp;{{$t('mxpcweb.am.1531904781760')}}</span>
                <!-- 新增发信域名   -->
                <el-button type="primary" v-if="domainList.length<2" style="margin-left:10px;" @click="$emit('openAddWebsite')">{{$t('mxpcweb.am.1531904784321')}}</el-button>
            </div>
            <div class="tableBox">
                <el-row class="title">
                    <el-col :span="8">
                        <!-- 发信域名 -->
                        {{$t('mxpcweb.am.1531904784544')}}
                    </el-col>
                    <el-col :span="7">
                        <!-- IP类型 -->
                        {{$t('mxpcweb.am.1531904784744')}}
                    </el-col>
                    <el-col :span="5">
                        <!-- 状态 -->
                        {{$t('mxpcweb.am.1531903971129')}}
                    </el-col>
                    <el-col :span="4">
                        <!-- 操作 -->
                        {{$t('mxpcweb.am.1531902668646')}}
                    </el-col>
                </el-row>
                <no-data v-if="domainList.length==0" style="background:rgba(255,255,255,0)"></no-data>
                <el-row v-else v-for="(item,index) in domainList" :key="index" class="list">
                    <el-col :span="8">
                        {{item.domainName}}
                    </el-col>
                    <el-col :span="7">
                        <!-- 共享IP -->
                        {{$t('mxpcweb.am.1531904784952')}}
                    </el-col>
                    <el-col :span="5">
                        <span :style="{color:statusColor[item.domainVerify]}"> {{getStatusName(item.domainVerify)}}</span>
                        <!--
                        <span style="color:#ff9900">可使用</span>
                        <span style="color:#007b00">已验证</span> -->
                    </el-col>
                    <el-col :span="4">
                        <!-- 配置 -->
                        <span class="text-hover" @click="$emit('openDetail',item)">{{$t('mxpcweb.am.1531904813912')}}</span>
                        <!-- 修改 -->
                        <span v-if="item.domainVerify <7" style="margin-left:15px" class="text-hover" @click="$refs.upWebsite.showDialog(item)">{{$t('mxpcweb.am.1531904901865')}}</span>
                        <!-- 修改 -->
                        <span v-else style="color:#c2bcbc;margin-left:15px">{{$t('mxpcweb.am.1531904901865')}}</span>
                    </el-col>
                </el-row>
            </div>
        </template>
        <up-website ref="upWebsite" @getListData="getListData"></up-website>
    </div>
</template>

<script>

import NoData from '@/basecomponents/NoData/index'
import upWebsite from '../dialog/upWebsite'
export default {
    name: 'tabSendWebsite',
    props: {

    },
    data() {
        return {
            domainList: [],
            loading: true,
            statusColor: {
                0: 'RGBA(255, 113, 101, 1)', // 未经证实的
                2: 'RGBA(255, 113, 101, 1)', // 未经证实的
                7: 'RGBA(255, 183, 53, 1)', // 可获得的
                39: 'RGBA(139, 216, 103, 1)' // 已证实的
            }
        }
    },
    created() {
        this.getListData()
    },
    methods: {
        getStatusName(key) {
            let name = ''
            switch (parseInt(key)) {
                case 0:
                case 2:
                    name = '未验证'
                    break
                case 7:
                    name = '可使用'
                    break
                case 39:
                    name = '已验证'
                    break

                default:
                    name = '未验证'
                    break
            }
            return name
        },
        getListData(obj) {
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.v2.domainManage_Get, { params: {} }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.domainList = res.body.data.domainList
                    _this.loading = false
                } else if (res.body.code.toString() != '-3') {
                    this.$message.error(this.msg(res.body))
                    this.loading = false
                } else {
                    this.loading = false
                }
            }, function (res) {
                this.loading = false
                this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
        'no-data': NoData,
        'up-website': upWebsite
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tabSendWebsite {
  min-height: 95%;
  .buttonStyle {
    height: 30px;
    background: #6ca2ff;
    border: 0;
    font-size: 13px;
  }
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
