<template>
    <ul class="todo-list">

        <li
            v-for="item of data"
            :key="item.id"
            :class="{completed: item.completed}"
        >
            <div class="view">
                <input class="toggle" type="checkbox" :checked="item.completed" @change="toggle(item.id)" />
                <label>{{item.title}}</label>
                <button @click="remove(item.id)" class="destroy"></button>
            </div>
        </li>

    </ul>
</template>

<script>
    export default {
        name: "todo-list",
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        methods: {
            toggle(itemId) {
                // console.log('toggle')
                this.$emit('toggle', itemId);
            },
            remove(itemId) {
                this.$emit('remove', itemId);
            }
        }
    }
</script>
