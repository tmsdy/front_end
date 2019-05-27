<template>
    <div class='InvoiceSet'>
        <div class=''>
            <el-row :gutter='30' style='margin:0 1px;'>
                <el-col :span='8' v-for='(item, index) in invoiceList' :key='index' :value='item'>
                    <ul>
                        <div class='btns'>
                            <!-- 编辑 -->
                            <el-button type='text' @click='editInvoince(item.id)'>{{$t('mxpcweb.am.1531893071733')}}</el-button>
                            <!-- 删除 -->
                            <el-button type='text' @click='invoinceDelete(item.id)' class='text-red'>{{$t('mxpcweb.am.1531893085173')}}</el-button>
                        </div>
                        <li>
                            <span class='pull-right'>
                                <!-- 默认 -->
                                <el-button v-if="item.isdefault=='Y'" type='primary' size='small'>{{$t('mxpcweb.am.1533202380303')}}</el-button>
                                <!-- 设为默认 -->
                                <el-button @click='setDefault(item.id,item.isdefault)' v-else size='small'>{{$t('mxpcweb.am.1533202410771')}}</el-button>
                            </span>
                            <span class='name'>{{item.invoicetitle}}</span>
                        </li>
                        <!-- 增值税普通发票 -->
                        <li v-if="item.invoicetype=='vat-ti'">{{$t('mxpcweb.am.1533202447660')}}</li>
                        <!-- 增值税专用发票 -->
                        <li v-if="item.invoicetype=='vat-si'">{{$t('mxpcweb.am.1533202486424')}}</li>
                    </ul>
                </el-col>
                <el-col :span='8'>
                    <ul>
                        <div class='addInvoice'>
                            <el-button type='text' @click='isOpenAdd=true'>
                                <i class='iconfont el-icon-plus'></i>
                                <!-- 新增发票信息 -->
                                {{$t('mxpcweb.am.1533202869026')}}
                            </el-button>
                        </div>
                    </ul>
                </el-col>
            </el-row>
        </div>
        <!-- 新增发票 -->
        <el-dialog :title="$t('mxpcweb.am.1533202869026')" :visible.sync='isOpenAdd' :closeOnClickModal="false">
            <el-form :model='addForm' ref='addForm' label-width='125px' :rules="formRules">
                <!-- 开具类型 -->
                <el-form-item :label="$t('mxpcweb.am.1533203072423')" prop='invoicefor'>
                    <el-radio-group @change='selectinvoicefor()' v-model='addForm.invoicefor'>
                        <!-- 企业 -->
                        <el-radio label="E">{{$t('const.1528942807794')}}</el-radio>
                        <!-- 个人 -->
                        <el-radio label="P">{{$t('mxpcweb.systemset.mailset.mailaccount.1529040021925')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 发票抬头 -->
                <el-form-item :label="$t('mxpcweb.am.1533030904081')" prop='invoicetitle' class='is-required'>
                    <el-input :maxlength=200 style="width:400px" v-model='addForm.invoicetitle'></el-input>
                </el-form-item>
                <!-- 发票类型 -->
                <el-form-item :label="$t('mxpcweb.am.1533203251765')" prop='invoicetype'>
                    <el-radio-group v-model='addForm.invoicetype'>
                        <!-- 增值税普通发票 -->
                        <el-radio label="vat-ti">{{$t('mxpcweb.am.1533202447660')}}</el-radio>
                        <!-- 增值税专用发票 -->
                        <el-radio v-if="addForm.invoicefor=='E'" label="vat-si">{{$t('mxpcweb.am.1533202486424')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 身份证号 -->
                <el-form-item v-if="addForm.invoicefor=='P'" :label="$t('mxpcweb.am.1533203339181')" prop='idcard'>
                    <!-- 如果您无个人税号，请填写身份证号 -->
                    <el-input :maxlength=30 v-model='addForm.idcard' style="width:400px" :placeholder="$t('mxpcweb.am.1533203355830')"></el-input>
                </el-form-item>
                <!-- 税务登记证号 -->
                <el-form-item v-if="addForm.invoicefor=='E'" :label="$t('mxpcweb.am.1533203464140')" prop='taxregistcertificatenum' class='is-required'>
                    <el-input :maxlength=50 v-model='addForm.taxregistcertificatenum' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- <el-form-item v-if="addForm.invoicefor=='E'  && addForm.invoicetype=='vat-ti'" label='税务登记证号' prop='taxregistcertificatenum' class='is-required' >
                    <el-input :maxlength=50 v-model='addForm.taxregistcertificatenum' style="width:400px" placeholder=''></el-input>
                </el-form-item> -->
                <!-- 请与贵公司财务人员核实并填写准确的税务登记证号，以免影响您发票后续的使用 -->
                <div v-if="addForm.invoicefor=='E' " class='input_notice'>{{$t('mxpcweb.am.1533203500848')}}</div>
                <!-- <div v-if="addForm.invoicefor=='E' && addForm.invoicetype=='vat-si'" class='input_notice'>请与贵公司财务人员核实并填写准确的税务登记证号，以免影响您发票后续的使用</div> -->
                <!-- 开户银行名称 -->
                <el-form-item v-if="addForm.invoicefor=='E' && addForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203637929')" prop='bankname' class='is-required'>
                    <el-input :maxlength=50 v-model='addForm.bankname' placeholder='' style="width:400px"></el-input>
                </el-form-item>
                <!-- 基本开户账号 -->
                <el-form-item v-if="addForm.invoicefor=='E' && addForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203671026')" prop='bankno' class='is-required'>
                    <el-input :maxlength=50 v-model='addForm.bankno' placeholder='' style="width:400px"></el-input>
                </el-form-item>
                <!-- 注册场所地址 -->
                <el-form-item v-if="addForm.invoicefor=='E' && addForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203694976')" prop='registrationsiteaddress' class='is-required'>
                    <el-input :maxlength=200 v-model='addForm.registrationsiteaddress' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 注册固定电话 -->
                <el-form-item v-if="addForm.invoicefor=='E' && addForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203717045')" prop='registraiontel' class='is-required'>
                    <el-input :maxlength=20 v-model='addForm.registraiontel' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 收件人姓名 -->
                <el-form-item :label="$t('mxpcweb.am.1533203739061')" prop='recipientsname' class='is-required'>
                    <el-input :maxlength=50 v-model='addForm.recipientsname' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 地区 -->
                <el-form-item :label="$t('mxpcweb.am.1533203754575')" class='is-required'>
                    <region labelPosition="left" labelWidth="0px" rightWidth="300px" rightWidth1="148px" ref="control" :itemData="item"></region>
                </el-form-item>
                <!-- 街道地址 -->
                <el-form-item :label="$t('mxpcweb.systemset.enterpriseset.1530587357627')" prop='streetaddress' class='is-required'>
                    <el-input :maxlength=200 v-model='addForm.streetaddress' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 邮政编码 -->
                <el-form-item :label="$t('mxpcweb.am.1533203809662')" prop='zipcode' class='is-required'>
                    <el-input :maxlength=50 v-model='addForm.zipcode' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 手机号 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530582805894')" prop='phone' class='is-required'>
                    <el-input :maxlength=20 v-model='addForm.phone' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <el-form-item label='' prop='isdefault'>
                    <el-checkbox-group v-model='addForm.isdefault'>
                        <!-- 设为默认 -->
                        <el-checkbox :label="$t('mxpcweb.am.1533202410771')" name='type'></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div class='text-center'>
                    <!-- 确定 -->
                    <el-button type='primary' @click='okSummit'>{{$t('mxpcweb.am.1531893129621')}}</el-button>
                    <!-- 取消 -->
                    <el-button @click="closeAddForm('addForm')">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 编辑发票信息 -->
        <el-dialog :title="$t('mxpcweb.am.1533261665186')" :visible.sync='isOpenEdit' :closeOnClickModal="false">
            <el-form :model='editForm' ref='editForm' label-width='125px' :rules="formRules">
                <!-- 开具类型 -->
                <el-form-item :label="$t('mxpcweb.am.1533203072423')" prop='invoicefor'>
                    <!-- 企业 -->
                    <span v-if="editForm.invoicefor=='E'">{{$t('const.1528942807794')}}</span>
                    <!-- 个人 -->
                    <span v-if="editForm.invoicefor=='P'">{{$t('mxpcweb.systemset.mailset.mailaccount.1529040021925')}}</span>
                </el-form-item>
                <!-- 发票抬头 -->
                <el-form-item :label="$t('mxpcweb.am.1533030904081')" prop='invoicetitle' class='is-required'>
                    <el-input :maxlength='200' v-model='editForm.invoicetitle' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 发票类型 -->
                <el-form-item :label="$t('mxpcweb.am.1533203251765')" prop='invoicetype'>
                    <!-- 增值税普通发票 -->
                    <span v-if="editForm.invoicetype=='vat-ti'">{{$t('mxpcweb.am.1533202447660')}}</span>
                    <!-- 增值税专用发票 -->
                    <span v-if="editForm.invoicetype=='vat-si'">{{$t('mxpcweb.am.1533202486424')}}</span>
                </el-form-item>
                <!-- 身份证号 -->
                <el-form-item v-if="editForm.invoicefor=='P'" :label="$t('mxpcweb.am.1533203339181')" prop='idcard'>
                    <!-- 如果您无个人税号，请填写身份证号 -->
                    <el-input :maxlength='30' v-model='editForm.idcard' style="width:400px" :placeholder="$t('mxpcweb.am.1533203355830')"></el-input>
                </el-form-item>
                <!-- 税务登记证号 -->
                <el-form-item v-if="editForm.invoicefor=='E'" :label="$t('mxpcweb.am.1533203464140')" prop='taxregistcertificatenum' class='is-required'>
                    <el-input :maxlength='50' v-model='editForm.taxregistcertificatenum' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- <el-form-item v-if="editForm.invoicefor=='E'  && editForm.invoicetype=='vat-si'" label='税务登记证号' prop='taxregistcertificatenum' class='is-required'>
                    <el-input :maxlength='50' v-model='editForm.taxregistcertificatenum' style="width:400px" placeholder=''></el-input>
                </el-form-item> -->
                <!-- 请与贵公司财务人员核实并填写准确的税务登记证号，以免影响您发票后续的使用 -->
                <div v-if="editForm.invoicefor=='E' " class='input_notice'>{{$t('mxpcweb.am.1533203500848')}}</div>
                <!-- <div v-if="editForm.invoicefor=='E' && editForm.invoicetype=='vat-si'" class='input_notice'>请与贵公司财务人员核实并填写准确的税务登记证号，以免影响您发票后续的使用</div> -->
                <!-- 开户银行名称 -->
                <el-form-item v-if="editForm.invoicefor=='E' && editForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203637929')" prop='bankname' class='is-required'>
                    <el-input :maxlength='100' v-model='editForm.bankname' placeholder='' style="width:400px"></el-input>
                </el-form-item>
                <!-- 基本开户账号 -->
                <el-form-item v-if="editForm.invoicefor=='E' && editForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203671026')" prop='bankno' class='is-required'>
                    <el-input :maxlength='50' v-model='editForm.bankno' placeholder='' style="width:400px"></el-input>
                </el-form-item>
                <!-- 注册场所地址 -->
                <el-form-item v-if="editForm.invoicefor=='E' && editForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203694976')" prop='registrationsiteaddress' class='is-required'>
                    <el-input :maxlength='200' v-model='editForm.registrationsiteaddress' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 注册固定电话 -->
                <el-form-item v-if="editForm.invoicefor=='E' && editForm.invoicetype=='vat-si'" :label="$t('mxpcweb.am.1533203717045')" prop='registraiontel' class='is-required'>
                    <el-input :maxlength='20' v-model='editForm.registraiontel' placeholder='' style="width:400px"></el-input>
                </el-form-item>
                <!-- 收件人姓名 -->
                <el-form-item :label="$t('mxpcweb.am.1533203739061')" prop='recipientsname' class='is-required'>
                    <el-input :maxlength='50' v-model='editForm.recipientsname' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 地区 -->
                <el-form-item :label="$t('mxpcweb.am.1533203754575')" prop='recipientsname' class='is-required'>
                    <region labelPosition="left" labelWidth="0px" rightWidth="300px" rightWidth1="148px" ref="controlEdit" :itemData="itemForEdit"></region>
                </el-form-item>
                <!-- 街道地址 -->
                <el-form-item :label="$t('mxpcweb.systemset.enterpriseset.1530587357627')" prop='streetaddress' class='is-required'>
                    <el-input :maxlength='200' v-model='editForm.streetaddress' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 邮政编码 -->
                <el-form-item :label="$t('mxpcweb.am.1533203809662')" prop='zipcode' class='is-required'>
                    <el-input :maxlength='50' v-model='editForm.zipcode' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <!-- 手机号 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530582805894')" prop='phone' class='is-required'>
                    <el-input :maxlength='20' v-model='editForm.phone' style="width:400px" placeholder=''></el-input>
                </el-form-item>
                <el-form-item label='' prop='isDefaultSelect'>
                    <!-- 设为默认 -->
                    <el-checkbox v-model='isDefaultSelect'>{{$t('mxpcweb.am.1533202410771')}}</el-checkbox>
                </el-form-item>
                <div class='text-center'>
                    <!-- 确定 -->
                    <el-button type='primary' @click='editSummit()'>{{$t('mxpcweb.am.1531893129621')}}</el-button>
                    <!-- 取消 -->
                    <el-button @click="closeModifyForm('editForm')">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import Region from '@/components/GroupControls/Region/index'
import { isArray } from '@/libs/utils.js'
export default {
    name: 'InvoiceSet',
    props: [],
    data() {
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
         * 税务登记号
         */
        var checkTaxregistcertificatenum = (rule, value, callback) => {
            if ((this.addForm.invoicefor == 'E' || this.editForm.invoicefor == 'E') && value === '') {
                callback(new Error('值不能为空'))
            } else {
                callback()
            }
        }
        /**
         * 银行名字
         */
        var checkBankname = (rule, value, callback) => {
            if ((this.addForm.invoicetype == 'vat-si' || this.editForm.invoicetype == 'vat-si') && value === '') {
                callback(new Error('值不能为空'))
            } else {
                callback()
            }
        }
        /**
         * 银行账户
         */
        var checkBankno = (rule, value, callback) => {
            if ((this.addForm.invoicetype == 'vat-si' || this.editForm.invoicetype == 'vat-si') && value === '') {
                callback(new Error('值不能为空'))
            } else {
                callback()
            }
        }
        /**
         * 注册场所
         */
        var checkRegistrationsiteaddress = (rule, value, callback) => {
            if ((this.addForm.invoicetype == 'vat-si' || this.editForm.invoicetype == 'vat-si') && value === '') {
                callback(new Error('值不能为空'))
            } else {
                callback()
            }
        }
        /**
         * 注册固定账户
         */
        var checkRegistraiontel = (rule, value, callback) => {
            if ((this.addForm.invoicetype == 'vat-si' || this.editForm.invoicetype == 'vat-si') && value === '') {
                callback(new Error('值不能为空'))
            } else {
                callback()
            }
        }
        return {
            item: {
                cnFieldCaption: '',
                group: [{
                    fieldName: 'countryId',
                    controlData: '',
                    controlTypeId: 32,
                    cnFieldCaption: '国家',
                    inDefaultValue: '1'
                    // isNotNull: 1 // 必填非必填
                },
                {
                    fieldName: 'provinceId',
                    controlData: '',
                    controlTypeId: 33,
                    cnFieldCaption: '省'
                },
                {
                    fieldName: 'cityId',
                    controlData: '',
                    controlTypeId: 34,
                    cnFieldCaption: '市'
                },
                {
                    fieldName: 'townId',
                    controlData: '',
                    controlTypeId: 35,
                    cnFieldCaption: '区'
                }
                ]
            },
            itemForEdit: {
                cnFieldCaption: '',
                group: [{
                    fieldName: 'countryId',
                    controlData: '',
                    controlTypeId: 32,
                    cnFieldCaption: '国家',
                    inDefaultValue: '1'
                    // isNotNull: 1 // 必填非必填
                },
                {
                    fieldName: 'provinceId',
                    controlData: '',
                    controlTypeId: 33,
                    cnFieldCaption: '省'
                },
                {
                    fieldName: 'cityId',
                    controlData: '',
                    controlTypeId: 34,
                    cnFieldCaption: '市'
                },
                {
                    fieldName: 'townId',
                    controlData: '',
                    controlTypeId: 35,
                    cnFieldCaption: '区'
                }
                ]
            },
            cityName: '',
            cityInfo: '',
            editcityInfo: '',
            isOpenAdd: false,
            isOpenEdit: false,
            addForm: {
                invoicefor: 'E',
                invoicetitle: '',
                invoicetype: 'vat-ti',
                idcard: '',
                taxregistcertificatenum: '',
                bankname: '',
                bankno: '',
                registrationsiteaddress: '',
                registraiontel: '',
                recipientsname: '',
                country: '',
                province: '',
                city: '',
                streetaddress: '',
                zipcode: '',
                phone: '',
                isdefault: ''
            },
            editForm: {
                id: 0,
                invoicefor: '',
                invoicetitle: '',
                invoicetype: '',
                idcard: '',
                taxregistcertificatenum: '',
                bankname: '',
                bankno: '',
                registrationsiteaddress: '',
                registraiontel: '',
                recipientsname: '',
                country: '',
                province: '',
                city: '',
                streetaddress: '',
                zipcode: '',
                phone: '',
                isdefault: ''
            },
            isDefaultSelect: false,
            invoiceList: [],
            // 检查空值
            formRules: {
                invoicefor: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                invoicetitle: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                invoicetype: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                taxregistcertificatenum: [
                    { required: true, validator: checkTaxregistcertificatenum, trigger: 'blur' }
                ],
                bankname: [
                    { required: true, validator: checkBankname, trigger: 'blur' }
                ],
                bankno: [
                    { required: true, validator: checkBankno, trigger: 'blur' }
                ],
                registrationsiteaddress: [
                    { required: true, validator: checkRegistrationsiteaddress, trigger: 'blur' }
                ],
                registraiontel: [
                    { required: true, validator: checkRegistraiontel, trigger: 'blur' }
                ],
                recipientsname: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                streetaddress: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                zipcode: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: checkIsNull, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getInvoiceInfoList()
    },
    mounted() { },
    computed: {},
    methods: {
        selectinvoicefor() {
            this.addForm.invoicetype = 'vat-ti'
        },
        /**
         * 设置默认发票
         */
        setDefault(id, isdefault) {
            let _this = this
            if (isdefault == 'Y') {
                return
            }
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = this.$t('mxpcweb.am.1534310369863') // 是否设置为默认开票信息
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            }).then(() => {
                this.invoiceList.forEach(element => {
                    if (element.id == id) {
                        this.editForm = element
                        this.editForm.id = element.id
                        this.editForm.isdefault = 'Y'
                        let data = {
                            id: _this.editForm.id,
                            invoicefor: _this.editForm.invoicefor,
                            invoicetitle: _this.editForm.invoicetitle,
                            invoicetype: _this.editForm.invoicetype,
                            idcard: _this.editForm.idcard,
                            taxregistcertificatenum: _this.editForm.taxregistcertificatenum,
                            bankname: _this.editForm.bankname,
                            bankno: _this.editForm.bankno,
                            registrationsiteaddress: _this.editForm.registrationsiteaddress,
                            registraiontel: _this.editForm.registraiontel,
                            recipientsname: _this.editForm.recipientsname,
                            country: _this.editForm.country,
                            province: _this.editForm.province,
                            city: _this.editForm.city,
                            streetaddress: _this.editForm.streetaddress,
                            zipcode: _this.editForm.zipcode,
                            phone: _this.editForm.phone,
                            isdefault: _this.editForm.isdefault
                        }
                        _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.invoice_setting_modify, data).then(function (res) {
                            if (res.body.code.toString() == _this.Global.RES_OK) {
                                _this.isOpenEdit = false
                                _this.getInvoiceInfoList()
                                _this.$message.success(_this.msg(res.body))
                            } else {
                                _this.$message.error(_this.msg(res.body))
                            }
                        }, function (res) {
                            _this.$message.error((_this.$t(_this.Global.errorTitle)))
                        })
                    }
                })
            }).catch(() => { })
        },
        // 获取发票设置列表
        getInvoiceInfoList() {
            var _this = this
            this.$http
                .get(
                    _this.Global.baseURL + _this.Global.api.v2.invoice_setting_list,
                    {}
                )
                .then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                        _this.invoiceList = res.body.data.dataList
                    } else {
                        _this.$message(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error((_this.$t(_this.Global.errorTitle)))
                })
        },
        // 删除发票设置
        invoinceDelete(id) {
            let _this = this
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = this.$t('mxpcweb.am.1534311190943') // 确定要删除该发票设置吗
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            var data = {
                id: id
            }
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            }).then(() => {
                _this.$http.delete(_this.Global.baseURL + _this.Global.api.v2.invoice_setting_delete, { params: data }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.getInvoiceInfoList()
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error((_this.$t(_this.Global.errorTitle)))
                })
            }).catch(() => { })
        },
        // 新增发票设置
        okSummit() {
            var _this = this
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    if (this.item.group[1].controlData == '') {
                        this.$message({
                            // 请选择所在省份！
                            message: this.$t('mxpcweb.am.1534311301188'),
                            type: 'warning'
                        })
                        return
                    }
                    if (this.item.group[2].controlData == '') {
                        this.$message({
                            // 请选择所在城市
                            message: this.$t('mxpcweb.am.1534311356220'),
                            type: 'warning'
                        })
                        return
                    }
                    if (this.item.group[3].controlData == '') {
                        this.$message({
                            // 请选择所在地区！
                            message: this.$t('mxpcweb.am.1534311390663'),
                            type: 'warning'
                        })
                        return
                    }
                    this.addForm.province = this.item.group[1].controlData
                    this.addForm.city = this.item.group[2].controlData
                    this.addForm.country = this.item.group[3].controlData
                    if (this.addForm.isdefault == true) {
                        this.addForm.isdefault = 'Y'
                    } else {
                        this.addForm.isdefault = 'N'
                    }
                    _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.invoice_setting_add, _this.addForm).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.isOpenAdd = false
                            _this.closeAddForm('addForm')
                            _this.getInvoiceInfoList()
                            _this.$message.success(_this.msg(res.body))
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error((_this.$t(_this.Global.errorTitle)))
                    }
                    )
                } // if
            })
        },
        // 编辑
        editSummit() {
            let _this = this
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    if (this.itemForEdit.group[1].controlData == '') {
                        this.$message({
                            // 请选择所在省份！
                            message: this.$t('mxpcweb.am.1534311301188'),
                            type: 'warning'
                        })
                        return
                    }
                    if (this.itemForEdit.group[2].controlData == '') {
                        this.$message({
                            // 请选择所在城市
                            message: this.$t('mxpcweb.am.1534311356220'),
                            type: 'warning'
                        })
                        return
                    }
                    if (this.itemForEdit.group[3].controlData == '') {
                        this.$message({
                            // 请选择所在地区！
                            message: this.$t('mxpcweb.am.1534311390663'),
                            type: 'warning'
                        })
                        return
                    }
                    this.editForm.province = this.itemForEdit.group[1].controlData
                    this.editForm.city = this.itemForEdit.group[2].controlData
                    this.editForm.country = this.itemForEdit.group[3].controlData
                    if (this.isDefaultSelect == true) {
                        this.editForm.isdefault = 'Y'
                    } else {
                        this.editForm.isdefault = 'N'
                    }

                    _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.invoice_setting_modify, _this.editForm).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.isOpenEdit = false
                            _this.closeModifyForm('editForm')
                            _this.getInvoiceInfoList()
                            _this.$message.success(_this.msg(res.body))
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error((_this.$t(_this.Global.errorTitle)))
                    })
                }
            })
        },
        // 清空表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.itemForEdit.group[1].fieldValue = ''
            this.itemForEdit.group[2].fieldValue = ''
            this.itemForEdit.group[3].fieldValue = ''
        },
        // 编辑发票
        editInvoince(id) {
            var _this = this
            this.invoiceList.forEach(element => {
                if (element.id == id) {
                    this.editForm = element
                    this.editForm.id = element.id
                    this.itemForEdit.group[1].fieldValue = element.province
                    this.itemForEdit.group[2].fieldValue = element.city
                    this.itemForEdit.group[3].fieldValue = element.country
                    if (this.editForm.isdefault == 'Y') {
                        this.isDefaultSelect = true
                    } else {
                        this.isDefaultSelect = false
                    }
                    // 地区关联值
                    this.isOpenEdit = true
                    setTimeout(() => {
                        _this.$refs['controlEdit'].updata()
                    }, 100)
                }
            })
        },
        closeAddForm(formName) {
            this.item.group[1].controlData = ''
            this.item.group[2].controlData = ''
            this.item.group[3].controlData = ''
            this.$refs[formName].resetFields()
            this.$refs['control'].clearData()
            this.isOpenAdd = false
        },
        closeModifyForm(formName) {
            this.$refs[formName].resetFields()
            this.itemForEdit.group[1].controlData = ''
            this.itemForEdit.group[2].controlData = ''
            this.itemForEdit.group[3].controlData = ''
            this.isOpenEdit = false
            this.$refs['controlEdit'].clearData()
        }
    },
    components: {
        'region': Region
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addForm {
    .el-form-item {
        margin-bottom: 3px;
    }

    .requre {
        color: red;
    }
}
.InvoiceSet {
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 52px;
    right: 0;
    bottom: 0;
    .el-col {
        margin-top: 10px;
        > ul {
            height: 160px;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 15px;
            margin-top: 5px;
            color: #999;
            -moz-transition: all 0.3s ease-out;
            -webkit-transition: all 0.3s ease-out;
            -ms-transition: all 0.3s ease-out;
            -o-transition: all 0.3s ease-out;
            transition: all 0.3s ease-out;
            position: relative;
            .btns {
                position: absolute;
                right: 15px;
                bottom: 5px;
            }
            > li {
                margin-bottom: 8px;
                .name {
                    display: inline-block;
                    padding-top: 5px;
                    color: #666;
                }
            }
            .addInvoice {
                // border: 1px solid red;
                width: 100%;
                height: 30px;
                line-height: 30px;
                position: absolute;
                top: 50%;
                margin-top: -20px;
                left: 0;
                text-align: center;
                .iconfont {
                    font-size: 14px;
                    margin-right: 5px;
                    float: left;
                }
            }
            &:hover {
                border-color: #999;
                cursor: default;
            }
        }
    }
    .el-form-item {
        // border: 1px solid red;
        margin-right: 30px;
        margin-left: 20px;
        label {
            font-weight: normal;
        }
        .el-radio-group {
            padding-top: 5px;
        }
    }
    .input_notice {
        // border: 1px solid red;
        font-size: 12px;
        padding: 0 25px 0 145px;
        margin: -5px 0 15px;
    }
}
</style>
