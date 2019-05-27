<template>
    <div class="roleMembers MXscroll">
        <!-- 共有<span class="text-red">{0}</span>名成员  -->
        <div class="font12" v-if="roleMembers.length > 0" v-html="$t('mxpcweb.systemset.rolemanag.1530694948595',[roleMembers.length])">

        </div>
        <!-- 没有成员 -->
        <!-- 立即添加 -->
        <no-data v-if="noDataShow" v-on:noDataClick='roleMemberAddClick' icon="icon-role-set" :title="$t('mxpcweb.systemset.rolemanag.1530598678180')" :btnText="$t('mxpcweb.systemset.rolemanag.1530598703925')"></no-data>
        <div v-if="!noDataShow" class="addRoleBox">

            <el-tag v-for="(item,index) in roleMembers" :key="index" :closable="true" @close="roleMemberDel(item.ctId,item.realName)" :close-transition="false">
                {{item.realName}}
            </el-tag>
            <!-- 请输入名字搜索 -->
            <el-autocomplete style="height:200px;" v-show="inputVisible" v-model="inputValue" ref="saveTagInput" :fetch-suggestions="querySearchAsync" :placeholder="$t('mxpcweb.systemset.rolemanag.1530598733100')" @select="handleSelect" size="small" icon="search" :autofocus="autofocus"></el-autocomplete>

            <el-button v-show="!inputVisible" class="button-new-tag" size="small" @click="showInput">
                <!--  + 添加成员+ 添加成员 -->{{$t('mxpcweb.systemset.rolemanag.1530598758659')}}</el-button>
        </div>

    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import { isArray, isNumber } from '@/libs/utils'
export default {
    name: 'roleMembers',
    props: {
        roleId: { // 角色ID
            type: Number,
            required: true,
            default: 0
        }
    },
    data() {
        return {
            autofocus: false, // 人员框焦点
            noDataShow: true, // 空数据是否出现
            restaurants: [],
            timeout: null,
            roleMembers: [],
            inputVisible: false, // 人员框
            inputValue: ''
        }
    },
    created() {
    },
    mounted() {
        this.getData(this.roleId) // 获取角色对应成员
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    methods: {
        // 设置固定高
        getWinHeight() {
            let height = document.documentElement.clientHeight - 230
            this.$el.style.height = `${height}px`
        },
        // 获取角色对应成员
        getData(clickRoleId) {
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.rolemanag.rolesContacts, { params: { id: clickRoleId, type: 'in' } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.roleMembers = res.body.data
                    if (res.body.data.length > 0) {
                        _this.noDataShow = false
                    } else {
                        _this.noDataShow = true
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 添加成员点击
        roleMemberAddClick() {
            this.noDataShow = false
            this.inputVisible = true
            this.autofocus = true
        },
        // 搜索人员
        querySearchAsync(queryString, cb) {
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.rolemanag.rolesContacts, { params: { id: _this.roleId, type: 'notin' } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    let newArr = res.body.data
                    for (var i = 0; i < newArr.length; i++) {
                        newArr[i].value = newArr[i].realName
                    }
                    var restaurants = newArr
                    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        cb(results)
                    }, 5)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.indexOf(queryString.toLowerCase()) === 0)
            }
        },
        handleSelect(item) {
            let _this = this
            this.inputVisible = false
            this.inputValue = ''
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesContactsPost, { roleId: _this.roleId, ctId: item.ctId }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.getData(this.roleId) // 获取角色对应成员
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

        // 文本框出现
        showInput() {
            let _this = this
            _this.inputVisible = true
            _this.autofocus = true
            // 点击其他隐藏
            document.addEventListener('click', (e) => {
                if (!this.$el.contains(e.target)) {
                    _this.inputVisible = false
                    _this.autofocus = false
                }
            })
        },

        // 删除对应成员
        roleMemberDel(ctId, realName) {
            // 先检查该成员所属角色有几个，仅有1个时，给出提示msg，当然也可以删除
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.rolemanag.rolesContacts, { params: { id: _this.roleId, type: 'cntr', ctId: ctId } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isNumber(res.body.data)) {
                    let msg
                    if (res.body.data > 1) {
                        /* 确定从该角色中移除人员【 */
                        /* 】吗 */
                        msg = this.$t('mxpcweb.systemset.rolemanag.1530598814260', [realName])
                    } else {
                        /* 人员【 */

                        /* 】这次移除后会没有任何角色了，将无法进入系统，确定移除吗？ */

                        msg = this.$t('mxpcweb.systemset.rolemanag.1530598877652', [realName])
                    }
                    _this.$confirm(msg, this.$t('mxpcweb.systemset.rolemanag.1530595863629'), {
                        confirmButtonText: this.$t('mxpcweb.systemset.rolemanag.1530595915980'),
                        cancelButtonText: this.$t('mxpcweb.systemset.rolemanag.1530595955452'),
                        type: 'warning'
                    }).then(() => {
                        _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesContactsDelete, { roleId: _this.roleId, ctId: ctId }).then(function (res) {
                            if (res.body.code.toString() == _this.Global.RES_OK) {
                                /* 删除成功 */
                                _this.$message.success(this.$t('mxpcweb.systemset.rolemanag.1530596003455'))
                                _this.getData(_this.roleId) // 获取角色对应成员
                            } else {
                                _this.$message.error(_this.msg(res.body))
                            }
                        }, function (res) {
                            _this.$message.error(_this.$t(_this.Global.errorTitle))
                        })
                    }).catch(() => {

                    })
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
        roleId(curVal, oldVal) {
            this.getData(curVal) // 获取角色对应成员
        }
    },
    components: {
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.roleMembers {
  .addRoleBox {
    // border:1px solid red;
    margin-top: 15px;
    // margin-left:-3px;
    .el-tag {
      // border:1px solid red;
      height: 32px;
      line-height: 32px;
      min-width: 84px;
      background: #c0c4cc;
      border-radius: 3px;
      padding-left: 10px;
      margin-right: 15px;
      margin-bottom: 12px;
      transform: scale(1);
      -webkit-transform: scale(1);
    }
    .el-autocomplete {
      width: 150px;
    }
    .el-button {
      position: relative;
      top: -1px;
    }
  }
}
</style>
