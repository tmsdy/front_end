<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :closeOnClickModal="false" custom-class="width520" v-dialogDrag size="tiny">
        <div class="labelBox">
            <!-- 请输入标签名称 -->
            <div>{{$t('mxpcweb.systemset.SY022.1550114167009')}}</div>
            <div>
                <el-input v-model="value" clearable></el-input>
            </div>
            <div>
                <ul class="mailSign">
                    <li v-for="(item,index) in colors" :key="index" :class="[{active:index+1==color}]" :style="setBgColor(index+1)" @click="color = index+1">
                        <i class="iconfont icon-dot"></i>
                    </li>
                </ul>
            </div>
        </div>
        <div slot="footer">
            <!-- 取消 -->
            <el-button @click="dialogVisible = false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="submitLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { tagsBgColorsList } from '@/libs/utils.js'
export default {
    name: 'addLabel',
    props: {
    },
    data() {
        return {
            dialogVisible: false,
            value: '',
            submitLoading: false,
            item: {},
            moduleCode: '',
            // 新增标签
            title: this.$t('mxpcweb.systemset.SY022.1550114298106'),
            colors: [],
            color: 1
        }
    },
    created() {
        this.colors = this.getColorsList().slice(0, 10)
    },
    methods: {
        getColorsList() {
            return tagsBgColorsList()
        },
        // 背景色
        setBgColor(colorId) {
            return 'color:' + this.colors[colorId - 1]
        },
        openWindow(moduleCode, item) {
            this.moduleCode = moduleCode
            if (item) {
                this.value = item.labelName
                this.color = item.color
                this.item = item
                if (this.moduleCode == 'BF001') {
                    this.title = '客户管理 - 编辑标签'
                } else if (this.moduleCode == 'EM001') {
                    this.title = '孚盟邮 - 编辑标签'
                }
            } else {
                this.item = {}
                this.value = ''
                this.color = 1
                if (this.moduleCode == 'BF001') {
                    this.title = '客户管理 - 新增标签'
                } else if (this.moduleCode == 'EM001') {
                    this.title = '孚盟邮 - 新增标签'
                }
                // 新增标签
                // this.title = this.$t('mxpcweb.systemset.SY022.1550114298106')
            }
            this.dialogVisible = true
        },
        submit() {
            this.submitLoading = true
            if (this.item.labelId) {
                let data = {
                    moduleCode: this.moduleCode,
                    labelName: this.value,
                    useFlag: 1,
                    labelId: this.item.labelId,
                    color: this.color,
                    description: this.item.description,
                    labelEnName: this.value
                }
                this.$http.put(this.Global.baseURL + this.Global.api.v2.label_put, data).then((res) => {
                    this.submitLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.dialogVisible = false
                        this.$message.success(this.msg(res.body))
                        this.$emit('getListData')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.submitLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            } else {
                let data = {
                    moduleCode: this.moduleCode,
                    labelName: this.value,
                    labelEnName: this.value,
                    useFlag: 1,
                    description: '',
                    color: this.color
                }
                this.$http.post(this.Global.baseURL + this.Global.api.v2.label_add, data).then((res) => {
                    this.submitLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.dialogVisible = false
                        this.$message.success(this.msg(res.body))
                        this.$emit('getListData')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.submitLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.labelBox{
    height: 150px;
    padding-top: 20px;
    div{
        height: 50px;
        ul.mailSign {
            margin-top: 2px;
            >li {
                border: 1px solid #ddd;
                display: inline-block;
                width: 25px;
                height: 25px;
                line-height: 23px;
                text-align: center;
                border-radius: 50%;
                margin-right: 6px;
                position: relative;
                &::before {
                    content: "";
                    position: absolute;
                    left: -1px;
                    top: -1px;
                    right: -1px;
                    bottom: -1px;
                    border-style: solid;
                    border-width: 0;
                    border-radius: 50%;
                    -moz-transition: all 0.3s ease-out;
                    -webkit-transition: all 0.3s ease-out;
                    -ms-transition: all 0.3s ease-out;
                    -o-transition: all 0.3s ease-out;
                    transition: all 0.3s ease-out;
                }
                i.iconfont{
                    font-size: 19px;
                }
                &.active,
                &:hover {
                    border-color: transparent;
                    cursor: pointer;
                    &::before {
                        border-width: 1px;
                    }
                }
                &.active{
                    &::before {
                        border-width: 2px;
                    }
                }
            }
        }
    }
}
</style>
