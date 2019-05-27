<template>
    <li>
        <template v-if="!isSub">
            <h3 :id="`folder${treeData.folderId}`" @click="treeItemClick(1,$event)">
                <i v-if="isFolder" class="iconfont folderListIcon" :class="[open? 'icon-page-down':'icon-page-right']"> </i>

                <i v-else class="folderListIcon iconfont " :class="spaceOrFolder"> </i>
                <span class="label">
                    <span class="labelColor">{{treeData.folderName}}</span>
                </span>
                <span class="D_set">
                    <i class="iconfont icon-move-up" @click.stop="move('up')"></i>
                    <i class="iconfont icon-move-down" @click.stop="move('down')"></i>
                    <el-dropdown @click.native.stop menu-align="start" trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link text-hover">
                            <i class="iconfont icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="treeData.folderType==2&&treeData.spaceAdmin==1" command="power">
                                <!--  本空间权限 -->
                                {{$t('mxpcweb.document.global.1529398769543')}}
                            </el-dropdown-item>

                            <el-dropdown-item command="put">
                                <!-- "修改本空间":"修改文件夹" -->
                                {{treeData.folderType==2?$t('mxpcweb.document.global.1529398828488'):$t('mxpcweb.document.global.1529397577160')}}
                            </el-dropdown-item>

                            <el-dropdown-item command="del">
                                <!-- 删除本空间:删除文件夹-->
                                {{treeData.folderType==2?$t('mxpcweb.document.global.1529398902966'):$t('mxpcweb.document.global.1529397601656')}}
                            </el-dropdown-item>

                            <el-dropdown-item command="new">
                                <!-- "新建文件夹":"新建子文件夹" -->
                                {{treeData.folderType==2?$t('mxpcweb.document.global.1529397554878'):$t('mxpcweb.document.global.1529398996928')}}
                            </el-dropdown-item>

                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </h3>
            <ul v-if="isFolder" v-show="open" class="D_tree">
                <tree-menu v-for="(item,index) in treeData.childList" @set="handleSet" :treeData="item" :nowIndex="index" :moduleCode="moduleCode" :thisTree="treeData.childList" :key="item.folderId"></tree-menu>
            </ul>

        </template>
        <template v-if="isSub">
            <h3 @click="treeData.staffFlag?treeItemClick(3,$event):treeItemClick(2,$event)" :class="{'hasAvatarImg':!isFolder}">
                <i v-if="isFolder" class="folderListIcon iconfont" :class="[open? 'icon-page-down':'icon-page-right']"> </i>
                <img v-else class="avatarImg" v-imgsrc="avatarImg" data-initsrc="/static/images/noAvatar.png" />
                <span class="label">
                    <span v-if="treeData.staffFlag" class="labelColor">
                        <!-- 下属文档 -->{{$t('mxpcweb.document.my.1531101087323')}}
                    </span>
                    <span v-else class="labelColor">{{treeData.realName}}</span>
                </span>
            </h3>
            <ul v-if="isFolder" v-show="open" class="D_tree">
                <tree-menu v-for="(item,index) in treeData.suborStaffList" :key="item.ctid" :treeData="item" :nowIndex="index" :moduleCode="moduleCode" :thisTree="treeData.suborStaffList"></tree-menu>
            </ul>
        </template>

    </li>
</template>

<script>
/*
 * Discription:
 * -----
 * Created Date: 2018-06-14 06:24:38
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: 2019-05-18 04:54:33
 * Modified By: name (email)
 */

