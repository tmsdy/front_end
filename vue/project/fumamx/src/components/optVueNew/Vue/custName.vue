<template>
    <div class="custName">{{custName}}</div>
</template>

<script>
export default {
  name: 'custName',
  props: {
    custId: {
        type: String,
        default: ''
    },

    moduleCode: {
        type: String,
        default: ''
    }
  },
  data() {
    return {
      custName: ''
    }
  },
  computed: {
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
        let _this = this
        if (_this.custId != '') {
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, {
                params: {
                    moduleCode: 'BF001',
                    identFieldValue: _this.custId,
                    searchType: 'detail'
                }
            }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.custName = res.body.data.custName
                } else {
                    // 上级客户不存在，或已删除
                    _this.$message.error(_this.$t('mxpcweb.client.1529053152502'))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        } else {
             _this.custName = ''
        }
    }
  },
  watch: {
    'custId': function(val, oldval) {
        this.getData()
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.custName{
    display:inline-block;
}
</style>
