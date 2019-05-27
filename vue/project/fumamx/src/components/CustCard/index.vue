<template>
    <div class="CustCard">
        <div class="listItemBox" v-for="(items,indexs) in list" :key="indexs">
            <div class="listItem MXscroll">
                <div class="state">
                    <div v-if="items.delState == '1'" class="watermark delState">
                        {{$t('mxpcweb.client.1529992197697')}}
                    </div>
                    <div v-if="items.seasFlag == '1'" class="watermark seasFlag">
                        {{$t('mxpcweb.client.1529043704565')}}
                    </div>
                </div>
                <div class="listItemName">{{items.custName}}</div>
                <div class="listContent" v-for="(item,index) in showList" :key="index" v-if="item.fieldName!='custName'">
                    <div class= "ellipsis">
                        <component v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:returnValue(item,items)}"></component>
                    </div>
                    <div class="cnFieldCaption ellipsis">{{item.moduleCode=='BF001'?item.cnFieldCaption+':':item.cnFieldCaption+'&lt;'+$t('mxpcweb.client.1529027235743')+'&gt;:'}}</div>
                </div>
            </div>
            <div class="optionBox">
                <el-button class="option lookButton" style="margin-right:-5px;" type="primary" size="mini" @click="$emit('lookCust',items)">{{$t('mxpcweb.systemset.feedback.1529065492190')}}</el-button>
                <el-button class="option receiveButton" v-if="items.delState == '0'&&items.seasFlag == '1'" type="primary" size="mini" @click="otReceive(items.custId)">{{$t('mxpcweb.client.1529043733014')}}</el-button>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import ListShow from '@/components/ListShowControls/index.js'
export default {
  name: 'CustCard',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    showList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    upList() {
        this.$emit('checkRepeats')
    },
    otReceive(id) {
        let _this = this
        ep.emit('setGlobalLoading', {
            val: true,
            // 权限校验中...
            text: this.$t('mxpcweb.client.list.1550126019122') + '...'
        })
        _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: {
            moduleCode: 'BF001',
            identFieldValue: id,
            optCode: 'otReceive'
        } }).then(function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
                let obj = {
                    billId: id,
                    optData: {
                        optCode: 'otReceive',
                        optModuleCode: 'BF001',
                        optName: _this.$t('mxpcweb.client.1529043733014')
                    },
                    next: _this.upList
                }
                ep.emit('optClick', obj)
            } else {
                _this.$message.error(_this.msg(res.body))
            }
            ep.emit('setGlobalLoading', {
                val: false,
                text: ''
            })
        }, function(res) {
            ep.emit('setGlobalLoading', {
                val: false,
                text: ''
            })
            _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
    },
    returnValue (item, data) {
      if (item.moduleCode == 'BF001' && item.fieldName) {
        return data[item.fieldName]
      } else if (item.moduleCode == 'BF003' && item.fieldName) {
        if (data.custContacts && data.custContacts.length > 0) {
          return data.custContacts[0][item.fieldName]
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  watch: {

  },
  components: Object.assign({}, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
