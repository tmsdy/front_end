<template>
    <div class="MenuNav">
        <ul class="menuBox" v-for="(item,index) in list" :key="index">
            <router-link tag="li" :to="uRI+item.folderId" :data-href="item.uRI" class="menuItem" v-if="item.name">
                <div class="itemTitle">
                    <span class="text" :title="item.name">{{item.name}}</span>
                    <!-- 系统报表不能移动和编辑名称 -->
                    <span class="T_set" v-if="item.folderId!=1&&item.folderId!=2&&item.folderId!=3">
                        <i class="iconfont icon-move-up" @click="MoveUp(index,item.folderId);stopAction($event)"></i>
                        <i class="iconfont icon-move-down" @click="MoveDown(index,item.folderId);stopAction($event)"></i>
                        <i class="iconfont icon-del" @click="DelItem(item.folderId);stopAction($event)"></i>
                        <i class="iconfont icon-edit-single" @click="EditName(item);stopAction($event)"></i>
                    </span>
                </div>
            </router-link>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'MenuNav',
    props: {
        list: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            uRI: '/main/customReport/list/'
        }
    },
    created() {

    },
    methods: {
        // 停止冒泡
        stopAction(e) {
            e.stopPropagation()
        },
        // twoleveOpen(event, list) {
        //     if (list.length === 0) {
        //         return
        //     }
        //     let $target = $(event.target)
        //     let isOpen = $target.attr('data-isOpen')
        //     if (isOpen === 'no') {
        //         $target.attr('data-isOpen', 'yes')
        //         $target.next().show()
        //         $target.find('.pull-right').removeClass('icon-page-down').addClass('icon-page-right')
        //         // this.$router.push(list[0].uRI);
        //     } else if (isOpen === 'yes') {
        //         $target.attr('data-isOpen', 'no')
        //         $target.next().hide()
        //         // $target.find(".icon-arrow-right").removeClass("arrow-right90");
        //         $target.find('.pull-right').removeClass('icon-page-right').addClass('icon-page-down')
        //     }
        // },
        MoveUp(x, id) {
            if (x <= 3) {
                this.$message.error('当前已在最顶端！')
            } else {
                let targetFolderId = this.list[x - 1].folderId
                this.$emit('move', id, targetFolderId)
            }
        },
        MoveDown(x, id) {
            if (x >= this.list.length - 1) {
                this.$message.error('当前已在最底端！')
            } else {
                let targetFolderId = this.list[x + 1].folderId
                this.$emit('move', id, targetFolderId)
            }
        },
        EditName(x) {
            // 编辑这行的信息传到父组件
            this.$emit('editName', x)
        },
        DelItem(id) {
            this.$emit('delItem', id)
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.MenuNav {
    // border: 1px solid red;
    position: relative;
    margin-top: 8px;
    ul.menuBox {
        width: 100%;
        position: relative;
        li.menuItem {
            position: relative;
            .itemTitle {
                height: 32px;
                line-height: 32px;
                color: #626066;
                margin-bottom: 5px;
                border-left: 2px solid transparent;
                position: relative;
                z-index: 2;
                padding-left: 15px;
                span.T_set {
                    display: none;
                    position: absolute;
                    top: 50%;
                    margin-top: -16px;
                    right: 10px;
                    z-index: 2;
                    > i.iconfont {
                        display: inline-block;
                        padding: 0;
                        font-size: 13px;
                        &:hover {
                            color: #d0021b;
                            cursor: pointer;
                        }
                    }
                    .el-dropdown {
                        i.iconfont {
                            font-size: 13px;
                            font-weight: bold;
                        }
                    }
                }
                .text {
                    // border: 1px solid red;
                    display: inline-block;
                    max-width: 150px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    position: relative;
                    z-index: -1;
                }
                .pull-right {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    margin-right: 8px;
                    overflow: hidden;
                    color: #909399;
                }
                // .arrow-right90 {
                //     transform: rotate(90deg);
                //     -ms-transform: rotate(90deg);
                //     -moz-transform: rotate(90deg);
                //     -webkit-transform: rotate(90deg);
                //     -o-transform: rotate(90deg);
                // }
            }
            .itemTitle:hover,
            &.router-link-active .itemTitle {
                background: rgba(208, 2, 27, 0.05);
                border-left-color: #d0021b;
                cursor: pointer;
                .text {
                    color: #d0021b;
                }
                span.T_set {
                    display: block;
                }
            }
        }
    }
}
</style>
