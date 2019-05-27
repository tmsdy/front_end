<template>
<!-- 分享商品到社交平台 -->
    <el-dialog :title="$t('mxpcweb.PP001.PP001List.1543304762137')" :visible.sync="dialogVisible" :modal-append-to-body="false" :closeOnClickModal="false" custom-class="width820" v-dialogDrag size="tiny">
        <el-form class="formBox" label-position="left" ref="form" label-width="100px">
            <!-- 每天每个账号只能发布一条即时发布消息，超过将影响您的推广效果 -->
            <div class="tip">{{$t('mxpcweb.PP001.PP001List.1543304760196')}}</div>
            <!-- 发布账号: -->
            <el-form-item :label="$t('mxpcweb.PP001.PP001List.1543304773810')" class="accountBox">
                <el-checkbox-group v-model="selAccounts">
                    <el-checkbox v-for="(item,index) in accounts" :label="item" :key="index" class="checkBox">
                        <i v-if="item.type=='fb'||item.type=='fb-pages'" class="iconfont icon-facebook facebookIcon"></i>
                        <i v-if="item.type=='twitter'" class="iconfont icon-twitter twitterIcon"></i>
                        <i v-if="item.type=='linkedin'" class="iconfont icon-linkedin linkedinIcon"></i>
                        <i v-if="item.type=='pinterest'" class="iconfont icon-pinterest pinterestIcon"></i>
                        {{item.account}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- 发布内容: -->
            <el-form-item :label="$t('mxpcweb.PP001.PP001List.1543304780466')" class="accountBox">
                <!-- 请输入内容 -->
                <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10}" :placeholder="$t('mxpcweb.PP001.PP001List.1543304786330')" style="width:600px;" v-model="textarea">
                </el-input>
            </el-form-item>
            <el-form-item>
                <!-- 分享 -->
                <el-button class="shareBtn" type="primary" icon="share" size="small" @click="submit()" :loading="submitLoading">{{$t('mxpcweb.PP001.PP001List.1540347766752')}}</el-button>
            </el-form-item>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
            <div style="text-align:center;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()" :loading="submitLoading">确 定</el-button>
            </div>
        </span> -->
    </el-dialog>
</template>
<script>
export default {
    name: 'share',
    props: {
    },
    data() {
        return {
            dialogVisible: false,
            accounts: [],
            selAccounts: [],
            textarea: '',
            itemData: {},
            submitLoading: false
        }
    },
    mounted() {
    },
    methods: {
        open(item) {
            this.itemData = item
            this.selAccounts = []
            this.textareathis = ''
            this.dialogVisible = true
            this.getData()
        },
        getData() {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialRelease
            this.$http.get(url).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.accounts = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        submit() {
            let list = []
            if (this.selAccounts.length === 0) {
                // 请选择发布账号后再提交
                this.$message(this.$t('mxpcweb.PP001.PP001List.1543304786698'))
                return false
            }
            this.selAccounts.forEach(item => {
                let obj = {
                    outerId: item.outer_id,
                    accountType: item.type,
                    account: item.account,
                    isPublic: item.is_public
                }
                list.push(obj)
            })
            let data = {
                account: list,
                link: this.getGoodsLink(this.itemData.spuId),
                name: this.itemData.spuName,
                description: this.textarea
            }
            let url = this.Global.baseURL + this.Global.api.v2.find_socialRelease
            this.submitLoading = true
            this.$http.post(url, data).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.submitLoading = false
                    this.dialogVisible = false
                } else {
                    this.submitLoading = false
                    this.$message.error(this.msg(res.body))
                }
            })
                .catch(err => {
                    this.submitLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    }
}
</script>
<style lang="less" scoped>
.tip{
    background: rgba(252,242,243,1);
    text-align: center;
    height: 30px;
    line-height: 30px;
    color:#D0021B;
    border-radius: 3px;
    margin-bottom: 10px;
}
.accountBox {
    .checkBox{
        margin-left: 0;
        margin-right: 15px;
    }
  .iconfont {
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    display: inline-block;
    /* float: left; */
    font-size: 12px;
    color: #fff;
    margin-right: 5px;
  }
  .facebookIcon {
    background-color: #3b5999;
  }
  .twitterIcon {
    background-color: #00aef4;
  }
  .linkedinIcon {
    background-color: #0073b1;
  }
  .pinterestIcon {
    background-color: #d02c30;
  }
  .shareBtn {
    border-radius: 16px;
    height: 32px;
  }
}
</style>
