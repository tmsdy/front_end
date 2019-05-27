<template>
    <!-- 查看接收人地址 -->
    <el-dialog :close-on-click-modal="false" v-dialogDrag :title="$t('mxpcweb.am.1531900814015')" :visible.sync="dialogLook" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div>
            <!-- 列表名称： -->
            {{$t('mxpcweb.am.1531900816414')}}
            <el-select v-model="itemData" style="width:502px" @change="change()">
                <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.invokeName">
                </el-option>
            </el-select>
        </div>
        <div class="dialogLookBox MXscroll" v-loading="loading">
            <el-row class="lookTitle lookList">
                <!-- 邮箱 -->
                <el-col :span="20">{{$t('mxpcweb.am.1531900664136')}}</el-col>
                <!-- 昵称 -->
                <el-col :span="4">{{$t('mxpcweb.am.1531900824830')}}</el-col>
            </el-row>
            <div style="height:10px;"></div>
            <el-row class="lookList" v-for="(item,index) in dialogLookList" :key="index" :title="index">
                <el-col :span="20" :title="item.member" class="ellipsis">{{item.member}}</el-col>
                <el-col :span="4">{{item.name}}</el-col>
            </el-row>
        </div>
        <div style="padding:18px 26px 0;">
            <el-pagination small layout="prev, pager, next" @current-change="emailStatus" :current-page="currentPage" :page-size="10" :total="dialogLookTotal"></el-pagination>
        </div>
        <div slot="footer" style="text-align:center">
            <!-- 确定 -->
            <el-button type="primary" @click="dialogLook=false">{{$t('mxpcweb.am.1531893129621')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'dialogLookBox',
    props: {
        ctid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogLook: false,
            dialogLookList: [],
            currentPage: 1,
            dialogLookTotal: 0,
            loading: false,
            itemData: '',
            options: []
        }
    },
    methods: {
        show(list) {
            this.options = list
            this.itemData = list[0].invokeName
            this.emailStatus()
            this.dialogLook = true
        },
        change() {
            this.currentPage = 1
            this.emailStatus()
        },
        emailStatus(val, old) {
            let _this = this
            _this.loading = true
            _this.currentPage = val == undefined ? 1 : parseInt(val)
            let data = {
                from: (_this.currentPage - 1) * 10,
                size: 10,
                invokeName: _this.itemData
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrMember_Get, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.dialogLookList = res.body.data.dataList
                    _this.dialogLookTotal = res.body.data.total
                    _this.loading = false
                } else if (res.body.code.toString() != '-3') {
                    _this.dialogLookList = []
                    _this.dialogLookTotal = 0
                    _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                } else {
                    _this.dialogLookList = []
                    _this.dialogLookTotal = 0
                    _this.loading = false
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
    },
    components: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.dialogLookBox {
    min-height: 200px;
    max-height: 500px;
    overflow: auto;
    font-size: 12px;
    .lookTitle {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        background: rgba(239, 242, 244, 1);
        color: RGBA(144, 147, 153, 1);
        margin-top: 20px;
    }
    .lookList {
        height: 40px;
        line-height: 40px;
        padding: 0 40px;
    }
}
</style>
