<template>
<div class="whiteList">
    <!-- 白名单列表（以英文逗号“，”分割。支持 * 通配符） -->
    <!-- <div>{{$t('mxpcweb.systemset.systemparameter.1530351057634')}}</div> -->
    <!-- <el-form-item label="" prop="companyWhiteList"> -->
        <!-- 请输入白名单，如：192.168.1.102,255.7.*.3 -->
        <!-- <el-input type="textarea" style="width:500px;margin-top:10px;" :autosize="{ minRows: 5, maxRows: 8}" :placeholder="$t('mxpcweb.systemset.systemparameter.1530351090498')" v-model="systemParameter.companyWhiteList"> </el-input>
    </el-form-item> -->
    <div class="addBox">
      <el-button @click="$refs.otAdd.openWindow()">添加白名单</el-button>
    </div>
    <div class="title">
      <el-row :gutter="20">
        <el-col :span="4">IP地址</el-col>
        <el-col :span="16">适用人员</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
    </div>
    <div class="list" v-for="(item, index) in companyWhiteList" :key="index">
      <el-row :gutter="20">
        <el-col :span="4">{{item.whiteIP}}</el-col>
        <el-col :span="16">
          <span v-for="(people, indexs) in item.applyCtId.split(',')" :key="indexs">
            {{contactList[people]}}
          </span>
        </el-col>
        <el-col :span="4">
          <!-- 编辑 -->
          <span class="optButton right10" @click="$refs.otAdd.openWindow(item)" :title="$t('mxpcweb.am.1531893071733')">
              <i class="iconfont icon-edit"></i>
          </span>
          <!-- 删除 -->
          <span class="optButton right10" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')">
              <i class="iconfont icon-del"></i>
          </span>
        </el-col>
      </el-row>
    </div>
    <ot-add ref="otAdd" @getInitDataIP="getInitDataIP"></ot-add>
</div>
</template>

<script>
import otAdd from './otAdd'
import { mapGetters } from 'vuex'
export default {
  name: 'SecuritySet',
  props: {

  },
  data () {
    return {
      companyWhiteList: []
    }
  },
  created () {
    this.getInitDataIP()
  },
  mounted () {
  },
  methods: {
    deleteItem(item) {
      this.$confirm('是否删除此IP', this.$t('mxpcweb.client.1529047715824'), {
          confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
          cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
          type: 'warning'
      }).then(() => {
        let url = this.Global.baseURL + this.Global.api.v2.companyWhiteList2
        this.$http.delete(url, { params: {
          whiteId: item.whiteId
        } }).then((res) => {
            if (res.body.code.toString() == this.Global.RES_OK) {
                this.getInitDataIP()
                this.$message.success(this.msg(res.body))
            } else {
                this.$message.error(this.msg(res.body))
            }
        }, (res) => {
            this.$message.error(this.$t(this.Global.errorTitle))
        })
      }).catch(() => {
      })
    },
    getInitDataIP () {
      let url = this.Global.baseURL + this.Global.api.v2.companyWhiteList2
      this.$http.get(url, { params: {} }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.companyWhiteList = res.body.data
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, (res) => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    }
  },
  computed: {
    ...mapGetters([
      'contactList'
    ])
  },
  components: {
    'ot-add': otAdd
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.whiteList{
  .addBox{
    height: 40px;
  }
  .title{
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    width: 100%;
    background: rgba(239, 242, 244, 1);
    color: RGBA(144, 147, 153, 1);
  }
  .list{
    min-height: 54px;
    background: white;
    padding-left: 20px;
    color: #222222;
    border-bottom: 1px solid #f4f5f6;
    padding: 20px 20px;
    font-size: 12px;
    position: relative;
    .optButton{
        margin-right: 10px;
        display: inline-block;
        width:24px;
        height:24px;
        line-height: 24px;
        text-align: center;
        vertical-align: top;
        i{
            font-size: 20px;
            color: #606266;
        }
        &:hover {
            cursor: pointer;
            i{
                color:#E6001F;
            }
        }
    }
  }
}
</style>
