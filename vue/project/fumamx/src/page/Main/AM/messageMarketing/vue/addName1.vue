<template>
    <div class="addName MXscroll">
        <h3 style="height:70px;line-height:50px;">
            <span class="text-hover" @click="$emit('tabDataCheck','1')" style="color:#b9b9b9;margin-right:20px;font-size:12px;" >
                <i class="iconfont icon-page-left"></i>
            </span>
            <span style="color:#6b6b6b;font-weight:400">新建短信</span>
        </h3>
        <template v-if="tabList=='0'">
            <div class="list">
                短信名称
                <div style="padding:10px 0;">
                    <el-input style="width:468px;" v-model="name">
                    </el-input>
                </div>
            </div>
            <div class="list">
                收件人地址
                <div style="padding:10px 0;">
                    <el-select style="width:232px;" v-model="name">
                    </el-select>
                    <el-select style="width:232px;" v-model="name">
                    </el-select>
                </div>
                <div style="padding:10px 0;">
                    <el-button size="small" style="width:120px;height:35px;">定时发送</el-button>
                    <el-button type="primary" size="small" style="width:120px;height:35px;">发送</el-button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'addName',
    props: {

    },
    data() {
        return {
            tabData: 0,
            tabList: 0,
            address: [{
                name: '',
                address: '',
                phone: ''
            },
            {
                name: '',
                address: '',
                phone: ''
            }, {
                name: '',
                address: '',
                phone: ''
            }, {
                name: '',
                address: '',
                phone: ''
            }, {
                name: '',
                address: '',
                phone: ''
            }],
            name: '',
            detailData: '',
            files: [],
            filesName: '',
            importLoading: false
        }
    },
    methods: {
        addName() {
            let _this = this
            if (this.name == '') {
                _this.$message('请输入列表名称')
                return false
            };
            _this.$http.post(this.Global.baseURL + this.Global.api.am.addresslist_header_add, {
                name: this.name.replace(/(^\s*)|(\s*$)/g, '')
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.detailData = res.body.data.resultString
                    this.tabList = '1'
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addName{
   .list{
       padding: 10px 50px;
   }

    .filedInput{
        height: 36px;
        line-height: 36px;
        width: 80px;
        border: 1px solid #bcbcbc;
        display: inline-block;
        text-align: center;
        position: relative;
        bottom: -1px;
    }
}
</style>
