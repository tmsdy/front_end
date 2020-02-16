<template>

    <footer class="footer">
            <span class="todo-count">
                <strong>{{count}}</strong>
                <span> </span>
                <span>项未完成</span>
            </span>
        <ul class="filters">
            <li @click="changeShowType(0)">
                <a href="javascript:;" :class="{selected: showType==0}">所有</a>
            </li>
            <span> </span>
            <li @click="changeShowType(1)">
                <a href="javascript:;" :class="{selected: showType==1}">未完成</a>
            </li>
            <span> </span>
            <li @click="changeShowType(2)">
                <a href="javascript:;" :class="{selected: showType==2}">已完成</a>
            </li>
        </ul>
        <button class="clear-completed" @click="removeAllCompleted" >清除已完成</button>

    </footer>

</template>

<script>
    export default {
        name: "todo-footer",
        props: {
            count: {
                type: Number,
                default: 0
            },
            showType: {
                type: Number,
                default: 0
            }
        },
        methods: {
            removeAllCompleted() {
                this.$emit('removeAllCompleted');
            },
            changeShowType(newValue) {
                this.$emit('changeShowType', newValue);
            }
        }
    }
</script>
