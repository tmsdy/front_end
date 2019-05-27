<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" size="tiny" v-dialogDrag custom-class="width620" :before-close="handleClose">
        <el-radio-group v-model="radio">
            <el-table :data="SignatureArray" v-if="actiontype==1">
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row.signId"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column property="signName" label="签名名称" width="250"></el-table-column>
                <el-table-column label="创建人" width="250">
                    <template slot-scope="scope">
                        {{contactList[scope.row.createCtid]}}

                    </template>
                </el-table-column>
            </el-table>
        </el-radio-group>
        <el-radio-group v-model="radio2">
            <el-table :data="FastTextArray" v-if="actiontype==2">
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row.id"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column property="textName" label="文本名称" width="250"></el-table-column>
                <el-table-column label="创建人" width="250">
                    <template slot-scope="scope">
                        {{contactList[scope.row.createCtid]}}

                    </template>
                </el-table-column>
            </el-table>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="clickThis()">选取</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { isObject } from '@/libs/utils.js'
export default {
    name: 'dialogText',
    props: {
        SignatureArray: {
            type: Array,
            default: function () {
                return []
            }
        },
        FastTextArray: {
            type: Array,
            default: function () {
                return []
            }
        }

    },
    data() {
        return {
            title: '选择签名',
            dialogVisible: false,
            instance: null,
            actiontype: 1,
            radio: '',
            radio2: ''

        }
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    created() { },
    methods: {
        clickThis() {
            this.instance.focus()
            if (this.actiontype == 1) {
                this.getSignature(this.radio)
            } else {
                this.getSingleFastText(this.radio2)
            }
        },
        handleClose() {
            this.dialogVisible = false
        },
        isOpen(instance, type) {
            this.title = type == 1 ? '请选择签名' : '请选择文本'
            this.instance = instance
            this.actiontype = type
            this.dialogVisible = true
        },
        getSingleFastText(id) {
            const _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.fastText.getFastTextList, { params: { fastTextId: id } }).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        let data = res.body.data
                        this.instance.execCommand('inserthtml', data.content)
                        this.dialogVisible = false
                    }
                    this.dialogVisible = false
                },
                function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                }
            )
        },
        getSignature(signId) {
            const _this = this
            // 获取签名
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.sign.getMailsSignature, { params: { type: 'detail', signId: signId } }).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        let data = res.body.data
                        this.instance.execCommand('inserthtml', data.content)
                        this.dialogVisible = false
                    }
                    this.dialogVisible = false
                },
                function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                }
            )
        }
    }
}
</script>
