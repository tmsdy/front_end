<template>
    <li>
        <h3 @click="treeItemClick($event,treeData.id,treeData.label,treeData.AccountNmber)" :class="selectedBoxId.id==treeData.id?'active':''">
            <i v-if="isFolder" @click="toggle" class="iconfont" :class="[open ? 'icon-page-down': 'icon-page-right']"></i>
            <span class="label">
                <span class="labelColor" :style="setBgColor(treeData.bgColor)">{{treeData.label}}</span>
                <span class="T_set">
                    <i class="iconfont icon-move-up" @click="Move(myMailTree,RowIndex);stopAction($event)"></i>
                    <i class="iconfont icon-move-down" @click="Down(myMailTree,RowIndex);stopAction($event)"></i>
                    <span @click="stopAction($event)">
                        <el-dropdown menu-align="start" @command="handleCommand">
                            <span class="el-dropdown-link text-hover">
                                <i class="iconfont icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command='{name:"AddPeerFolder",treeData:treeData}'>{{$t('mxpcweb.mail.1528942063301')}}</el-dropdown-item>
                                <!-- 添加同级文件夹 -->
                                <el-dropdown-item :command='{name:"AddSublevelFolder",treeData:treeData }' v-if="treeData.boxType!=0||treeData.id==1||treeData.id==2">{{$t('mxpcweb.mail.1528942067023')}}</el-dropdown-item>
                                <!-- 添加子文件夹 -->
                                <el-dropdown-item :command='{name:"DleteFolder",treeData:treeData,RowIndex:RowIndex}' v-if="treeData.boxType==1">{{$t('mxpcweb.mail.1528942067259')}}</el-dropdown-item>
                                <!-- 删除文件夹 -->
                                <el-dropdown-item :command='{name:"UpdateFolder",treeData:treeData}'>{{$t('mxpcweb.mail.1528942067470')}}</el-dropdown-item>
                                <!-- 修改文件夹 -->
                                <el-dropdown-item :command='{name:"ClearTrash",treeData:treeData}' v-if="treeData.id==4">{{$t('mxpcweb.mail.1528942067702')}}</el-dropdown-item>
                                <!-- 全部归并 -->
                                <el-dropdown-item :command='{name:"AllMerge",treeData:treeData}' v-if="treeData.id==0">{{$t('mxpcweb.mail.1528702678326')}}</el-dropdown-item>
                                <!-- 清空回收站 -->
                                <el-dropdown-item :command='{name:"ClearDustbin",treeData:treeData}' v-if="treeData.id==5">{{$t('mxpcweb.mail.1528942067981')}}</el-dropdown-item>
                                <!--  清空垃圾箱-->
                                <el-dropdown-item :command='{name:"FoldersMoving",id:treeData.id}' v-if="treeData.boxType!=0">{{$t('mxpcweb.mail.1528942092292')}}</el-dropdown-item>
                                <!-- 移动到 -->
                                <el-dropdown-item :command='{name:"HandOverTo",id:treeData.id}' v-if="treeData.boxType!=0">{{$t('mxpcweb.mail.1528942092523')}}</el-dropdown-item>
                                <!-- 移交给 -->
                                <el-dropdown-item :command='{name:"ImportMail",treeData:treeData}'>{{$t('mxpcweb.mail.1528942092765')}}</el-dropdown-item>
                                <!-- 导入邮件 -->
                                <el-dropdown-item :command='{name:"Reading",id:treeData.id}'>{{$t('mxpcweb.mail.1528702491693')}} </el-dropdown-item>
                                <!-- 标记为已读 -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </span>
                <span class="labelCustmer" v-if="treeData.custId != 0" @click.stop="custSliderOpen(treeData.custId)">客</span>
                <span class="numTip" v-if="treeData.id==0&&AccountObject[treeData.id]!=undefined">
                    (
                    <span class="text-red" :id="treeData.id+'unRead'">{{AccountObject[treeData.id].unRead== undefined?0:AccountObject[treeData.id].unRead}}</span>/
                    <span :id="treeData.id+'total'">{{AccountObject[treeData.id].total== undefined?0:AccountObject[treeData.id].total}}</span>)
                </span>
                <span class="numTip" v-else>
                    <span :id="treeData.id" v-show="showGet(AccountObject[treeData.id])">
                        (<span class="text-red">{{AccountObject[treeData.id]==undefined?0:(AccountObject[treeData.id].unRead== undefined?0:AccountObject[treeData.id].unRead)}}</span>)

                    </span>
                </span>
            </span>
        </h3>
        <ul class="T_down" v-show="open" v-if="isFolder">
            <tree-menu v-for="(item,index) in treeData.children" :key="index" :treeData="item" :RowIndex="index" :myMailTree="treeData.children" :AccountObject="AccountObject"></tree-menu>
        </ul>
    </li>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
