<template>
  <div class="DialogEmployee">
    <!-- 请选择内分发人 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528955229279')" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogUserForm')" :close-on-click-modal="false" >
      <el-form ref="dialogUserForm" label-width="150px">
        <!-- 员工 -->
        <el-form-item :label="$t('mxpcweb.mail.1528955265325')">
          <el-select filterable v-model="svalue">
            <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.ctid"> </el-option>
          </el-select>
        </el-form-item>
        <div class="text-center">
          <!-- //取消 -->
          <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
          <!-- 确定 -->
          <el-button @click="submitUser('dialogUserForm')" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import { mapGetters, mapMutations } from 'vuex'
import { isObject } from '@/libs/utils.js'

export default {
  name: 'DialogEmployee',
  props: {},
  data () {
    return {
      isOpen: false, // 弹窗开关
      options: [],
      svalue: '',
      boxId: 0,
      targetBoxId: 0,
      containSubBox: false
    }
  },
  computed: {
    ...mapGetters('mail', [
      'treeMenu', // getters.js文件中personalInfo
      'subordinateCtid'
    ]),
    ...mapGetters([
      'company'
    ])
  },
  methods: {
    ...mapMutations('mail', {
      set_refurbishBool: 'SET_REFURBISHBOOL'
    }),
    // 清空表单
    resetForm (formName) {
      if (this.isOpen) {
        this.$refs[formName].resetFields()
      }
    },
    // 父组件来调用
    isDialogs (to) {
      if (to == 'open') {
        this.isOpen = true
        this.getPersonalData()
      } else {
        this.isOpen = false
      }
    },

    // 确定选择员工
    submitUser () {
      this.isOpen = false
      let _this = this
      if (
        _this.svalue != null &&
        _this.svalue != '' &&
        _this.options.length > 0
      ) {
        for (var i = 0; i < _this.options.length; i++) {
          if (_this.options[i].ctid == _this.svalue) {
            ep.emit('selectEmployee', _this.options[i])
            break
          }
        }
      }
    },
    // 取消
    cancelClick () {
      this.isOpen = false
    },
    // 获取页面数据
    getPersonalData () {
      let _this = this
      let url =
        this.Global.baseURL +
        this.Global.api.SystemSet.personaldata.accountIndividualInf
      //    if (this.subordinateCtid != this.company.ctId&&this.subordinateCtid !=0) {
      //   data.ctid = this.subordinateCtid;
      // }else{
      //   delete data.ctid;
      // }
      this.$http.get(url, { params: { type: 'allUserList' } }).then(
        function (res) {
          if (
            res.body.code.toString() == _this.Global.RES_OK &&
            isObject(res.body.data)
          ) {
            let data = res.body.data.accountList
            let list = []
            for (let i = 0; i < data.length; i++) {
              list.push({
                name: data[i].realName,
                ctid: data[i].companies[0].ctId
              })
            }
            _this.options = list
          } else {
             _this.$message.error(_this.msg(res.body))
          }
        },
        function (res) {
          _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
        }
      )
    }
  },
  watch: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
