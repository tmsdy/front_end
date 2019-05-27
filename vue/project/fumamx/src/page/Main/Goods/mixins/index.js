export const getPortList = _getPortList
export const getPortListShow = _getPortListShow

async function _getPortList(next) {
    if (this.portList) {
        if (this.portList.length == 0) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.dictionary + 'port').then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    next(res.body.data || [])
                    let listShow = {}
                    res.body.data.forEach(element => {
                        listShow[element.portId] = element.name
                    })
                    this.set_portList(res.body.data || [])
                    this.set_portListShow(listShow)
                } else {
                    next([])
                    this.$message.error(this.msg(res.body))
                }
            })
        } else {
            next(this.portList)
        }
    }
}
async function _getPortListShow(next) {
    if (this.portListShow) {
        if (JSON.stringify(this.portListShow) == '{}') {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.dictionary + 'port').then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.set_portListShow(res.body.data || [])
                    let listShow = {}
                    res.body.data.forEach(element => {
                        listShow[element.portId] = element.name
                    })
                    next(listShow)
                    this.set_portList(res.body.data || [])
                    this.set_portListShow(listShow)
                } else {
                    next({})
                    this.$message.error(this.msg(res.body))
                }
            })
        } else {
            next(this.portListShow)
        }
    }
}
