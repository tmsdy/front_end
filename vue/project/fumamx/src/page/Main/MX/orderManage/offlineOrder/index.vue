<template>
    <div class="offlineOrder">
        <el-dialog v-dialogDrag title="新增线下订单" custom-class="width620" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
            <el-form class="orderForm MXscroll" :model="form" ref="form" :rules="formRules" label-position="left" label-width="102px">

                <el-form-item label="客户名称" prop="companyName">
                    <customer class="addCust" labelPosition="left" labelWidth="0px" size="medium" rightWidth="300px" ref="customer"  searchType="allList" @custChange="custChange"></customer>
                    <el-button @click="newAdd" type="text" v-if="!selectConfig.pkcode">新增客户</el-button>
                </el-form-item>
                <template>
                    <!-- 选了客户，且客户有开通企业 -->
                    <table class="showConfig" v-if="selectConfig.pkname && itemData.controlData.cId && itemData.controlData.cId != ''">
                        <tr>
                            <td colspan="4"><strong>当前配置</strong></td>
                        </tr>
                        <tr>
                            <td width="115">套餐名称：</td>
                            <td style="font-weight:bold">{{selectConfig.pkname}}</td>
                            <td width="90">到期时间：</td>
                            <td style="font-weight:bold">{{selectConfig.expirationtime.split(' ')[0]}}</td>
                        </tr>
                        <tr>
                            <td>用户许可人数：</td>
                            <td style="font-weight:bold">{{selectConfig.authcount}}人</td>
                            <td>云空间：</td>
                            <td style="font-weight:bold">{{selectConfig.spacecount}}G</td>
                        </tr>
                    </table>

                    <template v-if="itemData.controlData.cId && itemData.controlData.cId != '' && form.orderType == 'N'">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model.trim="form.phone.split(',')[0]" style="width:300px;" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="姓名" prop="userName">
                            <el-input v-model.trim="form.userName" style="width:300px;" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model.trim="form.userMail" style="width:300px;" auto-complete="off"></el-input>
                        </el-form-item>
                    </template>

                    <!-- 订单类型 -->
                    <el-form-item label="订单类型" style="">
                        <el-select v-model="form.orderType" placeholder="请选择订单类型" @change="orderChange" style="width:300px;">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 套餐名称 -->
                    <el-form-item :label="form.orderType == 'H' ? '升级套餐' : '套餐名称'" prop='productCode' v-if="form.orderType == 'N' || form.orderType == 'H'">
                        <el-select v-model="form.productCode" placeholder="请选择套餐" style="width:300px;">
                            <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.value == selectConfig.pkcode"> </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="form.orderType === 'R' ? '增加套餐期限' : '套餐期限'" prop="nums" v-if="form.orderType == 'N' || form.orderType == 'R'">
                        <el-input-number v-model="form.nums" :step="1" style="width:300px;" :min="1" :max="3000"></el-input-number>

                        <el-select v-model="form.rType" placeholder="请选择订单类型" style="width:66px;margin-left: 18px;">
                            <el-option v-for="item in rTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="changeTip" label="" prop="">
                        <div class="textTip" v-if="form.orderType == 'N'">到期时间：<span class="text-red">{{buyEndDate}}</span></div>
                        <div class="textTip" v-if="form.orderType == 'R'">续费后到期时间：<span class="text-red">{{ UpdateEndDate }}</span></div>
                    </el-form-item>

                    <!-- 许可人数 -->
                    <el-form-item :label="form.orderType === 'U' ? '增加许可人数' : '用户许可人数'" prop="authCount" v-if="form.orderType == 'N' || form.orderType == 'U'" style="clear:both">
                        <el-input-number v-model="form.authCount" :step="1" style="width:300px;" :min="0" :max="999"></el-input-number> <span style="margin-left:18px;">人</span>
                    </el-form-item>
                    <el-form-item class="changeTip" label="" prop="" v-if="form.orderType == 'U'">
                        <div class="textTip">
                            当前许可人数：<span class="text-red">{{selectConfig.authcount}}人</span>&nbsp;&nbsp;
                            续费后总许可人数：<span class="text-red">{{Number(selectConfig.authcount) + Number(form.authCount)}}人</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="增加云空间" prop="spacecount" v-if="form.orderType === 'U'">
                        <el-select v-model="form.spacecount" placeholder="请选择云空间" style="width:300px;">
                            <el-option label="0" value="0"> </el-option>
                            <el-option label="20" value="20"> </el-option>
                            <el-option label="40" value="40"> </el-option>
                            <el-option label="100" value="100"> </el-option>
                            <el-option label="200" value="200"> </el-option>
                            <el-option label="500" value="500"> </el-option>
                        </el-select>
                        <span style="margin-left:18px;">GB</span>
                    </el-form-item>
                    <el-form-item class="changeTip" label="" prop="" v-if="form.orderType == 'U'" style="clear:both">
                        <div class="textTip">
                            当前云空间：<span class="text-red">{{selectConfig.spacecount}}G</span>&nbsp;&nbsp;
                            续费后云空间：<span class="text-red">{{Number(selectConfig.spacecount) + Number(form.spacecount) + Number(form.authCount) * 20}}G</span>
                            <el-tooltip class="item" effect="dark" content="活动期间，每增加一用户，赠送20G" placement="top">
                                <span class="askAct text-hover"><i class="iconfont icon-sign"></i></span>
                            </el-tooltip>
                        </div>
                    </el-form-item>

                    <!-- 扩展应用 -->
                    <el-form-item label="扩展应用" prop="" v-if="form.orderType === 'E'" style="clear:both">
                        <el-checkbox-group v-model="checkListVal">
                            <el-checkbox v-for="(item, index) in checkListArr" :key="index" :label="item.appCode">{{item.appName}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="支付金额" prop="payamount" style="clear:both">
                        <el-input-number v-model="form.payamount" :step="1" style="width:300px;" :min="0" :max="999999"></el-input-number> <span style="margin-left:18px;">元</span>
                    </el-form-item>
                    <el-form-item label="流水号" prop="paytradeno">
                        <el-input v-model.trim="form.paytradeno" style="width:300px;" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" style="margin-bottom:10px" prop="remark">
                        <el-input v-model.trim="form.remark" style="width:300px;" type="textarea" :rows="2" placeholder="" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="付款凭证">
                        <span class="text-hover" @click="$refs.fileUpload.selectFile()"> <i class="iconfont icon-attachment" style="margin-right:5px; font-size:12px;"></i>添加附件</span>
                        <file-upload ref="fileUpload" :limitSize="10" :file-list="fileList" :multiple="false" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"></file-upload>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer text-center">
                <el-button @click="cancelDialog()" :loading="btnDisabled">取 消</el-button>
                <el-button type="primary" @click="createMXOfflineOrder" :loading="btnDisabled">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { isArray, checkPhone } from '@/libs/utils.js'
import Customer from '@/components/Customer/index.vue'
import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
    name: 'OfflineRecharge',
    props: [],
    data() {
        /**
         * 检查手机号
         * @param rule
         * @param value
         * @param callback
         */
        var checkPhones = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'))
            } else {
                if (!checkPhone(value)) {
                    callback(new Error('手机号无效'))
                } else {
                    callback()
                }
            }
        }
        /**
         * 不能为空
         * @param rule
         * @param value
         * @param callback
         */
        var checkIsNull = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('值不能为空'))
            } else {
                callback()
            }
        }
        /**
         * 检查邮箱
         * @param rule
         * @param value
         * @param callback
         */
        var checkMail = (rule, value, callback) => {
            if (value === '') {
                //  callback(new Error('请输入邮箱地址'))
                callback()
            } else {
                var reg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/
                if (!reg.test(value) || value.toLocaleLowerCase().indexOf('yahoo.com.cn') > -1 ||
                    value.toLocaleLowerCase().indexOf('yahoo.cn') > -1) {
                    callback(new Error('邮箱地址无效'))
                } else {
                    callback()
                }
            }
        }
        return {
            itemData: {
                cnFieldCaption: '',
                controlData: '',
                isNotNull: 0
            },
            selectConfig: {
                pkname: ''
            }, // 暂存一下所选的客户配置
            selectCID: null, // 所选的客户企业ID
            picValue: [],
            fileList: [],
            dialogFormVisible: false,
            btnDisabled: false, // 按钮不可用
            form: {
                phone: '', // 手机号
                companyName: '', // 公司名称
                userName: '', // 姓名
                userMail: '', // 邮箱
                productCode: 'PK0001', // 产品类型
                productName: '', // 产品名称
                orderType: 'N', // 类型code
                orderTypeName: '', // 类型名称
                authYear: 0, // 授权年限
                spacecount: 0, // 云空间
                authCount: 5, // 授权人数（默认5个用户）
                payamount: 0, // 支付金额
                paytradeno: '', // 银行流水号
                paymentVoucher: '',
                payway: 'offline',
                remark: '', // 备注

                nums: '12', // 续费数量
                rType: '3' // 续费时间单位：1：天；2：周；3：月
            },
            rTypeArr: [
                { value: '3', label: '月' },
                { value: '2', label: '周' },
                { value: '1', label: '天' }
            ], // 续费时间单位：1：天；2：周；3：月
            productOptions: [
                { value: 'PK0001', label: 'CRM' },
                { value: 'PK0002', label: '发现' },
                { value: 'PK0004', label: '发现Light' },
                { value: 'PK0003', label: '营销云' }
            ],
            cid: 0,
            formRules: {
                phone: [
                    { required: true, validator: checkPhones, trigger: 'blur' }
                ],
                companyName: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                userName: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                userMail: [
                    { required: true, validator: checkMail, trigger: 'blur' }
                ],
                productCode: [
                    { required: true, message: '请选择套餐', trigger: 'change' }
                ]
            },
            checkListVal: [],
            checkListArr: [] // 选项
        }
    },
    computed: {
        preImages() {
            return this.images.map(v => { return v.src })
        },
        typeOptions: function () {
            return [
                { value: 'N', label: '新购', disabled: !!this.selectConfig.pkcode }, // 已开通的，不可新购
                { value: 'R', label: '套餐续费', disabled: !this.selectConfig.pkcode },
                { value: 'H', label: '套餐升级', disabled: !this.selectConfig.pkcode },
                { value: 'U', label: '增加用户或空间', disabled: !this.selectConfig.pkcode }
                // { value: 'E', label: '应用拓展', disabled: !this.selectConfig.pkcode }
            ]
        },
        buyEndDate() {
            var myDate = new Date()
            let newDate = ''
            switch (this.form.rType) {
                case '3': // 月
                    newDate = this.DateAdd('m ', this.form.nums, myDate)
                    break
                case '2': // 周
                    newDate = this.DateAdd('w ', this.form.nums, myDate)
                    break
                case '1': // 天
                    newDate = this.DateAdd('d ', this.form.nums, myDate)
                    break
                default:
                // thisDays = 1
            }
            return newDate.toLocaleDateString()
        },
        UpdateEndDate() {
            var myDate = new Date(this.selectConfig.expirationtime.split(' ')[0])
            let newDate = ''
            switch (this.form.rType) {
                case '3': // 月
                    newDate = this.DateAdd('m ', this.form.nums, myDate)
                    break
                case '2': // 周
                    newDate = this.DateAdd('w ', this.form.nums, myDate)
                    break
                case '1': // 天
                    newDate = this.DateAdd('d ', this.form.nums, myDate)
                    break
                default:
                // thisDays = 1
            }
            return newDate.toLocaleDateString()
        }
    },
    methods: {
        custChange(x) {
            this.itemData.controlData = x
        },
        orderChange(val) {
            //  当为拓展应用时，选应用  接口名称: 获取某公司没有的应用列表
            if (val === 'E') {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.notHaveAppList, { params: { companyId: this.selectCID } }).then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                        // console.log(res.body.data)
                        this.checkListArr = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            } else if (val === 'H') {
                this.form.productCode = ''
            }
        },
        // 新增客户
        newAdd() {
            this.dialogFormVisible = false
            let obj = {
                optData: {
                    optCode: 'otNew',
                    optModuleCode: 'BF001',
                    optName: this.$t('mxpcweb.client.1529042727717') // 新增客户
                },
                next: () => {
                    this.$emit('tellFather') // update
                }
            }
            // console.log(obj)
            ep.emit('optClick', obj)
        },
        handleFileChange() {
            var _this = this
            var file = this.picValue
            let param = new FormData() // 创建form对象
            param.append('fileList', file, file.name)// 通过append向form对象添加数据
            _this.$http.post(this.Global.baseURL + this.Global.api.n1.uploadImage, param).then(response => {
                if (response.status == 200 && response.data != null && response.data.status == 'S') {
                    _this.form.paymentVoucher = response.data.resultString
                    console.log(_this.form.paymentVoucher)
                    _this.$message({ showClose: true, duration: 6000, message: '上传支付凭证成功', type: 'success' })
                } else if (response.status == 200 && response.data != null && response.data.message != null && response.data.message != '') {
                    _this.$message({ showClose: true, duration: 20000, message: response.data.message, type: 'error' })
                } else {
                    _this.$message({ showClose: true, duration: 10000, message: 'system exception', type: 'error' })
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        // 父组件来调用，显示离线汇款界面
        showDialog() {
            this.dialogFormVisible = true
        },
        doData() {
            var _this = this
            if (this.form.orderType == 'N' || this.form.orderType == 'H') {
                if (_this.form.productCode == '') {
                    _this.$message('请选择套餐')
                    return
                }
            }
            _this.btnDisabled = true
            let data = {
                phone: _this.form.phone.split(',')[0],
                useremail: _this.form.userMail,
                custname: _this.itemData.controlData.custName, // 客户名称

                custid: _this.itemData.controlData.custId, // 客户ID
                companyid: this.selectCID || -1, // cid 判断是否已经开通了企业
                companyname: _this.form.companyName,
                ordertype: _this.form.orderType,

                productcode: _this.selectConfig.pkcode,

                payway: _this.form.payway,
                rType: _this.form.rType,
                nums: _this.form.nums,
                spacecount: _this.form.spacecount,

                authcount: _this.form.authCount,
                payamount: _this.form.payamount,
                paymentvoucher: _this.form.paymentVoucher,
                paytradeno: _this.form.paytradeno,
                username: _this.form.userName,
                remark: _this.form.remark
            }

            if (this.form.orderType == 'E') {
                data.productcode = this.checkListVal.join(',') // 当为拓展应用时，特殊处理
            } else if (_this.form.orderType == 'N' || this.form.orderType == 'H') {
                data.productcode = _this.form.productCode // 传输入的
            }

            _this.$http.post(this.Global.baseURL + this.Global.api.v2.createOrder, data).then(res => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.cancelDialog()
                    _this.$emit('refreshList')
                    _this.$message.success('订单创建成功！')
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
                _this.btnDisabled = false
            }).catch(err => {
                _this.$message.error(err)
                _this.btnDisabled = false
            })
        },
        // 确定线下充值
        createMXOfflineOrder() {
            console.log('++', this.form.companyName)
            if (this.fileList != null && this.fileList.length > 0) {
                this.form.paymentVoucher = this.fileList[0].url
            }

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$confirm('支付金额为 ' + this.form.payamount + ' ，确定提交吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doData()
                    }).catch(() => { })
                }
            })
        },
        // 关闭页面
        cancelDialog() {
            this.fileList = []
            this.selectConfig = { pkname: '' }
            this.selectCID = null
            this.itemData = {
                cnFieldCaption: '',
                controlData: {},
                isNotNull: 0
            }
            if (this.$refs.customer) {
                this.$refs.customer.clearData() // 清所选客户
            }
            this.form = {
                phone: '', // 手机号
                companyName: '', // 公司名称
                userName: '', // 姓名
                userMail: '', // 邮箱
                productCode: 'PK0001', // 产品类型
                productName: '', // 产品名称
                orderType: 'N', // 类型code
                orderTypeName: '', // 类型名称
                authYear: 0, // 授权年限
                spacecount: 0, // 云空间
                authCount: 0, // 授权人数
                payamount: 100, // 支付金额
                paytradeno: '', // 银行流水号
                paymentVoucher: '',
                payway: 'offline',
                remark: '', // 备注

                nums: '12', // 续费数量
                rType: '3' // 续费时间单位：1：天；2：周；3：月
            }
            this.dialogFormVisible = false
        },
        // 查已购买的订单详情
        getConfig() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.getAuthInfo, { params: { cid: this.selectCID } }).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    if (res.body.data && res.body.data.pkcode != '') {
                        this.selectConfig = res.body.data
                        this.form.orderType = 'R' // 已开通的，改为续约
                    } else {
                        this.form.orderType = 'N' // 新购
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        /**
         * var now = new Date();
        // 加五天.
        var newDate = DateAdd("d ", 5, now);
        alert(newDate.toLocaleDateString())
        // 加两个月.
        newDate = DateAdd("m ", 2, now);
        alert(newDate.toLocaleDateString())
         */
        DateAdd(interval, number, date) {
            switch (interval) {
                case 'y ': {
                    date.setFullYear(date.getFullYear() + number)
                    return date
                    break
                }
                case 'q ': {
                    date.setMonth(date.getMonth() + number * 3)
                    return date
                    break
                }
                case 'w ': {
                    date.setDate(date.getDate() + number * 7)
                    return date
                    break
                }
                case 'd ': {
                    date.setDate(date.getDate() + number)
                    return date
                    break
                }
                case 'h ': {
                    date.setHours(date.getHours() + number)
                    return date
                    break
                }
                case 'minu ': {
                    date.setMinutes(date.getMinutes() + number)
                    return date
                    break
                }
                case 'm ': {
                    date.setMonth(date.getMonth() + number)
                    return date
                    break
                }
                case 's ': {
                    date.setSeconds(date.getSeconds() + number)
                    return date
                    break
                }
                default: {
                    date.setDate(d.getDate() + number)
                    return date
                    break
                }
            }
        },
        // 清理成新购状态
        toNewBuy() {
            // this.form.companyName = ''
            this.selectConfig = []
            this.form.orderType = 'N' // 新购
        }
    },
    watch: {
        itemData: {
            handler(newValue, oldValue) {
                // console.log(' --------------- 所选客户 ')
                // 所选客户企业ID，暂存下来
                this.selectCID = newValue.controlData.affCompanyId || null
                // console.log(newValue)
                // console.log('客户对应企业id - ' + this.selectCID)
                // 判断是否已经开通了企业
                if (this.selectCID) {
                    this.getConfig() // 去查许可配置
                } else {
                    this.toNewBuy() // 清理成新购状态
                }

                // 手机号和邮箱自动带出来
                if (newValue && newValue.controlData && newValue.controlData.custName && newValue.controlData.custName != '') {
                    this.form.companyName = newValue.controlData.custName
                    if (isArray(newValue.controlData.custContacts) && newValue.controlData.custContacts.length > 0) {
                        var custContact = newValue.controlData.custContacts[0]
                        // 手机号
                        if (custContact.mobile != undefined && custContact.mobile != null) {
                            this.form.phone = custContact.mobile
                        } else {
                            this.form.phone = ''
                        }
                        // 邮箱
                        if (isArray(custContact.mailAddress) && custContact.mailAddress.length > 0) {
                            this.form.userMail = custContact.mailAddress[0]
                        } else {
                            this.form.userMail = ''
                        }
                        // 姓名
                        if (custContact.contName != undefined && custContact.contName != null && custContact.contName != '') {
                            this.form.userName = custContact.contName
                        } else {
                            this.form.userName = ''
                        }
                    } else {
                        this.form.phone = ''
                        this.form.userMail = ''
                    }
                }
            },
            deep: true
        }
    },
    components: {
        'file-upload': FileUpload,
        'customer': Customer
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.offlineOrder {
    .orderForm {
        margin-top: -10px;
        //  border:1px solid red;
        padding-left: 45px;
        margin-bottom: -20px;
        max-height: 630px;
        overflow-y: auto;
        .askAct {
            display: inline-block;
            width: 15px;
            height: 15px;
            line-height: 15px;
            text-align: center;
            margin-left: 5px;
            border: 1px solid #d0021b;
            border-radius: 50%;
            color: #d0021b;
            i {
                font-size: 12px;
            }
        }
        .changeTip {
            margin-top: -20px;
            margin-bottom: -2px;
            .textTip {
                padding-left: 10px;
                font-size: 12px;
                color: #909399;
            }
        }
        .addCust {
            //  border:1px solid blue;
            display: inline-block;
            width: 320px;
        }
        .showConfig {
            width: 490px;
            background: #f2f2f2;
            margin-bottom: 15px;
            td {
                padding: 3px 8px;
            }
        }
    }
}
</style>
