<template>
    <el-row :gutter="15" class="m-header">
        <el-col :span="6">
            <geo />
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">111</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">111</div></el-col>
    </el-row>
</template>

<script>
import Geo from './geo.vue'
export default {
    comments:{
        Geo
    }
}
</script>

<style lang="scss">

</style>
