<template>

    <section class="main">
        <input class="toggle-all" @change="toggleAll" type="checkbox" />

        <todo-list :data="data" @toggle="toggle" @remove="remove"></todo-list>

    </section>

</template>

<script>
    import todoList from '@/components/todoList'

    export default {
        name: "todo-main",
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        components: {
            todoList
        },
        methods: {
            toggle(itemId) {
                // console.log('我没有权限修改，给我父亲吧')
                this.$emit('toggle', itemId);
            },
            toggleAll(e) {
                this.$emit('toggleAll', e.target.checked);
            },
            remove(itemId) {
                this.$emit('remove', itemId);
            }
        }
    }
</script>
