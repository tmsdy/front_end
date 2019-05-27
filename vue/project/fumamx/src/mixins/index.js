import { mapGetters, mapMutations } from 'vuex'
import { clearCookiesStorege, downloadFile, getToken, setStore, setItem, goodsEncrypt } from '@/libs/utils.js'
import { updateEditSetList } from '@/page/Main/Client/mixins/index.js'
import { MXsocket } from '@/libs/socket2'
export default {
    data () {
        return {
            systimezone: window.TIMEZONE
        }
    },
    computed: {
        ...mapGetters([
            'navigator',
            'fieldGroupType',
            'individualConfigInfo',
            'company',
            'formKey'
        ]),
        ...mapGetters('client', [
            'addEditSetList',
            'modifyEditSetList'
        ]),
        ...mapGetters('goods', [
            'currencyShow'
        ])
    },
    methods: {
        transExRate (from, to, val) { // 汇率转换
            console.log(from, to, val)
            let price = val || 1
            if (from && to) {
                if (this.currencyShow[from].cnyExRate) {
                    price = parseFloat(price) * parseFloat(this.currencyShow[from].cnyExRate)
                    if (this.currencyShow[to]) {
                        price = parseFloat(price) / parseFloat(this.currencyShow[to].cnyExRate)
                    }
                }
            }
            return parseFloat(price).toFixed(2)
        },
        updateFormKey (next) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_formKey).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    if (next) {
                        next(res.body.data.formKey)
                    }
                    this.set_formKey(res.body.data.formKey)
                } else {
                    if (next) {
                        next('', this.msg(res.body))
                    }
                    this.set_formKey('')
                }
            }, (res) => {
                if (next) {
                    next('', this.$t(this.Global.errorTitle))
                }
                this.set_formKey('')
            })
        },
        getFormKey (next) {
            if (this.formKey && this.formKey != '') {
                next(this.formKey)
            } else {
                this.updateFormKey(next)
            }
        },
        updateEditSetList,
        ...mapMutations('client', {
            SET_ROUTPARAMETERS: 'SET_ROUTPARAMETERS',
            set_modifyEditSetList: 'SET_MODIFYEDITSETLIST',
            set_addEditSetList: 'SET_ADDEDITSETLIST'
        }),
        ...mapMutations({
            set_formKey: 'SET_FORMKEY'
        }),
        // 进入系统 (选好企业进系统，统一调这里)
        async enterSystem (option) {
            let { company, localLanguage } = option
            let _this = this
            setStore('company', company) // 公司信息保存在本地
            setItem(_this.Global.accessToken, JSON.stringify(company.accessToken)) // 企业Token
            // 设置语言和区时
            let LanguageTimezone = await _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.personalsetting_put, {
                localLanguage
                // timeZone
            })
            if (LanguageTimezone.body.code !== _this.Global.RES_OK) {
                _this.$message.error(_this.msg(LanguageTimezone.body))
            }
            // 获取导航信息
            let navigator = await _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.navigator_get, { params: {} })
            if (navigator.body.code.toString() === _this.Global.RES_OK) {
                setStore('navigator', navigator.body.data)
                _this.$router.push('/') // 跳转进入系统
            } else {
                _this.$message.error(_this.msg(navigator.body))
            }
            // 记录登录日志
            this.$http.get(this.Global.baseURL + this.Global.api.v2.loginEnterprise, { params: { type: 'loginIn' } }).then((res) => {})
        },
        // 退出系统
        loginEnterprise () {
            // 记录退出日志
            this.$http.get(this.Global.baseURL + this.Global.api.v2.loginEnterprise, { params: { type: 'loginOut' } }).then((res) => {})
            // 在客户端内才会执行
            if (this.Global.isFMApp) {
                window.close()
            } else {
                let t1 = +new Date()
                clearCookiesStorege() // 清空Cookies Storege
                let t2 = +new Date()
                console.log(`clear cookie time:${t2 - t1}`)

                this.$router.push('/login')
                let t3 = +new Date()
                console.log(`router push time:${t3 - t2}`)

                if (runtime === 'prod') {
                    window.closeMXsocket()
                } else {
                    MXsocket.close()
                }
                let t4 = +new Date()
                console.log(`close socket time:${t4 - t3}`)

                window.AppLockScreen()
                let t5 = +new Date()
                console.log(`AppLockScreen time:${t5 - t4}`)
            }
        },
        // 控件数据拆分组件和组
        ControlsDataConvert (list) {
            let newLList = []
            let groupFirst = []
            list.forEach((element) => {
                // element.checkbox = (element.fieldCategory === 2);//是否启用
                if (element.fieldGroup !== 0) { // 判断是否是一个组
                    let isHave = false
                    let thisGroup = ''
                    groupFirst.forEach((item) => { // 判断这个组是否出现过，出现则在groupFirst里做个标记
                        if (item === element.fieldGroup) {
                            isHave = true
                            thisGroup = item // 记住这个组id
                        }
                    })
                    if (!isHave) { // 如果没有出现过新建一个对象放入newList里面
                        let newObj = {
                            fieldGroup: element.fieldGroup,
                            group: []
                        }
                        newObj.group.push(element)
                        newLList.push(newObj)
                        groupFirst.push(element.fieldGroup)
                    } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                        newLList.forEach(function(them) {
                            if (them.fieldGroup === thisGroup) {
                                them.group.push(element)
                            }
                        })
                    }
                } else {
                    if (element.controlTypeId !== 0) {
                        element.controlData = ''
                    }
                    newLList.push(element)
                }
            })
            newLList.forEach(item => {
                if (item.fieldGroup == 1) {
                    let itemList = [0, 1, 2, 3, 4]
                    let list = []
                    itemList.forEach((items, index) => {
                        item.group.forEach(element => {
                            if (index == 0 && element.fieldName == 'countryId') {
                                item.fieldId = element.fieldId
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                            }
                            if (index == 1 && element.fieldName == 'provinceId') {
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                            }
                            if (index == 2 && element.fieldName == 'cityId') {
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                            }
                            if (index == 3 && element.fieldName == 'townId') {
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                            }
                            if (index == 4 && element.fieldName == 'custAddr') {
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                            }
                        })
                    })
                    item.group = list
                }
                if (item.fieldGroup == 3) {
                    let itemList = [0, 1]
                    let list = []
                    itemList.forEach((items, index) => {
                        item.group.forEach(element => {
                            if (index == 0 && element.fieldName == 'ownerCtId') {
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                                item.fieldId = element.fieldId
                            }
                            if (index == 1 && element.fieldName == 'ownerDeptKey') {
                                let data = JSON.parse(JSON.stringify(element))
                                list.push(data)
                            }
                        })
                    })
                    item.group = list
                }
            })
            return newLList
        },
        // 获取moduleCode
        getRoute (url = '') {
            if (url === '') {
                url = this.$route.path
            }
            let Route = {}
            let uRiItems = this.navigator.uRiItems
            for (let item of uRiItems) {
                if (url.indexOf(item.uRI) !== -1) {
                    Route = item
                }
            }
            return Route
        },
        // 获取系统基础信息
        async getSystemBasicInfo (id) {
            let { data } = await this.$http.get(this.Global.baseURL + this.Global.api.v2.dictionary + id, { params: {} })
            return data
        },
        toClient_g (obj) { // 跳转客户列表
            let _this = this
            let { modelCode, interval, argument } = obj
            let timeType = 'createDate'
            if (obj.timeType === '2') {
                timeType = 'willInSeaDate'
            } else if (obj.timeType === '3') {
                timeType = 'lastTrackDate'
            };
            let data = argument
            let date = new Date()
            interval = interval + ''
            if (interval === '1') { // 本日
                data[timeType + '_gt'] = _this.$m_unifiedTime(date.toLocaleDateString())
                data[timeType + '_lt'] = _this.$m_unifiedTime(date.toLocaleDateString()).replace('00:00:00', '23:59:59')
            }
            if (interval === '2') { // 本周
                data[timeType + '_gt'] = getWeekStartDate(date)
                data[timeType + '_lt'] = getWeekEndDate(date).replace('00:00:00', '23:59:59')
            }

            if (interval === '3') { // 本月
                data[timeType + '_gt'] = _this.$m_unifiedTime(date.toLocaleDateString()).slice(0, 8) + '01 00:00:00'
                data[timeType + '_lt'] = _this.$m_unifiedTime(date.toLocaleDateString()).slice(0, 8) + mGetDate(date.getFullYear(), date.getMonth() + 1) + ' 23:59:59'
            }
            if (interval === '4') { // 本年
                data[timeType + '_gt'] = date.getFullYear() + '-01-01 00:00:00'
                data[timeType + '_lt'] = date.getFullYear() + '-12-' + mGetDate(date.getFullYear(), 12) + ' 23:59:59'
            }
            if (interval === '5') { // 去年
                data[timeType + '_gt'] = parseInt(date.getFullYear()) - 1 + '-01-01 00:00:00'
                data[timeType + '_lt'] = parseInt(date.getFullYear()) - 1 + '-12-' + mGetDate(date.getFullYear() - 1, 12) + ' 23:59:59'
            }
            if (interval === '6') { // 最近6月
                let date1 = new Date()
                date1.setMonth(date.getMonth() - 6)
                data[timeType + '_gt'] = _this.$m_unifiedTime(date1)
                data[timeType + '_lt'] = _this.$m_unifiedTime(date)
            }
            if (interval === '7') { // 最近12个月
                let date2 = new Date()
                date2.setMonth(date.getMonth() - 12)
                data[timeType + '_gt'] = _this.$m_unifiedTime(date2)
                data[timeType + '_lt'] = _this.$m_unifiedTime(date)
            }
            if (interval === '8') { // 全部

            }
            if (interval === 'a1') { // 7天内
                data[timeType + '_gt'] = _this.$m_unifiedTime(date)
                data[timeType + '_lt'] = _this.$m_unifiedTime(funDate(7))
            }
            if (interval === 'a2') { // 15天前
                data[timeType + '_lt'] = _this.$m_unifiedTime(funDate(-15))
            }
            if (interval === 'a3') { // 30天前
                data[timeType + '_lt'] = _this.$m_unifiedTime(funDate(-30))
            }
            this.SET_ROUTPARAMETERS(data)
            if (modelCode == 'PS001') {
                _this.$router.push('/main/am/Inquiries')
            } else {
                _this.$router.push('/main/client/tabs/list/' + modelCode)
            }

            // 获得本周的开始日期
            function getWeekStartDate (now) {
                let nowMonth = now.getMonth() // 当前月
                let nowYear = now.getFullYear() // 当前年
                let nowDayOfWeek = now.getDay() // 今天本周的第几天
                let nowDay = now.getDate() // 当前日
                let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
                return _this.$m_unifiedTime(weekStartDate)
            };
            // 获得本周的结束日期
            function getWeekEndDate (now) {
                let nowMonth = now.getMonth() // 当前月
                let nowYear = now.getFullYear() // 当前年
                let nowDayOfWeek = now.getDay() // 今天本周的第几天
                let nowDay = now.getDate() // 当前日
                let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
                return _this.$m_unifiedTime(weekEndDate)
            };

            function mGetDate (year, month) {
                var d = new Date(year, month, 0)
                return d.getDate()
            };

            function funDate (aa) { // 获取多少天前后的日期
                let date1 = new Date()
                let date2 = new Date(date1)
                date2.setDate(date1.getDate() + aa)
                return date2
            };
        },
        // 跳转到详情页
        clientDetailPage (item, type) {
            // let _this = this
            // 跳转到邮件
            if (item.moduleCode === 'EM001' && item.billId !== '0') {
                this.$router.push(`/main/mail/home/detail_${item.billId}_1`)
                ep.emit('openMailDetail', { mId: item.billId, boxId: 1 })
                return
            }
            // // 跳转到工单
            // if (item.moduleCode === 'WO001' && item.billId !== '0') {
            //   this.$router.push(`/main/client/tabs/workOrder/${item.moduleCode}/${item.billId}`)
            //   ep.emit('addWorkOrderDetailsTab', item)
            //   return
            // }
            // 跳转到反馈
            if (type && type == 11) {
                if (this.$route.path === '/main/systemset/feedback/detail/' + item.billId) {
                    ep.emit('upDateFeedbackDetail')
                } else {
                    this.$router.push(`/main/systemset/feedback/detail/${item.billId}`)
                }
                return
            }

            if (item.moduleCode && item.moduleCode != '0' && item.moduleCode != 'PS001' && item.billId != '0') {
                // _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, {
                //   params: {
                //     searchType: 'detail',
                //     moduleCode: item.moduleCode,
                //     identFieldValue: item.billId
                //   }
                // }).then(function (res) {
                //   if (res.body.code.toString() === _this.Global.RES_OK && res.body.data && _.isObject(res.body.data)) {
                //     let list = res.body.data
                let { moduleCode, billId } = item
                let viewName = 'list'
                if (item.delState == '0' && item.seasFlag == '0') {
                    viewName = 'list'
                } else if (item.delState == '1') {
                    viewName = 'recycle'
                } else if (item.seasFlag == '1') {
                    viewName = 'seas'
                }
                if (moduleCode == 'SC001' || moduleCode == 'SC002') {
                    this.$router.push('/main/sale/tabs/' + viewName + '/' + moduleCode + '/' + billId)
                } else {
                    this.$router.push('/main/client/tabs/' + viewName + '/' + moduleCode + '/' + billId)
                }
                ep.emit('listaddTab', Object.assign(item))
                //   } else {
                //     _this.$message.error(_this.msg(res.body))
                //   }
                // }, function (res) {
                //   _this.$message.error(_this.$t(_this.Global.errorTitle))
                // })
            }
            if (item.moduleCode && item.moduleCode == 'PS001') {
                this.$router.push('/main/am/Inquiries')
            }
        },
        // 返回组控件名称
        returnGroupName (fieldGroup) {
            let name = ''
            this.fieldGroupType.forEach(function(item) {
                if (fieldGroup === item.dictItemCode) {
                    name = item.itemName
                    return false
                }
            })
            return name
        },
        // 判断是否为关注单据
        isFocusBill (list) {
            if (!list) {
                return false
            }
            let isHave = false
            list.forEach(item => {
                if (item == this.company.ctId) {
                    isHave = true
                }
            })
            return isHave
        },
        // 获取accessToken
        getToken () {
            return getToken()
        },
        // 判断用户点击链接/按钮是否有权限访问，返回布尔值，不允许访问返回true,允许访问返回false
        isAccessAuthority (path) {
            let { uRIs } = this.navigator
            let isNext = false
            // 对动态路由拦截处理,/main/client/tabs/seas/BF001/index 需要截取掉/index
            if (path.indexOf('tabs') > -1) {
                let paths = path.split('/')
                if (paths.length = 7) {
                    paths.pop()
                }
                isNext = uRIs.indexOf(paths.join('/')) > -1
                // 对邮件模块处理
            } else if (path.indexOf('/main/mail') > -1 || path.indexOf('/feedback/detail') > -1) {
                isNext = true
            } else {
                isNext = uRIs.indexOf(path) > -1
            }
            return !isNext
        },
        downloadFile (url, data = {}) {
            let str = ''
            if (url.indexOf('?') === -1) {
                str = '?'
            } else {
                str = '&'
            }
            Object.assign(data, getToken())
            Object.keys(data).forEach(key => {
                str += key + '=' + data[key] + '&'
            })
            url = url + str
            url = url.substring(0, url.length - 1)
            downloadFile(url)
        },
        msg (data) {
            let _this = this
            if (data.lMsg && data.lMsg.key) {
                let d = {}
                if (data.lMsg.data) {
                    d = data.lMsg.data
                    Object.keys(d).forEach(key => {
                        if (d[key].toString().substring(0, 6) === 'const.') {
                            d[key] = _this.$t(d[key])
                        }
                    })
                }
                return _this.$t(data.lMsg.key, d)
            } else {
                return data.msg
            }
        },
        timeShow_custom (val, formatType, name) { // 展示时间转换方法，转换时区格式，普通使用
            if (name) {
                console.log(name)
            }
            if (!val || val == '') {
                return ''
            }
            return this.$m_utcOffset(val, { timezone: this.individualConfigInfo.timeZone }).format(formatType || this.individualConfigInfo.dateFormat.toLocaleUpperCase() + ' ' + this.individualConfigInfo.timeFormat)
        },
        timeShow_customized (val, option = {}) { // 展示时间转换方法，转换时区格式，定制使用
            let config = Object.assign({
                just: this.$t('mxpcweb.plugin.vue-moment.1531796526483'),
                minuteFront: this.$t('mxpcweb.plugin.vue-moment.1531796548653'),
                yesterday: this.$t('mxpcweb.plugin.vue-moment.1531796570054'),
                daybefore: this.$t('mxpcweb.plugin.vue-moment.1531796583883'),
                monthFront: this.$t('mxpcweb.plugin.vue-moment.1531796593106'),
                yearFront: this.$t('mxpcweb.plugin.vue-moment.1531796602130')
            }, option)
            return this.$m_formulateTime(val, config)
        },
        // 消息跳转
        msgJump (item) {
            // console.log('jjjjjj')
            if (!item.msgSubType) { return }
            switch (item.msgSubType) {
                case 5:
                case 6:
                case 7:
                case 9:
                case 10:
                case 13:
                    this.$router.push('/main/mail/home/index') // 邮件
                    break
                case 11:
                    this.$router.push('/main/systemset/feedback/detail/' + item.billId) // 反馈
                    break
                case 1:
                case 2:
                case 3:
                case 8:
                case 15:
                    switch (item.moduleCode) {
                        case 'EM001':
                            this.$router.push('/main/mail/home/detail_' + item.billId + '_0_0')
                            break
                        case 'BF003':
                            this.$router.push('/main/client/tabs/list/' + item.moduleCode)
                            break
                        default:
                            this.clientDetailPage(item, item.msgSubType)
                    }
                    break
                case 4:
                    ep.emit('editMaterialShow', item) // 新员工分配角色弹窗
                    break
                case 12:
                    ep.emit('openUpload', true) // 任务列表
                    break
                case 14:
                    let id = item.billId
                    let url = '/main/systemset/systembulletin?noticeId=' + id
                    this.$router.push(url) // 版本公告（跳转）
                    break
                case 18:
                    let itemUrl = '/main/sale/tabs/list/' + item.moduleCode
                    if (item.billId && item.billId != '') {
                        itemUrl += '/' + item.billId
                    }
                    this.$router.push(itemUrl)
                    break
                case 19:
                case 20:
                    this.$router.push('/main/sale/tabs/list/' + item.moduleCode)
                    break
                case 21:
                    this.$router.push('/main/mx/orderManage')
                    break
                default:
                    this.$message.error('New type. Please tell the administrator')
            }
        },
        // 商品链接
        getGoodsLink (spuId, noShare) {
            let { cId } = this.company
            let host = window.location.host
            let domain = window.location.protocol + '//' + host
            if (window.runtime === 'prod' && !noShare) {
                // domain = 'https://mx.im'
                domain = 'https://goods.im'
            }
            if (!noShare) {
                return domain + '/pc/goods/detail?cId=' + goodsEncrypt(cId + '') + '&id=' + goodsEncrypt(spuId + '') + '&opCtId=' + goodsEncrypt(this.company.ctId + '')
            }
            return domain + '/pc/goods/detail?cId=' + goodsEncrypt(cId + '') + '&id=' + goodsEncrypt(spuId + '')
        },
        // 目录链接
        getGoodsCatalogLink (noShare) {
            let { cId } = this.company
            let host = window.location.host
            let domain = window.location.protocol + '//' + host
            if (window.runtime === 'prod' && !noShare) {
                // domain = 'https://mx.im'
                domain = 'https://goods.im'
            }
            return domain + '/pc/goods/list?cId=' + goodsEncrypt(cId + '')
        },
        openNewWindowTab (url, options = {}) {
            if (!url) { return false }
            let reg = new RegExp(/^(HTTP|HTTPS):\/\//i)
            url = reg.test(url) ? url : 'http://' + url
            if (this.Global.isFMApp) {
                let paramsKey = Object.keys(options)
                if (paramsKey.length > 0) {
                    url += url.indexOf('?') < 0 ? '?' : '&'
                    let str = ''
                    paramsKey.forEach(key => {
                        str += '&' + key + '=' + options[key]
                    })
                    url += str ? str.substring(1) : ''
                }
                window.openlink(url)
            } else {
                window.open(url, '_blank')
            }
        },
        /**
         * 全局图片URL
         * id为：文件或图片id
         * config有：
         *  200x200（截取） 或
         *  200x200s（截取） 或
         *  orig（原生大小）
         *  */
        getGlobalImgSrc (id, config) {
            if (!id || id === '') {
                return 'https://sf.fumamx.com/img/orig/3,31e390ebcbc1' // 头像
            } else {
                let size = (!config || config === '') ? 'orig' : config
                return this.Global.imgBaseSrc + size + '/' + id
            }
        }
    }
}
