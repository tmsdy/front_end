<template>

    <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="添加一个新任务" v-model="newValue" @keydown.enter="addNewTask" />
    </header>

</template>

<script>
    export default {
        name: "todo-header",
        data() {
            return {
                newValue: ''
            }
        },
        methods: {
            addNewTask() {
                // console.log(this.newValue);
                this.$emit('add', this.newValue);
                this.newValue = '';
            }
        }
    }
</script>
