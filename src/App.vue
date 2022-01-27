<template>
    <div id="app">
        <!-- 路由占位符 -->
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    components: {},
};
</script>

<style>
/* 卡片视图区域样式 */
.el-breadcrumb {
    font-size: 12px !important;
    margin-bottom: 15px;
}
/* 搜索与添加区域样式 */
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
