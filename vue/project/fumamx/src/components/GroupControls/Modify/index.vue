<template>
    <div class="Group-Modify">
        <el-select v-model="value" :placeholder="$t('mxpcweb.basecomponents.1530697172321')">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
  name: 'Group-Modify',
  data () {
    return {
      options: [],
      value: ''
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Group-Modify {
    width: 100%;
}
</style>
