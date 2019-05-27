<template>
    <div class="BelongTo">

        <div v-for="(item,index) in itemData.group" :key="index">

            <template v-if="item.fieldName == 'ownerDeptKey'">
                <span class="iconPeople">
                    <i class="iconfont icon-home"></i>
                </span>
                <component :labelWidth="labelWidth" :labelPosition="labelPosition" :options="item.departments" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" @modifyData="modifyData"></component>
            </template>

            <template v-if="item.fieldName == 'ownerCtId'">
                <span class="iconPeople iconDept">
                    <i class="iconfont icon-people"></i>
                </span>
                <component :labelWidth="labelWidth" :labelPosition="labelPosition" :options="item.owners" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" @modifyData="modifyData"></component>
            </template>

        </div>
    </div>
</template>
<script>
import ControlsExhibition from '@/components/ControlsExhibition/index.js'
import { isArray } from '@/libs/utils.js'
export default {
  name: 'BelongTo',
  props: {
    labelPosition: {// 控件label的位置
      type: String,
      default: 'left'
    },
    labelWidth: {// 控件label的宽度
      type: String,
      default: '100px'
    },
    itemData: {// 赋值给控件的数据
      type: Object,
      default: function () {
        return {}
      }
    },
    size: {// 控件输入框尺寸
      type: String,
      default: 'mini'
    }
  },
  methods: {
    // 子传来值时
    modifyData (obj) {
      // console.log(obj);
      // 判断哪里传过来的数据
      if (Object.keys(obj)[0] == 'ownerDeptKey') {
        this.$emit('modifyData', obj)
      } else {
        let ownerCtId = Object.values(obj)[0]
        this.getDep(ownerCtId, obj)
      }
    },
    // 根据人员ID，取得相关部门
    getDep (ownerCtId, obj) {
      let _this = this
      _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: { dataType: 'department', funType: 'customerAdd', ctId: ownerCtId } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          if (res.body.data.length == 0) {
            _this.$message.error(this.$t('mxpcweb.mail.1530005652639')) //   无数据
            return
          }
          // _this.departments = res.body.data;//重新传递部门数据
          let newObj = Object.assign(obj, {
            ownerDeptKey: res.body.data[0].dkey + ''
          })
          this.$emit('modifyData', newObj)// 通知提交数据
        } else {
          // _this.departments = [];
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    }
  },
  components: Object.assign({
  }, ControlsExhibition)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.BelongTo {
    // border: 1px solid blue;
    >div {
        // border: 1px solid blue;
        display: inline-block;
        margin-right: 25px;
        position: relative;
        padding-left: 12px;
        .iconPeople {
            // border:1px solid red;
            display:inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            position: absolute;
            top: 50%;
            margin-top: -8px;
            left: 0;
            color: #606266;
            border-radius: 50%;
            // &.iconDept{
            //     // left:16px;
            // }
            i {
                font-size: 16px;
            }
        }
    }
}
</style>
