<template>
    <div class="mainWrap AutographManage">

        <!--大标题-签名管理-->
        <page-title :title="$t('mxpcweb.systemset.mailset.autographmanage.1528974808443')" iconfont="icon-mail"></page-title>
        <div class="mainBody MXscroll" style="padding:15px 0;">
            <!-- 新建签名 -->
            <el-button type="primary" style="margin-bottom: 10px;" @click="showDialog($t('mxpcweb.systemset.mailset.autographmanage.1528974861628'));" size="small">{{$t('mxpcweb.systemset.mailset.autographmanage.1528974861628')}}</el-button>

            <!--表格-->
            <el-table :data="signAdminList" class="columnClass">
                <!-- 签名名称 -->
                <el-table-column prop="signName" :label="$t('mxpcweb.systemset.mailset.autographmanage.1528974919603')" width="200"></el-table-column>
                <!-- <el-table-column prop="suitName" label="适用于" width="200"> </el-table-column> -->
                <!-- 创建人 -->
                <el-table-column prop="createName" :label="$t('mxpcweb.systemset.mailset.autographmanage.1528974955371')" width="200"> </el-table-column>
                <!-- 默认设定 -->
                <el-table-column prop="defaultName" :label="$t('mxpcweb.systemset.mailset.autographmanage.1528974992469')" width="200"> </el-table-column>
                <!-- 操作 -->
                <!-- <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.autographmanage.1528975011963')">
                  <template scope="scope"> -->
                <!-- 编辑 -->
                <!-- <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">{{$t('mxpcweb.systemset.mailset.autographmanage.1528975040916')}}</el-button> -->
                <!-- 删除 -->
                <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('mxpcweb.systemset.mailset.autographmanage.1528975081643')}}</el-button> -->
                <!-- </template>
              </el-table-column> -->
                <!-- 操作 -->
                <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.autographmanage.1528975011963')">
                    <template slot-scope="scope">
                        <div style="float:left">
                            <!-- 删除 -->
                            <div class="pull-right">
                                <i class="iconfont icon-del" @click="handleDelete(scope.$index, scope.row)">
                                </i>
                            </div>
                            <div class="pull-right">
                                <i class="iconfont icon-edit-square" @click="handleEdit(scope.$index, scope.row)">
                                </i>
                            </div>
                        </div>

                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination class="marginTop15" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" :total="page.totalSize" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

        <!-- 弹窗，公海设置 -->
        <el-dialog :title="signAdminForm.title" :visible.sync="signAdminForm.popup" @close="resetForm('')" custom-class="width1020" top="5%">
            <el-form :model="signAdminForm" :rules="slignAdminFormRules" ref="signAdminForm" label-width="80px" label-position="left">
                <!-- 签名名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.autographmanage.1528974919603')" prop="name">
                    <!-- 请输入签名名称 -->
                    <el-input v-model="signAdminForm.name" size="small" :placeholder="$t('mxpcweb.systemset.mailset.autographmanage.1528975126947')" style="width:300px;"></el-input>
                    <!-- 作为默认签名 -->
                    <el-checkbox v-model="isDefault" style="margin-left:15px;">{{$t('mxpcweb.systemset.mailset.autographmanage.1528975146586')}}</el-checkbox>
                </el-form-item>
                <!-- <el-form-item label="适用于" prop="suit">
                    <el-select v-model="signAdminForm.suit" size="small" placeholder="请选择" style="width:300px;">
                        <el-option label="本人的所有邮箱账号" value="1"></el-option>
                        <el-option label="全部人员的所有邮箱账号" value="0"></el-option>
                        <el-option   v-for="(item,index) in mailInfoList" :key="index"
                                 :label='item.mailAddress' :value='item.mailAddress'> </el-option>
                    </el-select>

                </el-form-item> -->
                <ueditor :config="config" @ready="editorReady" :converContent="signAdminForm.content" ref="ueditor" height="200"></ueditor>
            </el-form>
            <div slot="footer" class="dialog-footer text-center">
                <!-- 取 消 -->
                <el-button @click="resetForm('')">{{$t('mxpcweb.systemset.mailset.autographmanage.1528975180604')}}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="signSubmit('signAdminForm')">{{$t('mxpcweb.systemset.mailset.autographmanage.1528975210508')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index'
import UEditor from '@/components/UEditor/component.vue' // 编辑器
import { isArray, isObject } from '@/libs/utils.js'

export default {
    name: 'AutographManage',
    props: {},
    data() {
        var _this = this
        return {
            isDefault: true,
            page: {
                currentPageIndex: 1,
                pageSize: 10,
                totalSize: 0
            },
            queryPara: {
                ctid: '',
                keywords: '',
                type: 'my'
            },
            // 列表
            signAdminList: [],
            // 弹窗
            signAdminForm: {
                title: '',
                popup: false, // 弹窗开关
                name: '', // 规则名称
                // suit: "1",
                signId: 0,
                content: '',
                mailAddress: '',
                defaultSign: 1
            },
            // 表单验证
            slignAdminFormRules: {
                name: [{ required: true, message: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975126947'), trigger: 'blur' }]
                // apply: [
                //   { required: true, message: "请选择适用于什么", trigger: "blur" }
                // ]
            },
            // 编辑器配置
            config: {
                // "请输入签名内容"
                initialContent: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975269259'), // 初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                initialFrameHeight: 260, // 内容初始高度
                zIndex: 99999, // 编辑器层级的基数,默认是900（一般不要开启）
                toolbars: [[
                    'source', '|', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
                    'simpleupload',
                    'horizontal', 'emotion', 'removeformat', 'formatmatch', 'autotypeset', '|',
                    'inserttable'
                ]]
            },
            mailInfoList: []
        }
    },
    created() {
        let _this = this
        _this.loadSignList() // 加载签名列表
        // _this.loadMailAccountList(); //加载账户信息
    },
    mounted() { },
    watch: {
        /**
         * 监听默认签名
         */
        isDefault(curVal, oldVal) {
            if (curVal) {
                this.signAdminForm.defaultSign = 1
            } else {
                this.signAdminForm.defaultSign = 0
            }
        }
    },
    methods: {
        // 编辑器加载完成时
        editorReady(instance) {
            instance.setContent(this.signAdminForm.content)// 设置初始值放进来，不设置则为 config 里的 initialContent 值
        },
        /**
         * 加载列表
         */
        loadSignList() {
            let _this = this
            _this.signAdminList = []
            _this.$http
                .get(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.sign.getMailsSignature,
                    { params: { type: _this.queryPara.type, pageN: _this.page.currentPageIndex, pageSize: _this.page.pageSize } }
                )
                .then(
                    function (res) {
                        if (
                            res.body.code.toString() == _this.Global.RES_OK &&
                            isArray(res.body.data.signInfos) &&
                            res.body.data.signInfos.length > 0
                        ) {
                            let data = res.body.data.signInfos
                            console.log(data)
                            _this.signAdminList = data
                            _this.page.totalSize = res.body.data.total
                            _this.signAdminList.forEach(element => {
                                // 默认
                                if (element.defaultSign == 1) {
                                    // 默认签名
                                    element.defaultName = _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975312545')
                                }
                            })
                        } else if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.signAdminList = []
                            _this.page.totalSize = 0
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        /**
         * 加载所有邮箱账户列表
         */
        loadMailAccountList() {
            let _this = this
            _this.mailInfoList = []
            _this.defaultMailList = []
            _this.$http
                .get(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.mailaccount.accounts,
                    { params: { type: 'all' } }
                )
                .then(
                    function (res) {
                        if (
                            res.body.code.toString() == _this.Global.RES_OK &&
                            isObject(res.body.data) &&
                            isArray(res.body.data.mailAccountsInfo)
                        ) {
                            _this.mailInfoList = res.body.data.mailAccountsInfo
                        } else if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.mailInfoList = []
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        /**
         * 保存新签名
         */
        saveNewSign() {
            const _this = this
            let data = {
                signName: _this.signAdminForm.name,
                //  suitableRange: _this.signAdminForm.suit,
                mailAddress: _this.signAdminForm.mailAddress,
                content: { 'htmlContent': _this.signAdminForm.content },
                defaultSign: _this.signAdminForm.defaultSign
            }
            console.log(data)
            _this.$http
                .post(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.sign.mailsSignaturePost,
                    data
                )
                .then(
                    function (res) {
                        console.log(res)
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            // 新增签名成功
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.autographmanage.1528975399912'))
                            _this.signAdminForm.popup = false
                            _this.resetForm('signAdminForm')
                            _this.loadSignList() // 加载签名列表
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        /**
         * 修改新签名
         */
        saveModifySign() {
            const _this = this
            let data = {
                signName: _this.signAdminForm.name,
                // suitableRange: _this.signAdminForm.suit,
                mailAddress: _this.signAdminForm.mailAddress,
                content: { 'htmlContent': _this.signAdminForm.content },
                defaultSign: _this.signAdminForm.defaultSign,
                signId: _this.signAdminForm.signId
            }
            _this.$http
                .post(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.sign.mailsSignaturePut,
                    data
                )
                .then(
                    function (res) {
                        console.log(res)
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            // 修改签名成功
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.autographmanage.1528975449632'))
                            _this.signAdminForm.popup = false
                            _this.resetForm('signAdminForm')
                            _this.loadSignList() // 加载签名列表
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        // 签名添加提交
        signSubmit(formName) {
            const _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    _this.signAdminForm.content = _this.$refs.ueditor.getContent()
                    //  if (_this.signAdminForm.suit == 0 || _this.signAdminForm.suit == 1) {
                    //   _this.signAdminForm.mailAddress = "";
                    // } else {
                    //   _this.signAdminForm.mailAddress = _this.signAdminForm.suit;
                    //   _this.signAdminForm.suit = "1";
                    // }
                    if (_this.signAdminForm.signId > 0) {
                        _this.saveModifySign()
                    } else {
                        _this.saveNewSign()
                    }
                    _this.resetForm('')
                } else {
                    return false
                }
            })
        },
        /**
         * 显示弹框
         */
        showDialog(title) {
            this.signAdminForm.title = title
            this.signAdminForm.popup = true
        },
        // 操作编辑
        handleEdit(index, row) {
            let _this = this
            // 编辑签名
            this.showDialog(_this.$t('mxpcweb.systemset.mailset.autographmanage.1528975517912'))
            this.signAdminForm.name = row.signName
            //  if(row.suitableRange == 1){
            //    if( row.mailAddress != ''){
            //       this.signAdminForm.suit = row.mailAddress;
            //    }else{
            //       this.signAdminForm.suit = row.suitableRange.toString();
            //    }
            // }else{
            //      this.signAdminForm.suit = row.suitableRange.toString();
            // }
            this.signAdminForm.signId = row.signId
            this.signAdminForm.defaultSign = row.defaultSign
            this.isDefault = row.defaultSign == 1

            // 获取签名
            _this.$http
                .get(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.sign.getMailsSignature,
                    { params: { type: 'detail', signId: _this.signAdminForm.signId } }
                )
                .then(
                    function (res) {
                        if (
                            res.body.code.toString() == _this.Global.RES_OK &&
                            isObject(res.body.data)
                        ) {
                            let data = res.body.data
                            _this.signAdminForm.content = data.content
                        } else if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.signAdminForm.content = ''
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        // 操作删除
        handleDelete(index, row) {
            let _this = this
            //  此操作将永久删除, 是否继续？ 提示
            this.$confirm(_this.$t('mxpcweb.systemset.mailset.autographmanage.1528975570046'), _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975603382'), {
                // 确定
                confirmButtonText: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975623030'),
                // 取消
                cancelButtonText: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975668486'),
                type: 'warning'
            })
                .then(() => {
                    let data = {
                        signId: row.signId
                    }
                    _this.$http
                        .post(
                            _this.Global.baseURL +
                            _this.Global.api.SystemSet.mailset.sign.mailsSignatureDelete,
                            data
                        )
                        .then(
                            function (res) {
                                if (res.body.code.toString() == _this.Global.RES_OK) {
                                    _this.loadSignList() // 加载签名列表
                                    //  删除签名成功
                                    _this.$message.success(_this.$t('mxpcweb.systemset.mailset.autographmanage.1528975686885'))
                                } else {
                                    _this.$message.error(_this.msg(res.body))
                                }
                            },
                            function (res) {
                                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                            }
                        )
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        // 已取消删除
                        message: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975728493')
                    })
                })
            // console.log(index, row);
        },
        handleSizeChange(val) {
            this.page.pageSize = val
            this.loadSignList()
        },
        handleCurrentChange(val) {
            this.page.currentPageIndex = val
            this.loadSignList()
        }, // 清空表单
        resetForm(formName) {
            // this.$refs[formName].resetFields();
            // 手动清空
            this.signAdminForm.name = ''
            // this.signAdminForm.suit = "1";
            this.isDefault = true
            this.signAdminForm.signId = 0
            this.signAdminForm.content = ''
            this.signAdminForm.popup = false
            this.$refs.ueditor.clearContent()
        }
    },
    components: {
        'page-title': PageTitle,
        ueditor: UEditor
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
