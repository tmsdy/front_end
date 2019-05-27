<template>
    <div class="SocialContact">
        <template v-for="(item,index) in itemData.group">
            此组已取消，社交组，2018.01.05改
            <component :key="index" ref="control" v-if="index === 0" v-bind:is="'control'+item.controlTypeId" :itemData="item" :dataIndex="index" :controlData.sync="item.controlData" :labelPosition="labelPosition" :labelWidth="labelWidth"></component>
        </template>
    </div>
</template>

<script>
// 此组已取消，社交组，2018.01.05改
import Controls from '@/components/Controls/index.js'
export default {
  name: '',
  props: {
    isProp: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      selectVal: '',
      ruleForm: {
        input: ''
      },
      rules: {
        input: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 此组已取消，社交组，2018.01.05改
    updata () {
      // let _this = this;
      // this.ruleForm.mobileVal = _this.itemData.fieldValue != undefined ? _this.itemData.fieldValue.toString() : '';
    },
    submitForm () {
      let isPass = true
      // this.$refs['control'].forEach((item) => {
      //     if(!item.submitForm()){
      //         isPass = item.submitForm();
      //     }
      // });
      return isPass
    },
    clearData () {
      // this.ruleForm.arrMailVal = [""];
    },
    change () {
      // let arrGroup = this.itemData.group;
      // console.log(arrGroup);
      // // arrGroup.forEach(function(item){
      // //     item.
      // // });
      // this.$emit('update:controlData', arrGroup);
    }
  },
  components: Object.assign({
  }, Controls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.SocialContact{
    margin-top:-5px;
    margin-bottom:-5px;
    // border:1px solid red;
}
</style>
