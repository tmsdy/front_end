<template>

    <section class="main">
        <input class="toggle-all" />

        <todo-list></todo-list>

    </section>

</template>

<script>
    import todoList from '@/components/todoList'

    export default {
        name: "todo-main",
        components: {
            todoList
        }
    }
</script>
