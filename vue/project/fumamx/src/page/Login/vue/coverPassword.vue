<template>
    <div class="coverPassword">
        <!--重置密码，弹窗-->
        <el-dialog v-dialogDrag class="passwordDialog" :title="$t('mxpcweb.login.1528703593213')" :visible.sync="resetPasswordData.dialogVisible" size="tiny" :modal-append-to-body="false" :before-close="handleClose" custom-class="width420">
            <p class="forgetPassworld">{{$t('mxpcweb.login.1528703622586')}}<br>{{$t('mxpcweb.login.1528703650529')}}</p>
            <div class="marginTop20">
                <el-input type="password" v-model="resetPasswordData.password" :placeholder="$t('mxpcweb.login.1528703665726')"></el-input>
            </div>
            <div class="marginTop20">
                <el-input type="password" v-model="resetPasswordData.newPassword" :placeholder="$t('mxpcweb.login.1528703714372')"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPasswordData.dialogVisible = false">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                <el-button type="primary" @click="clickCoverPWD()">{{$t('mxpcweb.login.1528696139283')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getStore, checkPWD } from '@/libs/utils.js'
export default {
  name: 'coverPassword',
  props: {
    companySelected: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      // 重置密码
      resetPasswordData: {
        dialogVisible: false,
        password: '',
        newPassword: ''
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    isShow () {
      this.resetPasswordData.dialogVisible = true
    },
    // 点击重置密码
    clickCoverPWD () {
      let _this = this
      if (!checkPWD(_this.resetPasswordData.password)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528703650529')); return
      }
      if (_this.resetPasswordData.password !== _this.resetPasswordData.newPassword) {
        _this.$message.error(_this.$t('mxpcweb.login.1528781531782')); return
      }
      // 手机1 邮箱2， 解绑0 绑定1
      let flagsOld = getStore('auth').flags
      let data = {
        newPassword: _this.resetPasswordData.newPassword,
        flags: flagsOld
      }
      // 重置密码API
      this.$http.post(this.Global.baseURL + this.Global.api.v2.resetpwd, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          let companySelected = _this.companySelected// 当前所选企业
          // 重置后，假如status=0则在个人账号所属该企业改为1
          if (companySelected.status == 0) {
            // 修改个人账号信息所选企业下status
            let url = _this.Global.baseURL + _this.Global.api.v2.account_put
            let data = {
              flags: flagsOld,
              companies: [
                {
                  'cId': companySelected.cId,
                  'ctId': companySelected.ctId,
                  'status': 1
                }
              ]
            }
            _this.$http.put(url, data).then((res) => {
              if (res.body.code.toString() == _this.Global.RES_OK) {
                _this.$emit('updateSuccess')// 成功了，告诉可以登录了
              } else {
                _this.$message.error(_this.msg(res.body))
              }
            }, (res) => {
              _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
          } else {
            _this.$message.error(companySelected.status)
          }
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    handleClose (done) {
      done()
    }
  },
  components: {

  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.coverPassword {
    .passwordDialog {
        .marginTop20 {
            margin-top: 20px;
        }
        .codeImgUrl {
            margin-top: 2px;
        }
        .forMap {
            display: inline-block;
            height: 30px;
            line-height: 30px;
        }
        .forMap:hover {
            cursor: pointer;
            color: #008cee;
        }
        .forgetPassworld {
            font-size: 14px;
            color: #999;
            margin-bottom: 15px;
            .title {
                color: #FF9900;
                cursor: pointer;
            }
        }
    }
}
</style>
