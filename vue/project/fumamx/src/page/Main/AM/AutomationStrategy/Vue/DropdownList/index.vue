<template>
    <div class="DropdownList">
        <transition name="el-zoom-in-top">
            <div v-show="isOpen" class="dropdown">
                <ul class="dropdownBox">
                    <li v-for="(value,key) in typeList" @click="selType(key)" :key="key">
                        {{value}}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'DropdownList',
    data() {
        return {
            isOpen: false,
            typeList: {
                1: '邮件通知',
                2: '提醒',
                //   3: '短信',
                4: '字段更新',
                5: '标签'
                //   6: 'webhook',
                //   7: '函数'
            }
        }
    },
    created() {

    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen
        },
        close() {
            this.isOpen = false
        },
        selType(key) {
            this.isOpen = false
            this.$emit('select', key)
        }
    },
    components: {}
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
