<template>
    <div class="InputAuto">
        <div class="inputEdit clearfix" @click="wrapClick" :class="[disabled ? 'text-no' : '']">
            <!-- 选上的邮箱显示 -->
            <div class="label" v-for="(item,index) in inputMailDisplay" :key="index" v-if="isShowMailAddr" :class="[item.isMailAddress ? '' : 'redMailAddress']">

                <div class="mailShow" :class="[activeLabelSelect && activeIndex===index ?'mailActive':'', (item.custId != '' && item.custId !== undefined) ? 'isCustomer':'']" @click.stop="mailShowClick($event,index)">
                    <em :contenteditable="activeIndex===index" @blur="selectNameBlur($event,index)">{{item.name}}</em>
                    &lt;<span :contenteditable="activeIndex===index" @blur="selectMailBlur($event,index)">{{item.mail}}</span>&gt;
                    <span class="belong" v-if="item.isMailAddress" :style="returnBG(item)" @click.stop="belongClick(item.mail,item.custId)"><i>{{(item.custId !== undefined && item.custId !== '') ? '客':'陌'}}</i></span>
                    <span class="delete" @click.stop="delThis(index)">
                        <i class="iconfont icon-close"></i>
                    </span>
                </div>
                <!-- 两邮箱中间输入时 -->
                <div class="insert" @click.stop="insertClick(index)">
                    <!--<input v-model="inputInsert" v-focus="activeInputFocus"
                                    v-if="activeInputShow && activeIndex===index"
                                    @input="insertInput($event,index)"
                                    @blur="insertBlur"
                                    @keydown="insertKeydown($event)" v-bind:style="{ width: inputW + 'px' }">-->
                </div>
                <!-- 下拉框 -->
                <!--<transition name="input-fade">
                <div class="downSelect" v-if="inputMailDownShow && activeIndex===index" style="right: 0; margin-right: -260px;">
                    <div class="topTip">按Esc键关闭菜单</div>
                    <div class="selectList MXscroll">
                        <table>
                            <tr v-for="(item,index) in inputMailDownData" :key="index" @click="downItemClick(index)" data-downSelect>
                                <td>
                                    <span class="img"><img :src="item.url"></span>
                                </td>
                                <td>
                                    <span class="name">{{item.name}}</span>
                                </td>
                                <td>
                                    <span class="mail">{{item.mail}}</span>
                                </td>
                                <td>
                                    <span class="company">{{item.company}}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                </transition>-->
            </div>

            <!-- 跟随移动的输入及下拉 -->
            <div class="label" style="width:50px;">
                <div class="insert">
                    <input v-model="inputInsert" :disabled="disabled" v-focus="wrapInputFocus" @input="insertInput($event)" @blur="insertBlur" @keydown="insertKeydown($event)" v-bind:style="{ width: inputW + 'px' }" @focus="$emit('test',inputType)">
                </div>

                <transition name="input-fade">
                    <div class="downSelect" v-if="inputMailDownShow" v-bind:style="{left: downSelectLeft + 'px', top: downSelectTop + 'px' }">
                        <!-- 按Esc键关闭菜单 -->
                        <div class="topTip">{{$t('mxpcweb.mail.1528976249244')}}</div>
                        <div class="selectList MXscroll">
                            <table>
                                <tr v-for="(item,index) in inputMailDownData" :key="index" @click="downItemClick(index)" data-downSelect :class="[lightDownIndex === index ? 'lightThis' : '']">
                                    <td width='40'>
                                        <span class="img">
                                            <img :src="getPicUrl(item.url)">
                                        </span>
                                    </td>
                                    <td>
                                        <span class="name" :title="item.name">{{item.name}}</span>
                                    </td>
                                    <td>
                                        <span class="mail" :title="filterHtml(item.mail)" v-html="item.mail"></span>
                                    </td>
                                    <td>
                                        <span class="company text-blue" v-if="(item.custId != '' && item.custId !== undefined)" :title="item.company">{{item.company || $t('mxpcweb.mail.1528975158622')}}</span>
                                        <!-- '无' -->
                                        <!-- 陌生客户 -->
                                        <span class="company" v-else>{{$t('mxpcweb.mail.1528976246633')}}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </transition>
            </div>

        </div>

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
import { checkEmail, isArray, isObject, clearHtml, trim, toSBC } from '@/libs/utils.js'
export default {
    name: 'InputAuto',
    props: {
        // 禁用输入
        disabled: {
            type: Boolean,
            default: false
        },
        // 当前输入上的
        inputMailData: {
            type: Array,
            default: function () {
                return []
            }
        },
        // 检索出的下拉
        inputMailDownData: {
            type: Array,
            default: function () {
                return []
            }
        },
        inputType: {
            type: String,
            default: function () {
                return '1'
            }
        }

    },
    data() {
        return {
            isShowMailAddr: true,
            inputMailDisplay: [], // 输入框显示的邮箱
            inputInsert: '', // 当前正在输入值
            activeIndex: -1, // 已录入的地址激活项index
            activeLabelSelect: false, // 是否选中

            activeInputShow: false,
            activeInputFocus: false, // 动态输入框焦点
            inputW: 20, // input框动态宽
            wrapInputFocus: false, // 最后输入框焦点
            downSelectLeft: 0,
            downSelectTop: 0,
            inputMailDownShow: false, // 下拉是否出现
            inputMailDownThis: false, // 特定当前
            lightDownIndex: 0 // 下拉高亮的 index
        }
    },
    directives: {
        focus: {
            update: function (el, { value }) {
                if (value) {
                    el.focus()
                }
            }
        }
    },
    mounted() {
        // 点击其他隐藏
        document.addEventListener('click', (e) => {
            if (!e.target.dataset.mailShow) {
                this.activeLabelSelect = false
                this.activeIndex = -1
            }
            if (!e.target.dataset.downSelect) {
                this.inputMailDownShow = false
                this.inputMailDownThis = false
            }
        })
    },
    methods: {
        filterHtml(html) {
            // return html.replace(/<[^>]*>/ig);//去除文字的<...></...>标签
            return clearHtml(html)
        },
        getData() {
            let allMail = this.inputMailDisplay
            // console.log('================= mailAddress')
            // console.log(allMail)
            return allMail // 改成不双向绑定，主动来调
        },
        // 陌字背景色
        returnBG(item) {
            if (item.custId && item.custId != '') { return }// 过滤掉客
            switch (item.level) {
                case 'A+':
                    return 'background:#008cee;'
                    break
                case 'A':
                    return 'background:green;'
                    break
                case 'B':
                    return 'background:#f60;'
                    break
                case 'C':
                    return 'background:#f30;'
                    break
                case 'D':
                    return 'background:#f00;'
                    break
                case 'E':
                    return 'background:#999;'
                    break
                default:
                    return ''
            }
        },
        // 选中的名字修改：
        selectNameBlur(e, index) {
            // console.log(e.target.innerText)
            // console.log(index)
            this.inputMailDisplay[index].name = e.target.innerText
            // this.$emit('Picking_valueChange')
        },
        // 选中的邮箱修改
        selectMailBlur(e, index) {
            // console.log(e.target.innerText)
            // console.log(index)
            let mail = e.target.innerText
            this.inputMailDisplay[index].mail = mail
            // this.$emit('Picking_valueChange')
        },
        // 头像url转换
        getPicUrl(urlArr) {
            return urlArr.length > 0 ? (this.getGlobalImgSrc(urlArr[0], '32x32')) : '/static/images/noAvatar.png'
        },
        // 客陌点击
        belongClick(mail, custId) {
            let _this = this
            ep.emit('custSliderOpen', {
                mail: mail,
                constId: custId,
                fn(e) {
                    // console.log(" 这里要刷新一下 客 陌 4.13 ")
                    _this.mailToGetCustomerSingle(mail)// 更新客陌
                }
            })
        },

        insertClick(index) {
            let _this = this
            this.activeIndex = index
            this.activeInputShow = true
            setTimeout(function () {
                _this.activeInputFocus = true
            }, 50)
        },
        mailShowClick(e, index) {
            this.activeIndex = index
            this.activeLabelSelect = true// 当前高亮
            // if(this.activeIndex == index)
        },
        // 高亮，识别下拉滚动条
        highlight(index) {
            // console.log(index)
            if (index < 0 || index > this.inputMailDownData.length - 1 || !this.inputMailDownShow) {
                return
            }
            // 滚动条
            const downBox = this.$el.querySelector('.selectList')
            const downBoxList = this.$el.querySelectorAll('.selectList tr')
            let highlightItem = downBoxList[index]
            // console.log(highlightItem.scrollHeight);//this高
            // console.log(highlightItem.offsetTop);//this到顶部距离
            // console.log(downBox.scrollTop);//已滚动了多少
            // console.log(downBox.clientHeight);//可视区高
            if (highlightItem.offsetTop + highlightItem.scrollHeight > (downBox.scrollTop + downBox.clientHeight)) {
                downBox.scrollTop += highlightItem.scrollHeight
            }
            if (highlightItem.offsetTop < downBox.scrollTop) {
                downBox.scrollTop -= highlightItem.scrollHeight
            }
            this.lightDownIndex = index
        },
        // 键盘操作
        insertKeydown(e) {
            // console.log(e.code)
            switch (e.code) {
                case 'Escape':
                    this.inputMailDownShow = false
                    this.inputMailDownThis = false
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    this.highlight(this.lightDownIndex + 1)
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    this.highlight(this.lightDownIndex - 1)
                    break
                case 'Enter':
                    // 此时有2种场景：1是下拉出现时，2是没有下拉时
                    // if (inputMailDownShow && checkEmail(this.inputInsert)) {
                    // 下拉出现时
                    if (this.inputMailDownShow) {
                        this.downItemClick(this.lightDownIndex)// 回车，为邮箱时执行，等于点击时
                    }
                    break
                case 'Backspace':
                    if (e.target.value.length <= 1) {
                        this.inputMailDownShow = false // 关掉下拉
                    }
                    if (e.target.value.length <= 0) {
                        this.inputMailDisplay.pop() // 删除最后一个
                        // this.$emit('Picking_valueChange')
                    }
                    break
                default:
                    break
            }
        },
        // 粘贴的值处理一下，合上去
        doPaste(value) {
            if (!value && value === '') { return }
            // 粘贴的长值处理，以空格及分号来分
            // bjcyc2006 <bjcyc2006@126.com> 也要处理?
            value = toSBC(value) // 全角转半角

            let pasteArr = value.split(' ')
            let pasteArrNew = []
            pasteArr.forEach(item => {
                pasteArrNew = pasteArrNew.concat(item.split(';'))
            })
            for (var i = 0; i < pasteArrNew.length; i++) {
                if (pasteArrNew[i] == '' || pasteArrNew[i] == null || !pasteArrNew[i]) {
                    pasteArrNew.splice(i, 1) // 最后，把无效删除
                    i = i - 1
                }
            }
            // console.log(pasteArrNew)
            // 不只一个时，遍历放到地址栏上
            if (pasteArrNew.length > 1) {
                pasteArrNew.forEach(item => {
                    let data = {
                        company: '',
                        custId: '',
                        url: '',
                        mail: item,
                        name: item.split('@', 1)[0]
                    }
                    this.inputMailDisplay.push(data)
                })
                this.inputInsert = '' // 当前输入清零
                this.inputW = 20

                // console.log(pasteArrNew)
                // this.getmailverifyMultiple(pasteArrNew) // 更新陌，批量
                this.mailToGetCustomerMore(pasteArrNew) // 更新客，批量
            } else {
                // 粘贴为一个地址时，input 长度跟着变
                this.inputW += value.length * 5
            }
        },
        // 输入时
        insertInput(e, index) {
            // input 动态增宽
            this.activeIndex = index
            // let num = this.inputInsert.length
            let value = e.target.value
            // console.log(value)
            // console.log(value.length)
            this.inputInsert = toSBC(value)
            if (value.length < 30) { // 大到一定值
                if (value.length < 10) {
                    this.inputW += value.length * 2
                } else {
                    this.inputW += value.length * 1
                }
            }
            // 输入逗号时放上去
            if (toSBC(e.data) == ';') {
                this.valToDisplay() // 正在输入的值，合上去
            }

            this.doPaste(value) // 粘贴的值处理一下，合上去
            this.$emit('inputChange', value) // 即时检索下拉选择

            // 下拉框定位
            const domPosi = e.target.getBoundingClientRect()// dom对象
            const winWidth = document.body.clientWidth// 窗口宽
            if (domPosi.left + 430 < winWidth) {
                this.downSelectLeft = domPosi.left
            } else {
                this.downSelectLeft = winWidth - 430
            }
            this.downSelectTop = domPosi.top + 25
            // 下拉是否出现
            this.inputMailDownThis = true
            this.clearRepeat() // 去重
        },
        // 去重
        clearRepeat() {
            let allArr = this.inputMailDisplay.concat()
            let obj = {}
            allArr = allArr.reduce((cur, next) => {
                if (!obj[next.mail]) {
                    obj[next.mail] = true && cur.push(next)
                }
                return cur
            }, []) // 设置cur默认类型为数组，并且初始值为空的数组

            // 不是 mail 的 标红
            allArr.forEach(item => {
                item.isMailAddress = checkEmail(item.mail)
            })
            this.inputMailDisplay = allArr
        },
        // 把当前输入的mail 合上去
        valToDisplay() {
            let val = this.inputInsert
            let clearVal = trim(val).replace(';', '')

            if (clearVal != '') {
                if (checkEmail(clearVal)) {
                    // this.inputMailDisplay.splice(this.activeIndex + 1, 0, data);
                    let data = {
                        company: '',
                        custId: '',
                        url: '',
                        mail: clearVal,
                        name: clearVal.split('@', 1)[0]
                    }
                    this.inputMailDisplay.push(data)
                    // this.getmailverifySingle(clearVal)// 地址评级
                    this.mailToGetCustomerSingle(clearVal)// 更新客陌
                    this.inputInsert = ''
                    this.inputW = 20
                }
            }
        },
        // 输入框失去焦点时：
        insertBlur() {
            this.valToDisplay() // 输入的值，合上去

            this.activeInputFocus = false
            this.activeIndex = -1
            this.activeInputShow = false

            this.wrapInputFocus = false
            this.clearRepeat() // 去重
        },
        //
        delThis(index) {
            this.inputMailDisplay.splice(index, 1)
            this.activeIndex = -1
            // this.$emit('Picking_valueChange')
        },
        // 下拉选择
        downItemClick(index) {
            let item = this.inputMailDownData[index]// 所选项
            let mailAddrData = this.inputMailDisplay// 已有项
            item.mail = clearHtml(item.mail)// 过滤一下

            // 已录入的没有高亮的，当没有重复时：
            let alreadyMail = []
            mailAddrData.forEach(function (item2) {
                alreadyMail.push(item2.mail)
            })

            if (this.activeIndex < 0 && alreadyMail.indexOf(item.mail) === -1) {
                // 没有就放上去
                mailAddrData.push(item)
                // this.getmailverifySingle(item.mail)// 地址评级
            } else {
                // mailAddrData.splice(this.activeIndex + 1, 0, {
                //     id: 1,
                //     status: '0',
                //     value: data.mail
                // });
            }
            this.inputMailDownShow = false
            this.inputMailDownThis = false
            this.inputInsert = ''
            // this.$emit('Picking_valueChange')
            this.clearRepeat() // 再去重
        },
        // 最外点击，input出焦点
        wrapClick() {
            this.wrapInputFocus = true
            // 定位到最后一个
            // let num = this.inputMailDisplay.length;
            // if(num>0){
            //     this.activeIndex = num - 1;
            // }
            // console.log(num)
        },
        // 更新客陌，单个
        mailToGetCustomerSingle(mail) {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.getMailsContacts, { params: { mailAddress: mail } }).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    let backArr = res.body.data
                    if (backArr.custId) {
                        //  邮箱查到的客户信息匹配到地址栏
                        _this.inputMailDisplay.forEach(item => {
                            if (item.mail === mail) {
                                item.custId = backArr.custId
                                item.company = backArr.custName
                            }
                        })
                        // 以下为强制刷新
                        _this.isShowMailAddr = false
                        // this.$emit('Picking_valueChange')
                        setTimeout(item => {
                            _this.isShowMailAddr = true
                        }, 5)
                    }
                }
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 更新客陌，【批量】
        mailToGetCustomerMore(mail) {
            if (!isArray(mail) || mail.length === 0) { return }
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.getMailsContacts, { params: { mailAddress: mail.join(';') } }).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK && isArray(res.body.data)) {
                    let backArr = res.body.data
                    backArr.forEach(item => {
                        this.inputMailDisplay.forEach(item2 => {
                            if (item.mailAddress == item2.mail) {
                                item2.custId = item.custId
                                item2.company = item.custName
                                // item2.custId = item.custId
                            }
                        })
                    })
                    // 以下为强制刷新
                    _this.isShowMailAddr = false
                    // this.$emit('Picking_valueChange')
                    setTimeout(item => {
                        _this.isShowMailAddr = true
                    }, 5)
                }
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 陌 地址评级，【单个】 --- (暂时废除)
        getmailverifySingle______(adderss) {
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.am.mailverify_get, { params: { mailAddress: adderss } }).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    if (!res.body.data.entity) { return }
                    let back = res.body.data.entity
                    let newArr = _this.inputMailDisplay.concat()
                    newArr.forEach(item => {
                        if (item.mail === back.mail) {
                            item.level = back.level
                        }
                    })
                    _this.inputMailDisplay = newArr
                    // 以下为强制刷新
                    _this.isShowMailAddr = false
                    setTimeout(item => {
                        _this.isShowMailAddr = true
                    }, 5)
                }
            }, function (res) {
                this.$message.error(_this.msg(res.body))
            })
        },
        // 陌 地址评级，【批量】，数组一次性识别'level'后，再放上一次 --- (暂时废除)
        getmailverifyMultiple______(dataArr) {
            let _this = this
            if (!isArray(dataArr) || dataArr.length === 0) { return }

            this.$http.post(this.Global.baseURL + this.Global.api.am.mailverify_get, { mailList: dataArr }).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    let resLevel = res.body.data.dataList
                    resLevel.forEach(item => {
                        this.inputMailDisplay.forEach(item2 => {
                            if (item.mail == item2.mail) {
                                item2.level = item.level // 邮箱等级放上
                            }
                        })
                    })
                    // 以下为强制刷新
                    _this.isShowMailAddr = false
                    setTimeout(item => {
                        _this.isShowMailAddr = true
                    }, 5)
                    // console.log('ooo')
                    // console.log(this.inputMailDisplay)

                    // let newArr = []
                    // dataArr.concat().forEach(item => {
                    //     resLevel.forEach(item2 => {
                    //         if (item.mail == item2.mail) {
                    //             item.level = item2.level // 邮箱等级放上
                    //         }
                    //     })
                    //     newArr.push(item)
                    // })
                    // this.inputMailDisplay = newArr
                    // console.log(newArr);
                }
            }, function (res) {
                this.$message.error(this.msg(res.body))
            })
        }
    },
    watch: {
        // 监听为空就不出来
        inputMailDownData: function (newVal, oldVal) {
            // 直接监听展示下拉，引用此组件的3个都会出现，所以处理一下
            this.inputMailDownShow = !!((newVal.length > 0 && this.inputMailDownThis))
            this.lightDownIndex = 0 // 高亮置零
        },
        // 统一监听变化时，通知上级，（处理input过长自适应）
        inputMailDisplay: function (newVal) {
            // console.log(newVal)
            // 去重，去已有重
            this.$emit('mailChange')
        },
        //
        inputMailData: function (newVal, oldVal) {
            // let _this = this
            // console.log(' change inputAuto ')
            // console.log(newVal)
            // 去重，去已有重
            let allArr = this.inputMailDisplay.concat(newVal)
            let obj = {}
            allArr = allArr.reduce((cur, next) => {
                // obj[next.mail] ? '' : obj[next.mail] = true && cur.push(next)
                // return cur
                if (!obj[next.mail]) {
                    obj[next.mail] = true && cur.push(next)
                }
                return cur
            }, []) // 设置cur默认类型为数组，并且初始值为空的数组

            // 先放上，再识别邮箱等级
            this.inputMailDisplay = allArr
            // console.log(allArr)
            let onlyMail = allArr.map(item => { return item.mail })
            // console.log(onlyMail)
            // console.log(onlyMail.length)
            // this.getmailverifyMultiple(onlyMail) // 更新陌，批量
            if (onlyMail.length === 1) {
                this.mailToGetCustomerSingle(onlyMail[0]) // 更新客，单个
            } else {
                this.mailToGetCustomerMore(onlyMail) // 更新客，批量
            }
            this.clearRepeat() // 再去重
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
