<template>
    <div class="FoldersTree">
        <router-link v-for="(menuItem ,menuIndex) in list" tag="div" :to="menuItem.uRI" class="treeBar" :key="menuIndex">
            <div class="title" @click="menuItem.viewType=='list'?treeItemClick(menuItem.moduleCode):''">
                <i v-if="menuItem.viewType=='list'" class="iconfont iconThis folderIocn" :class="[isOpenFolder[menuItem.moduleCode]? 'icon-minus':'icon-plus-file']"> </i>
                <i v-else class="iconfont iconThis" :class="menuItem.iconURI"> </i>
                <span>{{menuItem.display}}</span>
                <div v-if="menuItem.viewType=='list'" class="btnAdd" @click.stop="createFloder(menuItem.moduleCode)">
                    <i class="iconfont icon-plus-file"></i>
                </div>
            </div>
            <ul v-if="menuItem.moduleCode&&menuItem.viewType=='list'" v-show="isOpenFolder[menuItem.moduleCode]" class="D_tree">
                <tree-menu v-for="(item,index) in myShareTree[menuItem.moduleCode]" @set="handleSet" :nowIndex="index" :treeData="item" :moduleCode="menuItem.moduleCode" :thisTree="myShareTree[menuItem.moduleCode]" :key="index"></tree-menu>
            </ul>
        </router-link>
        <folder-tools ref="folderTools"> </folder-tools>
        <power-dialog ref="powerDialog"></power-dialog>
    </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import FolderTools from './../FolderTools'
import PowerDialog from './../PowerDialog'
import { deleteFolder } from './../docUtils.js'
export default {
    name: 'FoldersTree',
    props: ['list'],
    data() {
        return {
            isOpenFolder: { 'DC001': false, 'DC002': false }, // 我的工具，展开开关
            myShareTree: { 'DC001': [], 'DC002': [] },
            menuNavList: []
        }
    },
    created() {
        this.getFolders('DC001')
        this.getFolders('DC002')
    },
    mounted() {
        let _this = this
        ep.tail('getPuFolders', function (data) {
            _this.getFolders('DC001')
        })
        ep.tail('getMyFolders', function (data) {
            _this.getFolders('DC002')
        })
    },
    computed: {},
    methods: {
        deleteFolder,
        handleSet(data) {
            let { type, params } = data
            switch (type) {
                case 'new':
                    this._newFolder(params)
                    break
                case 'put':
                    this._editFolder(params)
                    break
                case 'del':
                    this._deleteFoler(params)
                    break
                case 'power':
                    this._setFolderPower(params)
                    break
                default:
                    break
            }
        },
        _isPuFolder(moduleCode) {
            return moduleCode === 'DC001'
        },
        _isMyFolder(moduleCode) {
            return moduleCode === 'DC002'
        },
        _reloadDoc(moduleCode) {
            if (this._isPuFolder(moduleCode)) {
                ep.emit('getPuDoc')
            }
            if (this._isMyFolder(moduleCode)) {
                ep.emit('getMyDoc')
            }
        },
        _reNameFolder(moduleCode, newFolder) {
            if (this._isPuFolder(moduleCode)) {
                ep.emit('reNamePuFolder', newFolder)
            }
            if (this._isMyFolder(moduleCode)) {
                ep.emit('reNameMyFolder', newFolder)
            }
        },
        _delBackFolder(moduleCode, treeData) {
            if (this._isPuFolder(moduleCode)) {
                ep.emit('delBackPuFolder', treeData)
            }
            if (this._isMyFolder(moduleCode)) {
                ep.emit('delBackMyFolder', treeData)
            }
        },
        _newFolder({ parFolderId, folderType, folderSource, moduleCode }) {
            this.$refs.folderTools.new({ parFolderId, folderType, folderSource, moduleCode }, () => {
                this.getFolders(moduleCode)
                this._reloadDoc(moduleCode)
            })
        },
        _editFolder({ targetFolderId, folderType, moduleCode }) {
            this.$refs.folderTools.put({
                targetFolderId,
                folderType,
                moduleCode
            }, newFolder => {
                this.getFolders(moduleCode)
                this._reNameFolder(moduleCode, newFolder)
            })
        },
        _deleteFoler({ folderId, folderName, folderType, moduleCode, treeData }) {
            this.deleteFolder(folderId, folderName, folderType, moduleCode, () => {
                this.getFolders(moduleCode)
                this._delBackFolder(moduleCode, treeData)
            })
        },
        _setFolderPower({ folderId }) {
            this.$refs.powerDialog.open(folderId)
        },
        createFloder(Code) {
            let newfolder = {
                moduleCode: Code
            }

            if (Code === 'DC001') {
                newfolder.folderSource = 1
                newfolder.parFolderId = 1
                newfolder.folderType = 2 /* 共享空间 */
            } else {
                newfolder.folderSource = 2
                newfolder.parFolderId = 2
                newfolder.folderType = 1 /* 文件夹 */
            }
            this._newFolder(newfolder)
        },
        getFolders(code) {
            var url = this.Global.baseURL + this.Global.api.v2.folders_foldersTree
            let folderSource
            if (code == 'DC001') {
                folderSource = 1
            }
            if (code == 'DC002') {
                folderSource = 2
            }
            let data = {
                params: {
                    folderSource
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.myShareTree[code] = res.body.data
                    } else {
                        this.myShareTree[code] = []
                    }
                })
                .catch(err => {
                    this.myShareTree[code] = []
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        treeItemClick(moduleCode) {
            this.isOpenFolder[moduleCode] = !this.isOpenFolder[moduleCode]
            if (moduleCode == 'DC001') {
                ep.emit('changePuFolder')
            } else if (moduleCode == 'DC002') {
                ep.emit('changeMyFolder')
            }
        }
    },
    watch: {

    },
    components: {
        'tree-menu': TreeMenu,
        'folder-tools': FolderTools,
        'power-dialog': PowerDialog
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
