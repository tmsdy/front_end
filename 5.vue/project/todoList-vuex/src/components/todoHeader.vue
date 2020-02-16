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
                this.$store.dispatch('postNewTask', {title: this.newValue}).then(response => {
                    this.newValue = '';
                }).catch(err => {
                    alert('添加失败：' + err.data.data);
                });
            }
        }
    }
</script>