// import $ from 'jquery'
import { mapGetters, mapMutations } from 'vuex'
// import { tagsBgColor } from '@/libs/utils.js'
export default {
    name: 'treeMenu',
    props: ['myMailTree', 'treeData', 'RowIndex', 'AccountObject'],
    data() {
        return {
            open: true
        }
    },
    computed: {
        isFolder() {
            return this.treeData.children && this.treeData.children.length
        },
        ...mapGetters([
            'individualConfigInfo',
            'company'

        ]),
        ...mapGetters('mail', [
            'selectedBoxId',
            'subordinateCtid'
        ])
    },
    methods: {
        showGet(item) {
            if (item == undefined) {
                return false
            } else
                if (item.unRead == undefined) {
                    return false
                } else if (item.unRead > 0) {
                    return true
                } else {
                    return false
                }
        },
        async   GetRightsCheck(data) {
            let blg = false
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.targetCtid = this.subordinateCtid
            } else {
                data.targetCtid = this.company.ctId
            }
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetRightsCheck, {
                params: data
            })
            if (res.body.code.toString() == this.Global.RES_OK) {
                blg = true
            } else {
                this.$message.error(this.msg(res.body))
                blg = false
            }
            return blg
        },
        custSliderOpen(custId) {
            ep.emit('custSliderOpen', {
                mail: '',
                constId: custId
            })
        },

        isDialogPeer(treeData, type) {
            this.set_treemenu({ type: type, data: { treeData: treeData, myMailTree: this.myMailTree } })
        },
        // 点击文件夹项item高亮
        treeItemClick(event, id, name, AccountNmber) {
            ep.emit('mailTabIndex')
            if (id == this.selectedBoxId.id) {
                return
            }
            let $this = $(event.target)
            $this.parents('.navLeft').find('.active').removeClass('active')
            let tag = $this.nodeName
            if (tag === 'H3') {
                $this.addClass('active')
            } else {
                $this.parents('h3').addClass('active')
            }
            this.set_selectedBoxId({ 'id': id.toString(), 'SelectType': 'b', 'AccountNmber': AccountNmber, target: 'folder' })
            this.set_selectedBoxName(name)
        },
        // 文件夹背景色
        setBgColor(id) {
            let style = 'color:#fff;font-size: 12px;padding: 1px 9px; border-radius: 14px;background-color:'
            switch (id) {
                case 2:
                    return style + '#8BD867'
                    break
                case 3:
                    return style + '#909399'
                    break
                case 4:
                    return style + '#FD8EC4'
                    break
                case 5:
                    return style + '#FF7165'
                    break
                case 6:
                    return style + '#9B80F2'
                    break
                case 7:
                    return style + '#37CBE3'
                    break
                case 8:
                    return style + '#5EA3F6'
                    break
                case 9:
                    return style + '#BFBF17'
                    break
                case 10:
                    return style + '#FFB735'
                    break
                default:
                    return ''
            }
        },
        // 展开子菜单
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        async handleCommand(command) {
            let _this = this
            if (command.name == 'ClearTrash') { // 清空回收站
                _this.ClearTrash(_this.$t('mxpcweb.mail.1528970112284'), 4)
            } else if (command.name == 'DleteFolder') { // 删除文件夹
                _this.DleteFolder(command.treeData, command.RowIndex)
            } else if (command.name == 'AddPeerFolder') { // 添加同级文件夹
                _this.isDialogPeer(command.treeData, 'AddPeerFolder')
            } else if (command.name == 'AddSublevelFolder') { // 添加子级文件夹
                _this.isDialogPeer(command.treeData, 'AddSublevelFolder')
            } else if (command.name === 'UpdateFolder') { // 修改文件夹
                _this.isDialogPeer(command.treeData, 'UpdateFolder')
            } else if (command.name === 'FoldersMoving') { // 文件夹移动
                _this.set_typeMoving(command.id.toString())
            } else if (command.name == 'ClearDustbin') { // 清空垃圾箱
                _this.ClearTrash(_this.$t('mxpcweb.mail.1528970124335'), 5)
            } else if (command.name == 'HandOverTo') { // 文件夹移交给
                let blg = await this.GetRightsCheck({ 'optCode': 'otTransferFloder', 'moduleCode': 'EM001' })
                if (!blg) {
                    // this.$message.error("无权限！");
                    return
                }
                this.set_treemenu({ type: 'HandOverTo', data: { boxId: command.id, targetBoxId: -2, containSubBox: true } })
            } else if (command.name == 'ImportMail') {
                _this.isDialogPeer(command.treeData, 'ImportMail')
            } else if (command.name == 'AllMerge') { // 全部归并
                ep.emit('isDialogShow', 'open')
            } else { // 标记为已读
                let data = { 'status': '1', 'containSubBox': false, 'boxId': command.id }
                this.bulkUpdatePut(data)
            }
        },
        bulkUpdatePut(data) {
            let _this = this
            _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.bulkUpdatePut, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.set_refurbishBool(1)
                    _this.set_refurbishListBool(2)
                    _this.$message.success(_this.$t('mxpcweb.mail.1528970164799'))// 标记成功
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(res)
                }
            )
        },
        // 上移
        Move(dataObj, RIndex) {
            let _this = this
            if (RIndex == 0) {
                _this.$message(_this.$t('mxpcweb.mail.1528970183652'))// 已经是顶层了
            } else {
                let boxId = dataObj[RIndex].id
                let targetBoxId = dataObj[RIndex - 1].id
                let data = { ctid: _this.individualConfigInfo.ctId, action: 'move', boxId: boxId, targetBoxId: targetBoxId }
                if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                    data.ctid = this.subordinateCtid
                } else {
                    delete data.ctid
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxPut, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.set_refurbishBool(1)
                        _this.$message.success(_this.$t('mxpcweb.mail.1528970201662'))// 上移成功
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(res)
                    }
                )
            }
        },
        // 下移
        Down(dataObj, RIndex) {
            let _this = this
            if (dataObj.length - 1 == RIndex) {
                _this.$message(_this.$t('mxpcweb.mail.1528970218976'))// 已经是底层了
            } else {
                let boxId = dataObj[RIndex].id
                let targetBoxId = dataObj[RIndex + 1].id
                let data = { ctid: _this.individualConfigInfo.ctId, action: 'move', boxId: boxId, targetBoxId: targetBoxId }
                if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                    data.ctid = this.subordinateCtid
                } else {
                    delete data.ctid
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxPut, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.set_refurbishBool(1)
                        _this.$message.success(_this.$t('mxpcweb.mail.1528970236647'))// 下移成功
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(res)
                    }
                )
            }
        }, // 删除文件夹
        DleteFolder(treeData, RIndex) {
            let _this = this
            let alterStr = _this.$t('mxpcweb.mail.1530078564493')// "您确定删除此文件夹吗？";
            if (treeData.children.length > 0) {
                alterStr = _this.$t('mxpcweb.mail.1530078574125')// "此项有子文件夹，确定要删除吗？";
            }
            // 提示
            _this.$confirm(alterStr, _this.$t('mxpcweb.mail.1528969862511'), {
                confirmButtonText: _this.$t('mxpcweb.mail.1528942374762'), // '确定',
                cancelButtonText: _this.$t('mxpcweb.mail.1528942364802'), // '取消',
                type: 'warning'
            }).then(() => {
                let boxpathStr = treeData.boxPath.split('/')
                let bay = false
                for (let i = 0; i < boxpathStr.length; i++) {
                    if (boxpathStr[i] == 4) {
                        bay = true
                        break
                    }
                }
                if (bay) { // 真正删除
                    let data = { ctid: _this.individualConfigInfo.ctId, boxId: treeData.id }
                    if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                        data.ctid = this.subordinateCtid
                    } else {
                        delete data.ctid
                    }
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxDelete, data).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.set_refurbishBool(1)
                            _this.$message.success(_this.$t('mxpcweb.mail.1528970342799'))// 删除成功
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                        function (res) {
                            _this.$message.error(res)
                        })
                } else { // 移入回收站
                    let data = { ctid: _this.individualConfigInfo.ctId, action: 'remove', boxId: treeData.id, targetBoxId: 4 }
                    if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                        data.ctid = this.subordinateCtid
                    } else {
                        delete data.ctid
                    }
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxPut, data).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.set_refurbishBool(1)
                            _this.$message.success(_this.$t('mxpcweb.mail.1528970342799'))// 删除成功
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                        function (res) {
                            _this.$message.error(res)
                        })
                }
            }).catch(() => {
                _this.$message.info(_this.$t('mxpcweb.mail.1528970377709'))// 已取消删除
            })
        }, // 清空回收站
        ClearTrash(tile, boxId) {
            let _this = this
            // 您确定要清空' + tile + '吗？
            _this.$confirm(_this.$t('mxpcweb.mail.1528970485112', { a: tile }), _this.$t('mxpcweb.mail.1528969862511'), {
                confirmButtonText: _this.$t('mxpcweb.mail.1528942374762'), // '确定',
                cancelButtonText: _this.$t('mxpcweb.mail.1528942364802'), // '取消',
                type: 'warning'
            }).then(() => {
                let data = { ctid: _this.individualConfigInfo.ctId, boxId: boxId }
                if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                    data.ctid = this.subordinateCtid
                } else {
                    delete data.ctid
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxDelete, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.set_refurbishBool(1)
                        _this.set_refurbishListBool(2)
                        _this.$message.success(_this.$t('mxpcweb.mail.1528970464983', { a: tile }))// '清空' + tile + '成功!'
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(res)
                    }
                )
            }).catch(() => {
                _this.$message.info(_this.$t('mxpcweb.mail.1528970444133'))// 已取消清空
            })
        },
        // 做Mutations对象映射。在其他方法中可直接调用mutations.js内的方法
        // 同步设置
        ...mapMutations('mail', {
            set_treemenu: 'SET_TREEMENU', // this.$store.commit('SET_PERSONALINFO')
            set_selectedBoxId: 'SET_SELECTEDBOXID',
            set_selectedBoxName: 'SET_SELECTEDBOXNAME',
            set_refurbishBool: 'SET_REFURBISHBOOL',
            set_typeMoving: 'SET_TYPEMOVING',
            set_refurbishListBool: 'SET_REFURBISHLISTBOOL'

        }),
        // 停止冒泡
        stopAction(e) {
            e.stopPropagation()
        }
    }

}
</script>
