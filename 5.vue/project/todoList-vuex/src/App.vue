<template>
    <div id="app">

        <section class="todoapp" id="todoApp">

            <todo-header></todo-header>

            <todo-main></todo-main>

            <todo-footer></todo-footer>

        </section>

    </div>
</template>

<script>
    import todoHeader from '@/components/todoHeader';
    import todoMain from '@/components/todoMain';
    import todoFooter from '@/components/todoFooter';

    export default {
        name: 'App',
        components: {
            todoHeader,
            todoMain,
            todoFooter
        },
        created() {
            // console.log(this.$store)
            // axios

            let rs = this.$store.dispatch('getAll')
            // rs.then(function () {
            //     console.log('then')
            // }).catch(err=> {
            //     alert(err);
            // })

        }
    }
</script>
