<template>
    <div class="DialogGetContacts">
        <el-dialog title="选择联系人" v-dialogDrag :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogForm')">
            <el-input placeholder="联系人名字/邮箱地址" icon="search" v-model="searchKey" @change="change" @keyup.enter.native="getData" :on-icon-click="getData"> </el-input>
            <div class="contactsList MXscroll"  v-loading ="loading">
                <el-checkbox-group v-model="checkeds">
                    <no-data v-if="contactsList.length==0"></no-data>
                    <table v-else>
                        <template v-for="(item,index) in contactsList" v-if="item.mailAddress&&item.mailAddress.length>0">
                            <tr  :key="index+'list'">
                                <td width="35">
                                    <el-checkbox  :label="item.mailAddress[0]">&nbsp;</el-checkbox>
                                </td>
                                <td><img class="avatar" :src="avatarSrc(item)"></td>
                                <td class="detail">
                                    <dl>
                                        <dt>
                                            <span class="text-black" title="姓名">{{item.contName}}</span>
                                            <em title="昵称">{{item.nickName}}</em>
                                        </dt>
                                    </dl>
                                    <div class="company text-blue" title="">{{item.custName}}</div>
                                </td>
                                <td>
                                    <ul class="contactInfo">
                                        <li style="width:300px;" class="ellipsis" :title="item.mailAddress[0]">
                                            <span class="icon">
                                                <i class="iconfont icon-mail"></i>
                                            </span>
                                            <span>{{item.mailAddress[0]}}</span>
                                        </li>
                                    </ul>
                                </td>
                                <td width="20">
                                    <div v-if="item.mailAddress.length>1" class="showAbout" @click="item.controlType=!item.controlType"><span>{{item.mailAddress.length}}</span><i class="iconfont" :class="item.controlType?'icon-arrow-down':'icon-arrow-right'"></i></div>
                                </td>
                            </tr>
                            <template v-if="item.mailAddress.length>1">
                                <tr  v-show="item.controlType" v-for="(items,indexs) in item.mailAddress.slice(1)" :key="indexs+item.contId" style="background-color: #ecf0f5;">
                                    <td width="35">
                                        <el-checkbox :label="items">&nbsp;</el-checkbox>
                                    </td>
                                    <td><img class="avatar" :src="avatarSrc(item)"></td>
                                    <td class="detail">
                                        <dl>
                                            <dt>
                                                <span class="text-black" title="姓名">{{item.contName}}</span>
                                                <em title="昵称">{{item.nickName}}</em>
                                            </dt>
                                        </dl>
                                        <div class="company text-blue" title="">{{item.custName}}</div>
                                    </td>
                                    <td>
                                        <ul class="contactInfo">
                                            <li style="width:300px;" class="ellipsis" :title="items">
                                                <span class="icon">
                                                    <i class="iconfont icon-mail"></i>
                                                </span>
                                                <span>{{items}}</span>
                                            </li>
                                        </ul>
                                    </td>
                                    <td width="20">

                                    </td>
                                </tr>
                            </template>
                        </template>
                    </table>
                </el-checkbox-group>
                <div class="text-center text-hover" v-show="totalNum>contactsList.length" @click="more">加载更多</div>
            </div>

            <div class="text-center">
                <el-button type="primary" @click="submit('dialogForm')" style="width:200px;">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 描述：选择联系人，弹窗
 * 作者：向士健(CSS) / ***(API)
 * 时间：2018/04/09
 */

import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'DialogGetContacts',
    props: {
    },
    data() {
        return {
            isOpen: false,
            searchKey: '',
            checkeds: [],
            contactsList: [],
            blockData: {
                fromNum: 0,
                pageSize: 50
            },
            totalNum: '', // 总条数
            argument: '',
            type: '',
            loading: true
        }
    },
    created() {
    },
    computed: {

    },
    methods: {
        change() { //
            this.checkeds = []
        },
        // 图像
        avatarSrc(list) {
            let imgId
            if (!list.imagesId || list.imagesId.length === 0) {
                if (list.sex && list.sex == '2') {
                    return '/static/images/noAvatarWoman.png'
                } else {
                    return '/static/images/noAvatar.png'
                }
            } else {
                imgId = list.imagesId[0] // 取第一个数组项为默认头像
                return this.getGlobalImgSrc(imgId, '55x55')
            }
        },
        more() { // 加载更多事件
            this.blockData.pageSize += 50
            this.getData(this.argument)
        },
        getData() {
            let _this = this
            this.argument = this.searchKey ? this.searchKey.replace(/(^\s*)|(\s*$)/g, '') : ''
            let argument = {
                moduleCode: 'BF003',
                searchType: 'allList',
                sort: 'custId',
                from: _this.blockData.fromNum,
                size: _this.blockData.pageSize
            }
            if (this.argument != '') {
                argument.keywords = this.argument
            };
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
                params: argument
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let list = res.body.data.list
                    this.totalNum = res.body.data.totalNum
                    list.forEach(function(item) {
                        item.controlType = _this.checkQue(item.mailAddress)
                    })
                    _this.contactsList = list
                    _this.loading = false
                } else {
                    _this.$message.error(res.body.msg)
                    _this.loading = false
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
                 _this.loading = false
            })
        },
        checkQue(list) { // 检查是否选中
            if (!list) {
                return false
            }
            let check = false
            this.checkeds.forEach(function(items) {
                list.forEach(function(item) {
                    if (item == items) {
                        check = true
                    }
                })
            })
            return check
        },
        isShow(type, list) {
            let _this = this
            this.checkeds = []
            list.forEach(function(item) {
                _this.checkeds.push(item.mail)
            })
            _this.loading = true
            _this.contactsList = []
            _this.blockData = {
                fromNum: 0,
                pageSize: 50
            }
            _this.searchKey = ''
            _this.argument = ''
            _this.type = type
            _this.getData()
            _this.isOpen = !_this.isOpen
        },
        // 点击确定
        submit() {
            let _this = this
            let list = []
            _this.checkeds.forEach(function(item) {
               _this.contactsList.forEach(function(items) {
                   if (items.mailAddress) {
                       items.mailAddress.forEach(function(mailItem) {
                           if (mailItem == item) {
                                let data = {
                                    company: items.custName ? items.custName : '',
                                    custId: items.custId ? items.custId : '',
                                    mail: item,
                                    name: items.contName ? items.contName : '',
                                    url: items.imagesId ? items.imagesId : ''
                                }
                                list.push(data)
                           }
                       })
                   }
               })
            })
            console.log(list)
            _this.$emit('updateContact', this.type, list)
            this.isOpen = false
        },
        // 重置
        resetForm() { }
    },
     components: {
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
