
<template>
    <div class="domainConfig">
        <!-- 发送设置 -->
        <page-detail style="z-index: 2;" :title="$t('mxpcweb.am.1531903938449')" iconfont="icon-setting" :detailTitle="itemData.domain_name" @toList="$emit('openList')"></page-detail>
        <div v-loading="loading">
            <div class="navigation">
                <div class="list">
                    <span style="font-size:18px;">{{itemData.domain_name}}</span>
                    <!-- 如何在DNS平台上配置域名？ -->
                    <!-- <span class="text-blue text-hover" @click="agreeIdeaClick()">《{{ $t('mxpcweb.companyregister.1528870298523') }}》</span> -->
                    <span class="text-hover" @click="agreeIdeaClick()" style="font-size:14px;color:RGBA(94, 163, 246, 1);margin-left:10px;">{{$t('mxpcweb.am.1531903941025')}}</span>
                </div>
                <!-- 检测配置 -->
                <el-button class="floatRight" style="background:RGBA(139, 216, 103, 1);border:1px solid RGBA(139, 216, 103, 1)" type="success" @click="$refs.websiteState.showDialog(domainData.verify)">{{$t('mxpcweb.am.1532501487769')}}</el-button>
                <!-- 导出配置信息 -->
                <el-button class="floatRight" type="primary" @click="domainExport()">{{$t('mxpcweb.am.1531903948434')}}</el-button>
                <div class="notice">
                    <!-- 提醒： 根据国家有关规定，请使用ICP已备案的域名或其子域名作为发信域名，若域名ICP未备案，将无法配置CNAME使用点击跟踪功能。 -->
                    {{$t('mxpcweb.am.1531903956937')}}
                </div>
            </div>
            <div class="listTitle">
                <!-- 发信设置 -->
                {{$t('mxpcweb.am.1531903961625')}}
            </div>
            <el-row class="listHead">
                <el-col class="listItem" :span="3">
                    <!-- 名称 -->
                    {{$t('mxpcweb.am.1531903966553')}}
                </el-col>
                <el-col class="listItem" :span="2">
                    <!-- 状态 -->
                    {{$t('mxpcweb.am.1531903971129')}}
                </el-col>
                <el-col class="listItem" :span="2">
                    <!-- 类型 -->
                    {{$t('mxpcweb.am.1531903975586')}}
                </el-col>
                <el-col class="listItem" :span="6">
                    <!-- 主机记录 -->
                    {{$t('mxpcweb.am.1531903979826')}}
                </el-col>
                <el-col class="listItem" :span="5">
                    <!-- 主域名 -->
                    {{$t('mxpcweb.am.1531903984345')}}
                </el-col>
                <el-col class="listItem" :span="6">
                    <!-- 需配置的记录值 -->
                    {{$t('mxpcweb.am.1531903991105')}}
                </el-col>
            </el-row>
            <el-row class="list">
                <el-col class="listItem" :span="3">
                    <span class="text-red">
                        <i class="iconfont icon-star" style="font-size:12px;"></i>
                    </span>SPF
                </el-col>
                <el-col class="listItem" :span="2">
                    <i v-if="domainData.verify>=2" class="el-icon-circle-check text-green"></i>
                    <i v-else class="el-icon-circle-close text-red"></i>
                </el-col>
                <el-col class="listItem" :span="2">
                    TXT
                </el-col>
                <el-col class="listItem" :span="6">
                    <div class="ellipsis">
                        {{getValueName(domainData['spf.domain'],getstr(domainData.name))}}
                    </div>
                </el-col>
                <el-col :span="5" class="listItem">
                    <div class="ellipsis" :title="domainData.name">
                        {{getstr(domainData.name)}}
                    </div>
                </el-col>
                <el-col class="listItems" :span="6" @click="copy(domainData['spf.value'])">
                    <div class="listItem">
                        <div class="ellipsis" :title="domainData['spf.value']">
                            {{domainData['spf.value']}}
                        </div>
                        <input style="height:0;opacity:0;" type="text" :value="domainData['spf.value']" ref="spf_value" class="contents">
                    </div>
                    <i class="iconfont icon-copy text-hover" @click="Copy('spf_value')"></i>
                </el-col>
            </el-row>

            <el-row class="list">
                <el-col class="listItem" :span="3">
                    <span class="text-red">
                        <i class="iconfont icon-star" style="font-size:12px;"></i>
                    </span>DKIM
                </el-col>
                <el-col class="listItem" :span="2">
                    <i v-if="domainData.verify>=1" class="el-icon-circle-check text-green"></i>
                    <i v-else class="el-icon-circle-close text-red"></i>
                </el-col>
                <el-col class="listItem" :span="2">
                    TXT
                </el-col>
                <el-col class="listItem" :span="6">
                    <div class="ellipsis">
                        {{getValueName(domainData['dkim.domain'],getstr(domainData.name))}}
                    </div>
                </el-col>
                <el-col class="listItem ellipsis" :span="5">
                    <div class="ellipsis">
                        {{getstr(domainData.name)}}
                    </div>
                </el-col>
                <el-col class="listItems" :span="6">
                    <div class="listItem ellipsis">
                        {{domainData['dkim.value']}}
                        <input style="height:0;opacity:0;" type="text" :value="domainData['dkim.value']" ref="dkim_value" class="contents">
                    </div>
                    <i class="iconfont icon-copy text-hover" @click="Copy('dkim_value')"></i>
                </el-col>
            </el-row>

            <el-row class="list">
                <el-col class="listItem" :span="3">
                    DMARC
                </el-col>
                <el-col class="listItem" :span="2">
                    <i v-if="domainData.verify>=32" class="el-icon-circle-check text-green"></i>
                    <i v-else class="el-icon-circle-close text-red"></i>
                </el-col>
                <el-col class="listItem" :span="2">
                    TXT
                </el-col>
                <el-col class="listItem ellipsis" :span="6">
                    <div class="listItem ellipsis">
                        {{getValueName(domainData['dmarc.domain'],getstr(domainData.name))}}
                    </div>
                </el-col>
                <el-col class="listItem ellipsis" :span="5">
                    <div class="listItem ellipsis">
                        {{getstr(domainData.name)}}

                    </div>
                </el-col>
                <el-col class="listItems" :span="6">
                    <div class="listItem ellipsis">
                        {{domainData['dmarc.value']}}
                        <input style="height:0;opacity:0;" type="text" :value="domainData['dmarc.value']" ref="dmarc_value" class="contents">
                    </div>
                    <i class="iconfont icon-copy text-hover" @click="Copy('dmarc_value')"></i>
                </el-col>
            </el-row>

            <div class="listTitle">
                <!-- 收信配置 -->
                {{$t('mxpcweb.am.1531903998776')}}
            </div>
            <el-row class="listHead">
                <el-col class="listItem" :span="3">
                    <!-- 名称 -->
                    {{$t('mxpcweb.am.1531903966553')}}
                </el-col>
                <el-col class="listItem" :span="2">
                    <!-- 状态 -->
                    {{$t('mxpcweb.am.1531903971129')}}
                </el-col>
                <el-col class="listItem" :span="2">
                    <!-- 类型 -->
                    {{$t('mxpcweb.am.1531903975586')}}
                </el-col>
                <el-col class="listItem" :span="6">
                    <!-- 主机记录 -->
                    {{$t('mxpcweb.am.1531903979826')}}
                </el-col>
                <el-col class="listItem" :span="5">
                    <!-- 主域名 -->
                    {{$t('mxpcweb.am.1531903984345')}}
                </el-col>
                <el-col class="listItem" :span="6">
                    <!-- 需配置的记录值 -->
                    {{$t('mxpcweb.am.1531903991105')}}
                </el-col>
            </el-row>
            <el-row class="list">
                <el-col class="listItem" :span="3">
                    <span class="text-red">
                        <i class="iconfont icon-star" style="font-size:12px;"></i>
                    </span>MX
                </el-col>
                <el-col class="listItem" :span="2">
                    <i v-if="domainData.verify>=4" class="el-icon-circle-check text-green"></i>
                    <i v-else class="el-icon-circle-close text-red"></i>
                </el-col>
                <el-col class="listItem" :span="2">
                    MX
                </el-col>
                <el-col class="listItem ellipsis" :span="6">
                    <div class="listItem ellipsis">
                        {{getValueName(domainData['mx.domain'],getstr(domainData.name))}}
                    </div>
                </el-col>
                <el-col class="listItem ellipsis" :span="5">
                    <div class="listItem ellipsis">
                        {{getstr(domainData.name)}}

                    </div>
                </el-col>
                <el-col class="listItems" :span="6">
                    <div class="listItem ellipsis">
                        {{domainData['mx.value']}}
                        <input style="height:0;opacity:0;" type="text" :value="domainData['mx.value']" ref="mx_value" class="contents">
                    </div>
                    <i class="iconfont icon-copy text-hover" @click="Copy('mx_value')"></i>
                </el-col>
            </el-row>
        </div>
        <website-state :itemData="itemData" ref="websiteState" @getListData="getListData"></website-state>
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import { isArray } from '@/libs/utils.js'
import websiteState from '../dialog/websiteState'
export default {
    name: 'domainConfig',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            domainData: {
                dkim_domain: '',
                dkim_value: '',
                dmarc_domain: '',
                dmarc_value: '',
                gmtCreated: '',
                gmtUpdated: '',
                id: 0,
                mx_domain: '',
                mx_value: '',
                name: '',
                newName: '',
                spf_domain: '',
                spf_value: '',
                type: '',
                verify: '',
                host_domain: '',
                spf_host_log: '',
                dkim_host_log: '',
                dmarc_host_log: '',
                mx_host_log: ''
            },
            loading: true
        }
    },
    created() {
        this.getListData()
    },
    methods: {
        getstr(key) {
            if (key != null && key != '') {
                var regex = '[\\w-]+\\.(com.cn|net.cn|gov.cn|edu.cn|org\\.nz|org.cn|com|me|jp|xyz|int|mil|tw|tt|uk|im|net|org|gov|cc|top|org|biz|info|cn|co|mi)\\b()*'
                var found = key.match(regex)

                if (found != null && found.length > 0) {
                    return found[0]
                } else {
                    console.log(key)
                }
            }
        },
        getValueName(key, template) {
            // let template = this.getstr(key)
            let str = ''
            if (key != undefined) {
                str = key.toString().replace(template, '')
            }
            if (str == '') {
                return '@'
            } else {
                return str
            }
        },
        // 查找协议内容
        agreeIdeaClick() {
            let domain = this.Global.domain
            window.open(
                // 'http://192.168.8.151:9000/pc/configuringDomainNames',
                domain + '/pc/configuringDomainNames',
                'newwindow',
                'height=700, width=800, top=100, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no'
            )
        },
        getListData(obj) {
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.v2.domainVerify_Get, { params: { domainId: _this.itemData.domainid }
            }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    if (isArray(res.body.data.dataList)) {
                        _this.domainData = res.body.data.dataList[0]
                        _this.loading = false
                    } else {
                        // 未查到数据
                        _this.$message(this.$t('mxpcweb.am.1531904017226'))
                        _this.loading = false
                    }
                } else {
                    this.loading = false
                }
            }, function (res) {
                this.loading = false
                this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        domainExport() {
            this.downloadFile(this.Global.baseURL + this.Global.api.v2.domainVerify_Export, { domainId: this.itemData.domainid })
        },
        Copy(value) {
            let _this = this
            var e = this.$refs[value]// 对象是contents
            e.select() // 选择对象
            document.execCommand('Copy') // 执行浏览器复制命令
            // 复制成功
            _this.$message.success(this.$t('mxpcweb.am.1531904029672'))
        }
    },
    components: {
        'page-detail': PageDetail,
        'website-state': websiteState
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../public-zh-cn.less";
.domainConfig {
    padding: @pagePadding; //列表
    padding-top: 15px;
    padding-bottom: 50px;
    color: RGBA(48, 49, 51, 1);
    min-height: 100%;
    > div {
        .floatRight {
            float: right;
            margin-left: 4px;
        }
        .title {
            position: relative;
            padding-left: 70px;
            .backList {
                width: 60px;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
        .navigation {
            background: white;
            height: 100px;
            padding: 10px 10px 23px 20px;
            > .list {
                height: 32px;
                line-height: 32px;
                display: inline-block;
            }
            > .notice {
                margin-top: 20px;
                height: 16px;
                font-size: 12px;
                color: rgba(96, 98, 102, 1);
                line-height: 16px;
            }
        }
        > .listTitle {
            height: 47px;
            background: rgba(255, 255, 255, 1);
            border-radius: 4px 4px 0px 0px;
            line-height: 47px;
            margin-top: 10px;
            padding: 0 42px;
        }
        > .list {
            font-size: 12px;
            height: 55px;
            background: rgba(255, 255, 255, 1);
            line-height: 55px;
            padding: 0 42px;
            border-bottom: 1px solid #f7f8f9;
            overflow: hidden;
            .listItems {
                position: relative;
                .icon-copy {
                    position: absolute;
                    right: -12px;
                    top: 0;
                    display: none;
                }
            }
            .listItems:hover {
                .icon-copy {
                    display: inline-block;
                }
            }
            .listItem:hover {
                .icon-copy {
                    display: inline-block;
                }
            }
        }
        > .listHead {
            height: 32px;
            line-height: 32px;
            padding: 0 42px;
            background: rgba(239, 242, 244, 1);
        }
    }
}
</style>
