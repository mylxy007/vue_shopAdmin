<template>
    <!-- 面包屑导航区域 -->
    <div class="rigths_container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rigthsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    label="权限名称"
                    prop="authName"
                ></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag
                            type="success"
                            v-else-if="scope.row.level === '1'"
                            >二级</el-tag
                        >
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Rights",
    data() {
        return {
            // 权限列表
            rigthsList: [],
        };
    },
    created() {
        //获取所有的权限
        this.getRightsList();
    },
    methods: {
        async getRightsList() {
            //发送请求，获取权限列表数据
            const { data: result } = await this.$http.get("rights/list");
            if (result.meta.status !== 200) {
                return this.$message.error("获取权限列表失败");
            }
            this.rigthsList = result.data;
            this.$message.success("获取权限列表成功");
            console.log(this.rigthsList);
        },
    },
};
</script>

<style >
</style>