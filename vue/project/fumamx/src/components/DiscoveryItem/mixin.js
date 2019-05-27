export default {
    data() {
        return {
            isLoadingDetail: false,
            deepDetailItem: {}
        }
    },
    methods: {
        async getDeepDetail(searchId) {
            this.isLoadingDetail = true
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_detailed
                let data = { id: searchId }
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.deepDetailItem = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoadingDetail = false
        }
    }
}
