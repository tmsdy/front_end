export const GetRightsCheck = async function (data) {
    let res = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetRightsCheck, {
        params: data
    })
    return res.body.code.toString() == this.Global.RES_OK
}
