<template>
    <div v-show="dialogVisible">
        <!-- 权限设置 -->
        <el-dialog class="PowerDialog" :title="$t('mxpcweb.document.global.1529396584520')" :before-close="beforeClose" :visible.sync="dialogVisible" size="large">

            <div v-if="qxTableIsLoading" class="loadingBox">
                <loading></loading>
            </div>

            <el-table height="300" v-else :data="qxData" border style="width:100%; font-size:12px">
                <!-- 共享给 -->
                <el-table-column :label="$t('mxpcweb.document.global.1529396648625')">
                    <template slot-scope="scope">
                        {{scope.row[0].objectName}}
                    </template>
                </el-table-column>
                <!-- 对象类型 -->
                <el-table-column :label="$t('mxpcweb.document.global.1529396703855')">
                    <template slot-scope="scope">
                        {{objectTypeName(scope.row[0].objectType)}}
                    </template>
                </el-table-column>

                <el-table-column v-for="(item,index) in tableFormat" :label="item" :key="index">
                    <template slot-scope="scope">
                        <div v-show="scope.row[index].rightValue==1" class="iconfont icon-hook myqxSelect" @click="changeQxItem(scope.row,index,0)"></div>
                        <div v-show="scope.row[index].rightValue==0" class="myqxSelect" @click="changeQxItem(scope.row,index,1)"></div>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column :label="$t('mxpcweb.document.global.1529396729638')">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="deleteQxObject(scope.$index,scope.row[0])">
                            <!-- 删除 -->
                            {{$t('mxpcweb.document.global.1529396771400')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-if="page.total>page.size" layout="prev, pager, next" :total="page.total">
            </el-pagination>
            <div class="fnBox">
                <!-- 如需要增加“共享给”对象，请选择 -->{{$t('mxpcweb.document.global.1529396806213')}}：
                <div>
                    <!-- 添加人员 -->
                    <el-button @click="selQxObject(1)">{{$t('mxpcweb.document.global.1529396828358')}}</el-button>
                    <!-- 添加部门 -->
                    <el-button @click="selQxObject(2)">{{$t('mxpcweb.document.global.1529396872808')}}</el-button>
                    <!-- 添加角色 -->
                    <el-button @click="selQxObject(3)">{{$t('mxpcweb.document.global.1529396899927')}}</el-button>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <div class="pull-left  qxBottomText">
                    <!-- 注： 目录管理员具有最大权限可对本共享目录 设置权限，修改目录名和目录下的文件夹及文档一切权限-->
                    <span>{{$t('mxpcweb.document.global.1529397062919')}}：</span>{{$t('mxpcweb.document.global.1529397112226')}}
                </div>
                <!-- 退出 -->
                <el-button @click="dialogClose">{{$t('mxpcweb.document.global.1529397154646')}}</el-button>
                <!-- 确定 -->
                <el-button type="primary" @click="setRights">{{$t('mxpcweb.document.global.1529397179241')}}</el-button>
            </div>
        </el-dialog>

        <!-- 部门dialog -->
        <el-dialog :title="selTableTitle" :visible.sync="selTableVisible" custom-class="width420" size="small">
            <loading v-show="selTableIsLoading"></loading>
            <el-form v-show="!selTableIsLoading">
                <!-- 添加共享对象 -->
                <el-form-item :label="$t('mxpcweb.document.global.1529397230126')">
                    <!-- 请选择 -->
                    <!--  <el-select v-model="objectId" :placeholder="$t('mxpcweb.document.global.1529397283730')" label-width="120px">
                        <template v-for="(item,index) in selData">
                            <el-option v-if="objectType==1" :label="item.realName" :value="item.companies[0].ctId" :key="index" :disabled="isDisabled(item.companies[0].ctId)"></el-option>
                            <el-option v-if="objectType==2" :label="item.deptName" :value="item.dkey" :key="index" :disabled="isDisabled(item.dkey)"></el-option>
                            <el-option v-if="objectType==3" :label="item.roleName" :value="item.roleId" :key="index" :disabled="isDisabled(item.roleId)"></el-option>
                        </template>
                    </el-select> -->
                    <drop-search v-model="objectId" :list='selData' :labelKey='labelKey' :valueKey='valueKey' :getDisabled="isDisabled" needSearch></drop-search>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- 取消 -->
                <el-button @click="selTableVisible=false">{{$t('mxpcweb.document.global.1529397347341')}}</el-button>
                <!-- 确定 -->
                <el-button type="primary" @click="addQxObject">{{$t('mxpcweb.document.global.1529397179241')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

/**
 * 描述：知识库权限管理弹框
 * 作者：郭兵
 * 时间：2018-4-8
 *
 */
import Loading from '@/basecomponents/Loading/index.vue'
import DropSearch from '@/components/DropSearch'
// import { mapGetters } from 'vuex'
export default {
    name: 'PowerDialog',
    data() {
        return {
            dialogVisible: false,
            /* ["目录管理员", "读取文档", "上传文档", "修改文档", "删除文档", "下载文档", "新建文件夹", "修改文件夹", "删除文件夹"] */
            tableFormat: Object.freeze([
                this.$t('mxpcweb.document.global.1529397391422'),
                this.$t('mxpcweb.document.global.1529397434783'),
                this.$t('mxpcweb.document.global.1529397458687'),
                this.$t('mxpcweb.document.global.1529397480361'),
                this.$t('mxpcweb.document.global.1529397508750'),
                this.$t('mxpcweb.document.global.1529397533158'),
                this.$t('mxpcweb.document.global.1529397554878'),
                this.$t('mxpcweb.document.global.1529397577160'),
                this.$t('mxpcweb.document.global.1529397601656')
            ]),
            /*  "请选择" */
            selTableTitle: this.$t('mxpcweb.document.global.1529397283730'),
            qxTableIsLoading: false,
            selTableIsLoading: false,
            selTableVisible: false,
            selData: [],
            objectId: '',
            objectType: 1,
            folderId: 0,
            qxData: [],
            changeMap: new Map(),
            newObjEditFlag: {},
            page: {
                total: 0,
                pageN: 0,
                pageSize: 10
            }
        }
    },
    mounted() {

    },
    computed: {
        labelKey() {
            let key = ''
            switch (this.objectType) {
                case 1:
                    key = 'realName'
                    break
                case 2:
                    key = 'deptName'
                    break
                case 3:
                    key = 'roleName'
                    break
                default:
                    break
            }
            return key
        },
        valueKey() {
            let key = ''
            switch (this.objectType) {
                case 1:
                    key = 'ctId'
                    break
                case 2:
                    key = 'dkey'
                    break
                case 3:
                    key = 'roleId'
                    break
                default:
                    break
            }
            return key
        }
    },
    methods: {
        _isDisabled(objectId) {
            let disabled = false
            this.qxData.forEach(item => {
                if (item[0].objectType == this.objectType && item[0].objectId == objectId) {
                    disabled = true
                }
            })
            return disabled
        },
        isDisabled(obj) {
            let disabled = false
            this.qxData.forEach(item => {
                if (item[0].objectType == this.objectType && item[0].objectId == obj[this.valueKey]) {
                    disabled = true
                }
            })
            return disabled
        },
        open(folderId) {
            this.folderId = folderId
            /* 加载权限数据 */
            this.changeMap.clear()
            this.newObjEditFlag = {}
            this.getRights()
        },
        dialogClose() {
            this.beforeClose(() => {
                this.dialogVisible = false
            })
        },
        beforeClose(done) {
            let newObjIsEdit = Object.keys(this.newObjEditFlag).map(key => this.newObjEditFlag[key]).includes(false)
            if (newObjIsEdit) {
                /* 存在新增对象未设置！ */
                this.$message.info(this.$t('mxpcweb.document.global.1529397683374'))
                return false
            }

            let rightsArray = [...this.changeMap.values()]
            if (rightsArray.length > 0) {
                /* "有未保存项" */
                this.$message.info(this.$t('mxpcweb.document.global.1529397712956'))
                return
            }
            /* 关闭前刷新一下列表 */
            this._reload()
            done()
        },
        _reload() {
            ep.emit('getPuDoc')
            ep.emit('getPuFolders')
        },
        /* 对象类型返回 */
        objectTypeName(code) {
            if (code == 1) {
                /* 人员 */
                return this.$t('mxpcweb.document.global.1529397779724')
            } else if (code == 2) {
                return this.$t('mxpcweb.document.global.1529397814080')
            } else if (code == 3) {
                return this.$t('mxpcweb.document.global.1529397843646')
            } else {
                /* 未知 */
                return this.$t('mxpcweb.document.global.1529397870848')
            }
        },

        selQxObject(type) {
            this.selData = []

            this.objectType = type
            this.selTableVisible = true
            this.objectId = ''
            /* 根据type不同分别请求员工、角色、部门 */
            switch (type) {
                case 1:
                    let arr = [].concat(this.$store.state.contactValue)
                    let newArr = []
                    arr.forEach(item => {
                        if (item.realName) {
                            newArr.push(Object.assign({}, item))
                        }
                    })
                    this.selData = Object.freeze(newArr)
                    break
                case 2:
                    this.getDepartments()
                    break
                case 3:
                    this.getRoles()
                    break
            }
        },

        /* 选择对象后的权限初始化 */
        addQxObject() {
            if (this.objectId == '') {
                /* 没有选择 */
                this.$message.error(this.$t('mxpcweb.document.global.1529397905656'))
                return
            }
            let url = this.Global.baseURL + this.Global.api.v2.folders_folderRights
            let data = {
                folderId: this.folderId,
                objectId: this.objectId,
                objectType: this.objectType
            }
            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /* 添加成功 */
                        this.$message.success(this.$t('mxpcweb.document.global.1529397938602'))
                        this.newObjEditFlag[`${this.objectType}&${this.objectId}`] = false
                        this.getRights()
                    }
                    this.selTableVisible = false
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },

        changeQxItem(obj, index, val) {
            let item = obj[index]
            if (item.rightValue == val) {
                return
            }
            item.rightValue = val
            let rightItem = {
                'rightValue': item.rightValue,
                'objectId': item.objectId,
                'objectType': item.objectType,
                'funType': item.funType,
                'funCode': item.funCode
            }
            let key = `${item.objectType}&${item.objectId}&${item.funCode}`
            if (this.changeMap.has(key)) {
                this.changeMap.delete(key)
            } else {
                this.changeMap.set(key, rightItem)
            }

            this._setNewObjEditFlag(item)

            /* 大量选项显示上的逻辑 */
            /* 目录管理员选中时候将其他的都选上 */
            if (index == 0 && val == 1) {
                obj.forEach((element, idx) => {
                    this.changeQxItem(obj, idx, 1)
                })
            }

            /* 非目录管理员选项取消时候移除目录管理员 */
            if (index != 1 && val == 0) {
                this.changeQxItem(obj, 0, 0)
            }

            /* 2、3、4、5分别对应文档的上传、修改、删除、导出 */
            let docQxArr = [2, 3, 4, 5]
            if (docQxArr.includes(index) && val == 1) {
                this.changeQxItem(obj, 1, 1)
            }
            /* 读取文档选项取消时候  文档的几个操作都取消 */
            if (index == 1 && val == 0) {
                docQxArr.forEach(element => {
                    this.changeQxItem(obj, element, 0)
                })
            }
        },
        _setNewObjEditFlag(item) {
            let key = `${item.objectType}&${item.objectId}`
            let re = new RegExp(`^${key}&`)

            let keys = Object.keys(this.newObjEditFlag)
            if (keys.includes(key)) {
                let arr = [...this.changeMap.keys()].filter(k => re.test(k))
                if (arr.length > 0) {
                    this.newObjEditFlag[key] = true
                } else {
                    this.newObjEditFlag[key] = false
                }
            }
        },

        _delNewObjEditFlag(item) {
            let key = `${item.objectType}&${item.objectId}`

            let keys = Object.keys(this.newObjEditFlag)
            if (keys.includes(key)) {
                delete this.newObjEditFlag[key]
            }
        },
        /* 删除一行 */
        deleteQxObject(index, item) {
            let url = this.Global.baseURL + this.Global.api.v2.folders_folderRights
            let data = {
                body: {
                    folderId: item.folderId,
                    objectId: item.objectId,
                    objectType: item.objectType
                }
            }
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /* 删除成功 */
                        this.$message.success(this.$t('mxpcweb.document.global.1529397970175'))
                        /* 看之前的操作是否包含这一行并删除 */
                        this._delChange(item)
                        this._delNewObjEditFlag(item)
                        this.getRights()
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        /* 删除某一行的时候需要把改行做的操作删除掉 */
        _delChange(item) {
            /* 正则拼接确保和 map 的set的格式保持一直 */
            let re = new RegExp(`^${item.objectType}&${item.objectId}&`);
            [...this.changeMap.keys()].forEach(key => {
                if (re.test(key)) {
                    this.changeMap.delete(key)
                }
            })
        },
        setRights() {
            let rightsArray = [...this.changeMap.values()]
            if (rightsArray.length == 0) {
                /* 没做任何更改 */
                this.$message.info(this.$t('mxpcweb.document.global.1529397998660'))
                return
            }

            let newObjIsEdit = Object.keys(this.newObjEditFlag).map(key => this.newObjEditFlag[key]).includes(false)

            if (newObjIsEdit) {
                this.$message.info(this.$t('mxpcweb.document.global.1529397683374'))
                return
            }
            // this.dialogVisible = false;
            let url = this.Global.baseURL + this.Global.api.v2.folders_folderRights
            let data = {
                folderId: this.folderId,
                rightsArray
            }
            this.changeMap.clear()

            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /* 修改成功 */
                        this.$message.success(this.$t('mxpcweb.document.global.1529398081837'))
                        ep.emit('getPuFolders')
                    } else {
                        this.getRights()
                        /* 修改失败 */
                        this.$message.error(this.$t('mxpcweb.document.global.1529398109559'))
                    }
                })
                .catch(err => {
                    this.getRights()
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        /* 获取权限列表 */
        getRights() {
            this.qxTableIsLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.folders_folderRights
            let data = {
                params: {
                    folderId: this.folderId
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.qxData = res.body.data.list
                        this.dialogVisible = true
                    } else {
                        // this.dialogVisible = false;
                        this.$message.error(this.msg(res.body))
                    }
                    this.qxTableIsLoading = false
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                    this.qxTableIsLoading = false
                })
        },

        /* 获取所有员工 */
        async getAccount() {
            this.selTableIsLoading = true
            try {
                let url = this.Global.baseURL + this.Global.api.v2.account_query
                let data = {
                    params: {
                        type: 'allUserList'
                    }
                }
                let res = await this.$http.get(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.selData = Object.freeze(res.body.data.accountList)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.selTableIsLoading = false
        },
        /* 获取所有角色 */
        async getRoles() {
            this.selTableIsLoading = true
            try {
                let url = this.Global.baseURL + this.Global.api.v2.roles + 'get'
                let data = {
                    params: {
                        type: 'all'
                    }
                }
                let res = await this.$http.get(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.selData = Object.freeze(res.body.data)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.selTableIsLoading = false
        },
        /* 获取所有部门 */
        async  getDepartments() {
            this.selTableIsLoading = true
            try {
                let url = this.Global.baseURL + this.Global.api.v2.department + '0'
                let res = await this.$http.get(url)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.selData = Object.freeze(res.body.data)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }

            this.selTableIsLoading = false
        }

    },
    watch: {
        qxData() {
            [...this.changeMap.keys()].forEach(key => {
                this.qxData.forEach(obj => {
                    for (let item of obj) {
                        let arr = key.split('&')
                        if (item.objectType == arr[0] && item.objectId == arr[1] && item.funCode == arr[2]) {
                            item.rightValue = this.changeMap.get(key).rightValue
                            break // 避免不必要的遍历
                        }
                    }
                })
            })
        }
    },
    components: {
        loading: Loading,
        'drop-search': DropSearch
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
