<template>
    <el-dialog title="批注" :visible.sync="dialogVisible" custom-class="width720" :before-close="handleClose">
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'Postil',
  data () {
    return {
      dialogVisible: false
    }
  },
  created () {

  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
