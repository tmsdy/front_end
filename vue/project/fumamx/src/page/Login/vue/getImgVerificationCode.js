export default function getImgVerificationCode (fn) {
  let _this = this
  this.$http.get(this.Global.baseURL + this.Global.api.UniversalInterface.imgVerificationCode).then(function (res) {
    fn(res.body)
  }, function (res) {
    _this.$message.error('网络异常请重试')
  })
}
