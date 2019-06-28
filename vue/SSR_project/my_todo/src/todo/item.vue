<template>
    <div :class="['todo-item',todo.completed?'completed':'']">
        <input type="checkbox" class="toggle" v-model="todo.completed">

        <label ref="m-label" @click="busItemClick">{{todo.content}}</label>
        <button class="destroy" @click="deleteTodo"></button>
    </div>
</template>

<script>
// v-model="todo.completed" 在checkbox来控制它的checked状态
import Bus from '../bus.js'
export default {
    props: {
        todo: {
            type: Object,
            require: true
        }
    },
    methods: {
        busItemClick() {
            Bus.$emit('itemClick', { num: 123 })
        },
        deleteTodo() {
            this.$emit('del', this.todo.id)
        }
    }
}
</script>

<style lang="less" scoped>
@rem: 30rem;
.todo-item {
    position: relative;
    background-color: #fff;
    font-size: 24 / @rem;
    border-bottom: 1 / @rem solid rgba(0, 0, 0, 0.06);
    &:hover {
        .destroy:after {
            content: "×";
        }
    }
    label {
        white-space: pre-line;
        word-break: break-all;
        padding: 15 / @rem 60 / @rem 15 / @rem 15 / @rem;
        margin-left: 45 / @rem;
        display: block;
        line-height: 1.2;
        transition: color 0.4s;
    }
    &.completed {
        label {
            color: #d9d9d9;
            text-decoration: line-through;
        }
    }
}
.toggle {
    text-align: center;
    width: 40 / @rem;
    height: 40 / @rem;
    line-height: 40 / @rem;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    appearance: none;
    outline: none;
    padding-left: 5 / @rem;
    cursor: pointer;
    &:after {
        content: url("../assets/images/round.svg");
    }
    &:checked:after {
        content: url("../assets/images/done.svg");
    }
}
.destroy {
    position: absolute;
    top: 0;
    right: 10 / @rem;
    bottom: 0;
    width: 40 / @rem;
    height: 40 / @rem;
    margin: auto 0;
    font-size: 30 / @rem;
    color: #cc9a9a;
    margin-bottom: 11 / @rem;
    transition: color 0.2s ease-out;
    background-color: transparent;
    appearance: none;
    border-width: 0;
    cursor: pointer;
    outline: none;
}
</style>
