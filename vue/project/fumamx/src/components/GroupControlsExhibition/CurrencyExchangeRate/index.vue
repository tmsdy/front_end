<template>
    <div class="Group-CurrencyExchangeRate">

    </div>
</template>

<script>
export default {
  name: 'Group-CurrencyExchangeRate',
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Group-CurrencyExchangeRate {
    width: 100%;
}
</style>
