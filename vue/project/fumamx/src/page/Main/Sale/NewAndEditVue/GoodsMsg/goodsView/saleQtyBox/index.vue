<template>
<div class="hideBox" v-show="isOpen">
  <div class="saleQtyBox">
    <div class="tableBox MXscroll">
      <table>
        <thead>
          <tr>
            <!-- 颜色分类 -->
              <th v-if="itemData.spec1">{{$t('mxpcweb.sale.components.1557565148925')}}</th>
              <!-- 尺码 -->
              <th v-if="itemData.spec2">{{$t('mxpcweb.sale.components.1557565149127')}}</th>
              <!-- 价格 -->
              <th>{{$t('mxpcweb.sale.components.1557565182480')}}</th>
              <!-- 数量 -->
              <th>{{$t('mxpcweb.sale.components.1557565035577')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
              <td v-if="itemData.spec1">{{returnSpec1(item.spec1)}}</td>
              <td v-if="itemData.spec2">{{returnSpec2(item.spec2)}}</td>
              <td>{{item.salePrice}}</td>
              <td>
                <!-- 请输入 -->
                  <input
                  @click.stop type="number"
                  min="0"
                  :placeholder="$t('mxpcweb.sale.components.1557565182681')"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onafterpaste="this.value=this.value.replace(/\D/g,'')"
                  v-model="item.saleQty"/>
                </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footerBox">
      <!-- 确 定 -->
      <el-button type="primary" @click="submit()">{{$t('mxpcweb.sale.components.1557564964547')}}</el-button>
      <!-- 取 消 -->
      <el-button @click="isOpen = false">{{$t('mxpcweb.sale.components.1557564617043')}}</el-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'saleQtyBox',
  props: {
  },
  data() {
    return {
      indexId: '',
      isOpen: false,
      itemData: {},
      list: []
    }
  },
  created() {},
  methods: {
    open(obj, index) {
      if (this.isOpen) {
        return
      }
      if (index) {
        this.indexId = index
      } else {
        this.indexId = ''
      }
      this.itemData = {}
      this.list = []
      this.itemData = JSON.parse(JSON.stringify(obj))
      if (this.itemData.qtyList) {
        let list = JSON.parse(JSON.stringify(this.itemData.qtyList))
        list.forEach(element => {
          let obj = {
            skuId: element.skuId,
            skuCode: element.skuCode
          }
          if (element.spec1) {
            obj.spec1 = element.spec1
          }
          if (element.spec2) {
            obj.spec2 = element.spec2
          }
          obj.saleQty = element.saleQty || '0'
          this.list.push(obj)
        })
      } else {
        let list = this.itemData.strucId_2
        list.forEach(element => {
          let obj = {
            skuId: element.skuId,
            skuCode: element.skuCode
          }
          if (element.spec1) {
            obj.spec1 = element.spec1
          }
          if (element.spec2) {
            obj.spec2 = element.spec2
          }
          obj.saleQty = '0'
          this.list.push(obj)
        })
      }
      this.isOpen = true
    },
    returnSpec1(code) {
      let name = ''
      this.itemData.spec1.forEach(item => {
        if (item.dictItemCode == code) {
          name = item.itemName
        }
      })
      return name
    },
    returnSpec2(code) {
      let name = ''
      this.itemData.spec2.forEach(item => {
        if (item.dictItemCode == code) {
          name = item.itemName
        }
      })
      return name
    },
    submit() {
      let saleQty = 0
      this.list.forEach(item => {
        saleQty += parseFloat(item.saleQty || 0)
      })
      let obj = JSON.parse(JSON.stringify(this.itemData))
      obj.qtyList = JSON.parse(JSON.stringify(this.list))
      obj.saleQty = saleQty
      this.$emit('updateItem', obj, this.indexId)
      this.isOpen = false
    }
  },
  components: {},
  watch: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
