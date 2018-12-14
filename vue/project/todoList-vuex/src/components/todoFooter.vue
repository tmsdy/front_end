<template>

    <footer class="footer">
            <span class="todo-count">
                <strong>count</strong>
                <span> </span>
                <span>项未完成</span>
            </span>
        <ul class="filters">
            <li>
                <a href="javascript:;">所有</a>
            </li>
            <span> </span>
            <li>
                <a href="javascript:;">未完成</a>
            </li>
            <span> </span>
            <li>
                <a href="javascript:;">已完成</a>
            </li>
        </ul>
        <button class="clear-completed">清除已完成</button>

    </footer>

</template>

<script>
    export default {
        name: "todo-footer"
    }
</script>
