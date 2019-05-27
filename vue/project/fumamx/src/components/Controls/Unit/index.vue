<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <!-- <el-select v-model="ruleForm.input" filterable  :disabled="itemData.disabled" clearable :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                <el-option v-if="isProp" :label="$t('mxpcweb.client.1529060999660')" value="">
                </el-option>
                <div v-for="item in unitList" :key="item.unitId">
                  <el-option :label="item.name" :value="item.unitId+''">
                  </el-option>
                </div>
            </el-select> -->
            <drop-down ref="dropDown" labelKey="name" valueKey="unitId" :itemData="itemData" @change="change" :ruleForm="ruleForm" :list="unitList" :rightWidth="rightWidth" :size="size"></drop-down>
        </el-form-item>
    </el-form>
</template>

<script>
import Dropdown from '../AControlsVue/Dropdown'
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-SystemDownBox',
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {
          cnFieldCaption: '',
          cnFieldHint: '',
          controlTypeId: 41,
          dictCode: 0,
          fieldCategory: 2,
          fieldGroup: 2,
          fieldName: 'twitter',
          inDefaultValue: '',
          isNotNull: 0,
          strucId: 1
        }
      }
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    isProp: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    rightWidth: {
      type: String,
      default: '160px'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      inputBase: '',
      ruleForm: {
        input: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      },
      rules: {
        input: [
          {
            type: 'string',
            required: true,
            // 请选择
            message: this.$t('mxpcweb.basecomponents.1530697172321') + this.itemData.cnFieldCaption,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
      ...mapGetters('goods', [
          'unitList'
      ])
  },
  created () {
  },
  mounted() {
    this.$nextTick(() => {
      this.getUnitListData()
    })
  },
  methods: {
    getUnitListData () {
      if (this.inputBase != '') {
        this.unitList.forEach(item => {
          if (item.unitId == this.inputBase) {
            this.$emit('selectStruId4', {unit: item.name})
          }
        })
      }
    },
    change () {
      let newValue = this.ruleForm.input
      newValue = (newValue == -1) ? '' : newValue
      this.$emit('update:controlData', newValue)
      this.$emit('change', newValue)
      if (this.itemData.fieldName == 'unit') {
        if (newValue == '') {
          this.$emit('selectStruId4', newValue)
        } else {
          if (this.unitList.length == '0') {
            this.inputBase = newValue
          } else {
            this.unitList.forEach(item => {
              if (item.unitId == newValue) {
                this.$emit('selectStruId4', {unit: item.name})
              }
            })
          }
        }
      }
    },
    updata (isControlData, value) {
      if (value) {
         this.ruleForm.input = value + ''
      } else if (isControlData) {
        this.ruleForm.input = this.itemData.controlData + ''
      } else {
        this.ruleForm.input = (this.itemData.fieldValue != []) ? this.itemData.fieldValue + '' : ''
      }
    },
    updatas (value) {
      this.ruleForm.input = value + ''
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      if (this.isProp) {
        this.ruleForm.input = ''
      } else {
        this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      }
      this.$refs.dropDown.clearData()
    },
    submitForm () {
      let newValue = this.ruleForm.input
      newValue = (newValue == -1) ? '' : newValue
      this.$emit('update:controlData', newValue)
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
          return false
        }
      })
      return isPass
    },
    prop () {
      if (this.itemData.disabled) {
        return ''
      };
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.isNotNull == 1) {
          return 'input'
        } else {
          return ''
        }
      }
    }
  },
  components: {
    'drop-down': Dropdown
  },
  watch: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
