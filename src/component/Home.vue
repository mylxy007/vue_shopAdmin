<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/images/heima.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <button type="info" @click="logout">退出</button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 左边侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="rgb(64, 158, 255)"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <!-- 一级菜单下有二级菜单，用submenu -->
                    <el-submenu
                        v-for="item in menuList"
                        :key="item.id"
                        :index="item.id + ''"
                    >
                        <!-- 这个 template 是一级菜单的内容模板 -->
                        <template slot="title">
                            <!-- 通过不同的id设置不同的图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <el-menu-item
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            :index="'/' + subItem.path"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <i class="el-icon-menu"></i>
                            <span>{{ subItem.authName }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            //左侧菜单数据
            menuList: [],
            //一级菜单，图标对象
            iconObj: {
                125: "el-icon-s-custom",
                103: "el-icon-s-check",
                101: "el-icon-s-goods",
                102: "el-icon-s-order",
                145: "el-icon-s-marketing",
            },
            //显示隐藏控制
            isCollapse: false,
        };
    },
    //组件创建后，立即获取数据
    created() {
        this.getMenuList();
        this.activePath = sessionStorage.getItem("activePath");
        console.log(this.activePath);
    },
    methods: {
        async getMenuList() {
            // 获取左侧菜单列表数据
            const { data: result } = await this.$http.get("/menus");
            if (result.meta.status !== 200)
                return this.$message.error(result.meta.msg);
            this.menuList = result.data;
            console.log(result);
        },
        //退出登录
        logout() {
            //清空 token
            sessionStorage.clear();
            //强制跳转到登录页面
            this.$router.push("/login");
            this.$message.warning("已退出");
        },
        //左侧菜单栏显示/隐藏切换
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath) {
            sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        },
    },
};
</script>

<style scoped>
/* 整体框架样式 */

.home_container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
}
.el-aside {
    background-color: #333744;
}
.el-main {
    background-color: #eaedf1;
}
/* 头部样式 */
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    background-color: #373d41;
    color: #fff;
    font-size: 20px;
}
.el-header > div {
    display: flex;
    align-items: center;
}

.el-header > div > span {
    margin-left: 15px;
}
.el-header > div > img {
    width: 65px;
    height: 60px;
}
/* 左侧菜单样式 */
.el-menu {
    border-right: none;
}
/* 侧边栏菜单切换按钮样式 */
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: rgb(144, 147, 153);
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>