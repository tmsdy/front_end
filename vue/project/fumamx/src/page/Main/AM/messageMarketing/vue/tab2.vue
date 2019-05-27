<template>
    <div class="tabitem">
        <div class="sendeeBox" v-if="tabData==='1'">
            <div class="sendeeBoxSearch">
                <div class="addButtonBox">
                    <el-button class="addButton" type="primary" @click="$refs.addName.show()" size="small">新建模板</el-button>
                </div>
                <el-input class="addInput" v-model="keywords" placeholder="模板名称" icon="search"></el-input>
            </div>

            <div class="sendeeBoxList">
                <el-row class="list" :gutter="20">
                    <el-col :span="4">模板名称</el-col>
                    <el-col :span="3">业务类型</el-col>
                    <el-col :span="3">内容类型</el-col>
                    <el-col :span="4">更新时间</el-col>
                    <el-col :span="3">更新人</el-col>
                    <el-col :span="3">状态</el-col>
                    <el-col :span="4">操作</el-col>
                </el-row>
            </div>
            <div class="sendeeBoxList sendeeBoxTit MXscroll" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                <no-data v-if="sendeeList.length==0&&!loading" style="background:rgba(255,255,255,0)"></no-data>
                <el-row v-else class="list1" :gutter="20" v-for="(item,index) in sendeeList" :key="index">
                    <el-col :span="4">模板名称</el-col>
                    <el-col :span="3">业务类型</el-col>
                    <el-col :span="3">内容类型</el-col>
                    <el-col :span="4">更新时间</el-col>
                    <el-col :span="3">更新人</el-col>
                    <el-col :span="3">状态</el-col>
                    <el-col :span="4">
                        <span class="text-hover">预览</span>
                        <span class="text-hover left10">编辑</span>
                        <span class="text-hover left10">删除</span>
                    </el-col>
                </el-row>
            </div>
            <!--分页-->
            <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
        </div>
        <add-name ref="addName"></add-name>
        <detail v-if="tabData==='3'"></detail>
    </div>
</template>

<script>
import listPage from '@/components/listPageTwo/index' // 分页
import NoData from '@/basecomponents/NoData/index'
import addName from './addName2'
import detail from './detail2'
export default {
    name: 'tabitem2',
    props: {

    },
    data() {
        return {
            loading: true,
            keywords: '',
            sendeeList: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            detailData: {
                invokeName: '',
                name: ''
            },
            tabData: '1'
        }
    },
    created() {
        this.getListData()
    },
    methods: {
        tabDataTab(type) {
            this.tabData = type
        },
        getListData(obj) {
            let _this = this
            _this.sendeeList = [{}]
            _this.loading = false
            // let data = {
            //     from:parseInt(_this.blockData.fromNum/_this.blockData.pageSize),
            //     size:_this.blockData.pageSize,
            // };
            // _this.$http.get(this.Global.baseURL + this.Global.api.am.addresslist_header_list, { params:data }).then(function(res) {
            //     if (res.body.code.toString() == _this.Global.RES_OK) {
            //         if(res.body.data.dataList&&isArray(res.body.data.dataList)){
            //             _this.sendeeList = res.body.data.dataList;
            //             _this.blockData.total = res.body.data.resultCount;
            //         }else{
            //             _this.sendeeList = [];
            //             _this.blockData.total = 0;
            //         }
            //         _this.loading = false;
            //     } else {
            //         _this.loading = false;
            //         _this.$message.error(_this.msg(res.body));
            //     }
            // }, function(res) {
            //     _this.loading = false;
            //     _this.$message.error(_this.$t(_this.Global.errorTitle));
            // });
        },
        deleteItem(list) {
            this.$confirm('即将删除此接收人列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    address: list.invokeName
                }
                this.$http.post(this.Global.baseURL + this.Global.api.am.addresslist_header_delete, data).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(_this.msg(res.body))
                        this.getListData()
                    } else {
                        this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        }
    },
    components: {
        'list-page': listPage,
        'no-data': NoData,
        'add-name': addName,
        'detail': detail
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.sendeeBox {
  color: #6b6b6b;
  font-size: 14px;
  width: 100%;
  .sendeeBoxSearch {
    height: 52px;
    line-height: 52px;
    overflow: hidden;
    padding: 0 10px;
    background: white;
    .addButtonBox {
      float: right;
      position: relative;
      top: -1px;
    }
    .addInput {
      float: right;
      width: 150px;
      margin: 0 10px;
    }
  }
  .sendeeBoxList {
    font-size: 12px;
    overflow-x: hidden;
    color: #333333;
    .list {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      background: rgba(239, 242, 244, 1);
      color: RGBA(144, 147, 153, 1);
    }
    .list1 {
      height: 54px;
      line-height: 54px;
      padding-left: 20px;
      color: RGBA(34, 34, 34, 1);
      border-bottom: 1px solid rgba(234, 237, 239, 1);
      background: white;
      .left10 {
        margin-left: 10px;
      }
    }
  }
}
</style>
