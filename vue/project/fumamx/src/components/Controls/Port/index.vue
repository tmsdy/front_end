<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <!-- <el-select v-model="ruleForm.input" filterable remote :remote-method="remoteMethod" :disabled="itemData.disabled" clearable :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                <el-option v-if="isProp" :label="$t('mxpcweb.client.1529060999660')" value="">
                </el-option>
                <div  v-for="item in options" :key="item.portId">
                  <el-option :label="item.name" :value="item.portId+''">
                  </el-option>
                </div>
            </el-select> -->
            <el-select clearable :disabled="itemData.disabled" v-model="ruleForm.input" @visible-change="click" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
              <div class="searchBox">
                <el-input v-model="keyWords" ref="searchInput" @change="getData()" icon="search" :size="size"></el-input>
              </div>
              <div class="portBox MXscroll">
                <el-option v-show="false" label="" value=""></el-option>
                <div class="nodata" v-show="loading">
                  <loading></loading>
                </div>
                <div v-show="!loading">
                  <div v-if="options.length > 0">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.portId+''"> </el-option>
                  </div>
                  <div class="nodata" v-else>
                    未找到结果
                  </div>
                </div>
              </div>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { getPortList } from '@/page/Main/Goods/mixins/index.js'
import Loading from '@/basecomponents/Loading/index'
import { mapGetters, mapMutations } from 'vuex'
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
      keyWords: '',
      options: [],
      baseOptions: [],
      baseSearchList: [],
      loading: false,
      isMore: false,
      ruleForm: {
        input: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      },
      blockData: { // 分页
        fromNum: 0,
        pageSize: 50
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
        'portList'
    ])
  },
  created () {
    this.getBaseData()
  },
  mounted() {
    $(this.$el).find('.portBox').scroll(this.bindScroll)
  },
  methods: {
    // 同步设置
    ...mapMutations('goods', {
        set_portListShow: 'SET_PORTLISTSHOW',
        set_portList: 'SET_PORTLIST'
    }),
    getPortList,
    bindScroll(e) {
      if (this.isMore) {
        return false
      }
      this.isMore = true
      let time = setTimeout(() => {
        let h = e.target.clientHeight // div可视区域的高度
        let sh = e.target.scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
        let st = e.target.scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
        if (h + st >= sh - 4) {
          this.more()
        }
        h = null
        sh = null
        st = null
        this.isMore = false
        window.clearTimeout(time)
      }, 300)
    },
    click(val) {
        if (val) {
            this.$nextTick(() => {
                this.$refs.searchInput.$el.children[1].focus()
            })
        }
    },
    more () { // 下拉刷新触发事件，每次新增50条数据
      this.blockData.pageSize += 50
      this.getDatas()
    },
    getData() {
      this.blockData.pageSize = 50
      if (this.keyWords != '') {
        this.baseSearchList = this.baseOptions.filter((item) => {
            return item.name.replace(/\s+/g, '').indexOf(this.keyWords.toUpperCase().replace(/\s+/g, '')) != -1
        })
        this.options = this.baseSearchList.slice(0, this.blockData.pageSize)
      } else {
        this.getDatas()
      }
      this.getItemList()
    },
    getDatas() {
      if (this.keyWords != '') {
        this.options = this.baseSearchList.slice(0, this.blockData.pageSize)
      } else {
        this.options = this.baseOptions.slice(0, this.blockData.pageSize)
      }
      this.getItemList()
    },
    getBaseData() {
        this.getPortList((data) => {
          if (data.length <= 0) {
              this.baseOptions = []
              this.options = []
          } else {
              this.baseOptions = data
              this.options = data.slice(0, this.blockData.pageSize)
          }
          this.getItemList()
        })
    },
    change () {
      let newValue = this.ruleForm.input
      newValue = (newValue == -1) ? '' : newValue
      this.$emit('update:controlData', newValue)
      this.$emit('change', newValue)
    },
    updata (isControlData, value) {
      if (value) {
         this.ruleForm.input = value + ''
      } else if (isControlData) {
        this.ruleForm.input = this.itemData.controlData + ''
      } else {
        this.ruleForm.input = (this.itemData.fieldValue != []) ? this.itemData.fieldValue + '' : ''
      }
      this.getItemList()
    },
    updatas (value) {
      this.ruleForm.input = value + ''
      this.getItemList()
    },
    getItemList () {
      if (this.ruleForm.input != '') {
        let isHave = false
        this.options.forEach(item => {
          if (this.ruleForm.input == item.portId + '') {
            isHave = true
          }
        })
        if (!isHave) {
          this.baseOptions.forEach(item => {
            if (this.ruleForm.input == item.portId + '') {
              this.options.push(item)
            }
          })
        }
      }
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      if (this.isProp) {
        this.ruleForm.input = ''
      } else {
        this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
        this.getItemList()
      }
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
  watch: {
  },
  components: {
    'loading': Loading
  },
  beforeDestroy: function () {
      this.remoteMethod = null
      this.updata = null
      this.updatas = null
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.more{
    text-align:center;
    color:grey;
    margin-bottom:10px;
}
.searchBox{
  position: absolute;
  top: 2px;
  left: 0;
  right: 0;
  padding: 6px 10px 4px;
  background: white;
  z-index: 10;
}
.portBox{
  height: calc(100% - 40px);
  margin-top: 40px;
  max-height: 200px;
  overflow: scroll;
  .nodata{
    padding: 8px 16px;
    text-align: center;
  }
}
</style>
