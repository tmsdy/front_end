<template>
    <div class="senderClass">
        <span> {{Detail.dispalyName}}</span>
        <span>|</span>
        <span>显示名称：</span>
        <span v-if="!edt">{{Detail.sendName}}</span>
        <span v-if="edt"><input class="inputclass" type="text" @blur="changeName($event,index)" :value="Detail.sendName"></span>
        <span v-if="!edt" @click="edt=true">
            <i class="iconfont icon-edit-square"></i>
        </span>
        <span>
            <i class="iconfont icon-close" @click.stop="senderRemove(index,Detail)"></i>
        </span>
    </div>
</template>
<script>
export default {
    name: 'SenderComponent',
    props: {
        Detail: {
            type: Object,
            default: () => { }
        },
        index: {
            type: Number,
            default: () => -1
        },
        show: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            edt: false,
            displayName: ''

        }
    },
    computed: {

    },
    created() {

    },
    mounted() {
    },
    methods: {
        changeName(e, index) {
            this.edt = false
            if (this.show == 1) {
                this.$emit('changeName', e.target.value, index)
            } else {
                console.log('sssss')
                this.$emit('changeName', e.target.value, index)
            }
        },
        senderRemove(index, Detail) {
            if (this.show == 1) {
                this.$emit('senderRemove', Detail, 1)
            } else {
                this.$emit('senderRemove', index, Detail)
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.senderClass {
    margin-top: 3px;
  > span,
  i {
    font-size: 10px;
    margin-right: 2px;
  }
  .inputclass {
    width: 45px;
  }
}
</style>