export default {
    name: 'treeMenu',
    props: ['treeData', 'thisTree', 'nowIndex', 'moduleCode'],
    data() {
        return {
            open: false,
            folderSource: 0
        }
    },
    mounted() {
        if (this.moduleCode == 'DC001') {
            this.folderSource = 1
        }
        if (this.moduleCode == 'DC002') {
            this.folderSource = 2
        }
    },
    computed: {
        avatarImg() {
            if (this.treeData.avatar) {
                return this.getGlobalImgSrc(this.treeData.avatar, '24x24')
            } else {
                return '/static/images/noAvatar.png'
            }
        },
        isFolder() {
            return (this.treeData.childList && this.treeData.childList.length > 0) || (this.treeData.suborStaffList && this.treeData.suborStaffList.length > 0)
        },
        spaceOrFolder() {
            return this.treeData.folderType == 2 ? 'icon-space-close' : 'icon-folder-solid'
        },
        peopleOrFolder() {
            return this.treeData.staffFlag
                ? 'icon-groups'
                : 'icon-avatar'
        },
        isSub() {
            return this.treeData.staffFlag || this.treeData.ctId
        },
        isPuFolder() {
            return this.moduleCode == 'DC001'
        },
        isMyFolder() {
            return this.moduleCode == 'DC002'
        }

    },
    methods: {

        _reloadFolders() {
            if (this.isPuFolder) {
                ep.emit('getPuFolders')
            }
            if (this.isMyFolder) {
                ep.emit('getMyFolders')
            }
        },

        handleSet(data) {
            this.$emit('set', data)
        },
        handleCommand(command, event) {
            let { folderId, folderType, folderName } = this.treeData
            switch (command) {
                case 'new':
                    this.$emit('set', {
                        type: 'new',
                        params: {
                            parFolderId: folderId,
                            folderType: 1,
                            folderSource: this.folderSource,
                            moduleCode: this.moduleCode
                        }
                    })
                    break
                case 'put':
                    this.$emit('set', {
                        type: 'put',
                        params: {
                            targetFolderId: folderId,
                            folderType: folderType,
                            moduleCode: this.moduleCode
                        }
                    })
                    break
                case 'del':
                    this.$emit('set', {
                        type: 'del',
                        params: {
                            folderId,
                            folderName,
                            folderType,
                            moduleCode: this.moduleCode,
                            treeData: this.treeData
                        }
                    })
                    break
                case 'power':
                    this.$emit('set', { type: 'power', params: { folderId } })
                    break

                default:
                    break
            }
            /* if (command === 'new') {
                this.$refs.newDialogref.new({
                    parFolderId: folderId,
                    folderType: 1,
                    folderSource: this.folderSource,
                    moduleCode: this.moduleCode
                }, () => {
                    this._reloadFolders()
                    this._reloadDoc()
                })
                return
            }
            if (command === 'put') {
                this.$refs.newDialogref.put({
                    targetFolderId: folderId,
                    folderType: folderType,
                    moduleCode: this.moduleCode
                }, newFolder => {
                    this._reloadFolders()
                    this._reNameFolder(newFolder)
                })
                return
            }
            if (command === 'del') {
                this.deleteFolder(folderId, folderName, folderType, this.moduleCode, () => {
                    this._reloadFolders()
                    this._delBackFolder()
                })
                return
            }
            if (command === 'power') {
                this.$refs.qxDialogref.open(folderId)
            } */
        },
        /* 传方向up /down  来做上下移动操作 */
        move(direction) {
            let data = {
                targetFolderId: this.treeData.folderId,
                folderType: this.treeData.folderType,
                moduleCode: this.moduleCode
            }
            let errorTishi = ''
            if (direction === 'up') {
                if (this.nowIndex === 0) {
                    /* 当前已经是第一个！ */
                    this.$message.error(this.$t('mxpcweb.document.global.1529399067577'))
                    return
                }
                data = Object.assign(data, {
                    preFolderId: this.thisTree[this.nowIndex - 1].folderId
                })
                /* 上移失败 */
                errorTishi = this.$t('mxpcweb.document.global.1529399102263')
            }

            if (direction === 'down') {
                if (this.nowIndex === this.thisTree.length - 1) {
                    /* 当前已经是最后一个！ */
                    this.$message.error(this.$t('mxpcweb.document.global.1529399137510'))
                    return
                }
                if ((this.nowIndex === this.thisTree.length - 2) && (!this.thisTree[this.nowIndex + 1].folderId)) {
                    /* 当前已经是最后一个！ */
                    this.$message.error(this.$t('mxpcweb.document.global.1529399137510'))

                    return
                }
                data = Object.assign(data, {
                    sufFolderId: this.thisTree[this.nowIndex + 1].folderId
                })
                /* 下移失败 */
                errorTishi = this.$t('mxpcweb.document.global.1529399197872')
            }

            let url = this.Global.baseURL + this.Global.api.v2.folders_foldersTree
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /* 移动成功 */
                        this.$message.success(this.$t('mxpcweb.document.global.1529399221079'))
                        this._reloadFolders()
                    } else {
                        this.$message.error(errorTishi)
                    }
                }).catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },

        // 点击文件夹项item高亮
        treeItemClick(type, e) {
            if (this.isFolder) {
                this.open = !this.open
            }
            let event = window.event || e

            let $this = $(event.target || event.srcElement)
            $this.parents('.treeBar').find('.active').removeClass('active')

            let tag = (event.target || event.srcElement).tagName
            if (tag === 'H3') {
                $this.addClass('active')
            } else {
                $this.parents('h3').addClass('active')
            }

            if (type == 1) {
                if (this.isPuFolder) {
                    ep.emit('changePuFolder', this.treeData)
                }
                if (this.isMyFolder) {
                    ep.emit('changeMyFolder', this.treeData)
                }
            } else if (type == 2) {
                /* 此处是人员列表的 */
                ep.emit('toMyStaffFolder', this.treeData)
            }
        }

    },

    components: {}
}

</script>
