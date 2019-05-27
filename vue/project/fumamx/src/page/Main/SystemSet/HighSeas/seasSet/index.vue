
<template>
    <div class="seasSet" v-loading="loading">
        <div v-if="!loading">
            <div class="seasSetBox">
                <div class="formBox formBox1">
                    <!-- 启用自动放入公海 -->
                    <div class="useFlag">
                        <span class="useFlagBut">{{$t('mxpcweb.systemset.highseas.1528794880019')}}</span>
                        <el-switch v-model="seasdata.useFlag" @change="submit" on-text="" off-text="" ></el-switch>
                    </div>
                    <!-- 每天放入时间为 -->
                    <div class="formItemBox">
                        <div class="formItemTitle">{{$t('mxpcweb.systemset.highseas.1529024554393')}}</div>
                        <!-- 选择时间 -->
                        <el-time-picker v-model="seasdata.exectime" style="width:153px;"  @blur="submit" :placeholder="$t('mxpcweb.client.1529993635269')" size="small"> </el-time-picker>
                    </div>
                    <!-- 在将放入前 -->
                    <div class="formItemBox">
                        <div class="formItemTitle">{{$t('mxpcweb.systemset.highseas.1529024624780')}}</div>
                        <el-input-number  v-model="seasdata.reminderDays" :min="0" size="small" @change="submit" style="line-height:20px;width:153px;"></el-input-number>
                        <!-- 天的 -->
                        <span class="timePadding">{{$t('mxpcweb.systemset.highseas.1529024696899')}}</span>
                        <!-- 选择时间 -->
                        <el-time-picker v-model="seasdata.reminderTime" size="small" :placeholder="$t('mxpcweb.client.1529993635269')" @blur="submit" style="width:153px;"> </el-time-picker>
                        <!-- 提醒业务员及时跟进 -->
                        <span class="timePadding">{{$t('mxpcweb.systemset.highseas.1528794949547')}}</span>
                    </div>
                </div>
                <div class="formBox">
                    <!-- 掉入公海后抢回限制 -->
                    <div class="useFlag">
                        <span class="useFlagBut">{{$t('mxpcweb.systemset.highseas.1528794968588')}}</span>
                        <el-switch v-model="seasdata.useBackDays" @change="submit" on-text="" off-text="" ></el-switch>
                    </div>
                    <div class="formItemBox">
                        <!-- 客户掉入公海后 -->
                        <div class="formItemTitle">{{$t('mxpcweb.systemset.highseas.1528794985564')}}</div>
                        <el-input-number v-model="seasdata.backDays"  :min="0" size="small" style="line-height:20px;width:153px;" @change="submit"></el-input-number>
                        <!-- 天不能抢回 -->
                        <span class="timePadding">{{$t('mxpcweb.systemset.highseas.1529024775374')}}{{$t('mxpcweb.systemset.highseas.1528795330906')}}</span>
                    </div>
                </div>
            </div>
            <!-- 客户被转移或者系统定时划入公海后，前拥有人在N天内不能抢回。 -->
            <!-- 注 -->
            <div class="popupNotice popupNotice1">{{$t('mxpcweb.systemset.highseas.1529063845606')}}：<span class="star">*</span> {{$t('mxpcweb.systemset.highseas.1528795349652')}}</div>
            <!-- 从开启公海或获得客户（新增、转移、从公海抢到客户）开始，对客户和客户的邮件、跟进、报价以及新增订单都视为跟进了客户。 -->
            <div class="popupNotice popupNotice2" ><span class="star">*</span> {{$t('mxpcweb.systemset.highseas.1529024843126')}}</div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'seasSet',
  props: {
  },
  data () {
    return {
      seasdata: {
        useFlag: false,
        useBackDays: true,
        backDays: 10,
        exectime: '',
        reminderDays: 8,
        reminderTime: ''
      },
      seasdata1: {
        useFlag: 0,
        useBackDays: 1,
        backDays: 10,
        exectime: '00:00:00',
        reminderDays: 8,
        reminderTime: '00:00:00'
      },
      loading: true,
      optChange: true,
      seasTimers: ''
    }
  },
  created () {
    this.getData()
  },
  mounted () {

  },
  beforeDestroy: function () {
    this.seasdata.exectime = null
    this.seasdata.reminderTime = null
  },
  methods: {
    getData () {
      this.optChange = true
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.seasSetting_set_do, {
        params: {
        }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          let data = res.body.data
          this.seasdata = {
            useFlag: data.useFlag == '1',
            useBackDays: data.useBackDays == '1',
            backDays: data.backDays,
            exectime: new Date('2018/01/01 ' + data.exectime),
            reminderDays: data.reminderDays,
            reminderTime: new Date('2018/01/01 ' + data.reminderTime)
          }
          _this.optChange = false
          _this.$emit('closeLoad')
          _this.closeLoad()
        } else {
          _this.$message.error(_this.msg(res.body))
          _this.$emit('closeLoad')
          _this.closeLoad()
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
        _this.$emit('closeLoad')
        _this.closeLoad()
      })
    },

    closeLoad () {
      let _this = this
      setTimeout(function () {
        _this.loading = false
      }, 200)
    },
    submit () {
      if (this.optChange) {
        return false
      };
      let _this = this
      if (_this.seasTimers != '') {
        clearTimeout(_this.seasTimers)
      };
      _this.seasTimers = setTimeout(function () {
        _this.seasdata1 = {
          useFlag: _this.seasdata.useFlag ? '1' : '0',
          useBackDays: _this.seasdata.useBackDays ? '1' : '0',
          backDays: _this.seasdata.backDays.toString(),
          reminderDays: _this.seasdata.reminderDays.toString(),
          exectime: _this.$m_unifiedTime(_this.seasdata.exectime).slice(11),
          reminderTime: _this.$m_unifiedTime(_this.seasdata.reminderTime).slice(11)
        }
        _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.seasSetting_set_do, _this.seasdata1).then((res) => {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.success(_this.msg(res.body))
            // this.getData();
          } else {
            _this.$message.error(_this.msg(res.body))
            _this.getData()
          }
        }, (res) => {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }, 1000)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
