<template>
    <div class="users-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入搜索的内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽 会覆盖prop -->
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userStateChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                        <!-- 修改按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            circle
                            @click="showEditDialog(scope.row.id)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            circle
                            @click="removeUserById(scope.row.id)"
                        ></el-button>
                        <!-- 分配角色按钮 添加消息提示 -->
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                circle
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <!-- 内容主体区域 -->
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <!-- 内容主体区域 -->
            <el-form
                :model="editForm"
                :rules="addFormRules"
                ref="editFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editUserInfo">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Users",
    data() {
        //验证邮箱的规则
        let checkEmail = (rule, value, callback) => {
            //验证邮箱的正则表达式
            const regEmail =
                /(^$)|^((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/;
            if (regEmail.test(value)) {
                //合法的邮箱
                return callback();
            }
            callback(new Error("请输入合法的邮箱"));
        };
        //验证手机号的规则
        let checkMobile = (rule, value, callback) => {
            //验证手机号的正则表达式
            const regMobile = /(^$)|^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
            if (regMobile.test(value)) {
                return callback();
            }
            callback(new Error("请输入合法的手机号"));
        };
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: "",
                //当前页数
                pagenum: 1,
                pagesize: 2,
            },
            userList: [],
            total: 0,
            //控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            //添加用户的表单数据
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            //查询到的用户的信息对象
            editForm: {},
            //添加表单的验证规则对象
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 10,
                        message: "用户的长队在3-10个字符之间",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 15,
                        message: "密码的长度在6-15个字符之间",
                        trigger: "blur",
                    },
                ],
                email: [
                    //添加自定义的验证邮箱规则
                    {
                        validator: checkEmail,
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"],
                    },
                ],
                mobile: [
                    //添加自定义的验证手机号规则
                    {
                        validator: checkMobile,
                        message: "请输入正确的手机号",
                        trigger: ["blur", "change"],
                    },
                ],
            },
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: result } = await this.$http.get("users", {
                params: this.queryInfo,
            });
            if (result.meta.status !== 200)
                return this.$message.error("获取用户列表失败！");
            this.userList = result.data.users;
            this.total = result.data.total;
            console.log(result);
        },
        //监听 pagesize (每页显示条数) 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            //再次发送请求，获取数据
            this.getUserList();
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        //监听switch开关状态的改变
        async userStateChange(userinfo) {
            // console.log(userinfo.mg_state);
            //发送请求进行状态修改
            const { data: result } = await this.$http.put(
                `users/${userinfo.id}/state/${userinfo.mg_state}`
            );
            if (result.meta.status !== 200) {
                //修改无效，保持原样
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error("更新用户状态失败");
            }
            this.$message.success("更新用户状态成功");
        },
        // 监听添加用户对话框的关系事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        //添加用户和检验
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                //发起添加用户的网络请求
                const { data: result } = await this.$http.post(
                    "users",
                    this.addForm
                );
                if (result.meta.status !== 201) {
                    this.$message.error(result.meta.msg);
                    //隐藏添加用户的对话框
                    this.addDialogVisible = false;
                    return;
                }
                this.$message.success("添加用户成功");
                this.addDialogVisible = false;
                //重新获取列表数据
                this.getUserList();
            });
        },
        //展示编辑用户的对话框
        async showEditDialog(id) {
            this.editDialogVisible = true;
            const { data: result } = await this.$http.get("users/" + id);
            console.log(result);
            if (result.meta.status !== 200) {
                return this.$message("查询用户信息失败！");
            }
            this.editForm = result.data;
        },
        //监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        //修改用户信息，并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async (vali) => {
                if (!vali) return;
                //发起修改用户信息的数据请求
                const { data: result } = await this.$http.put(
                    "users/" + this.editForm.id,
                    { email: this.editForm.email, mobile: this.editForm.mobile }
                );
                if (result.meta.status !== 200) {
                    return this.$message.error("更新用户失败");
                }
                //关闭对话框
                this.editDialogVisible = false;
                //重新获取用户列表
                this.getUserList();
                //提示修改成功
                this.$message.success("更新用户信息成功");
            });
        },
        //根据id删除对应的用户信息
        async removeUserById(id) {
            //弹框提示用户是否删除数据
            const confirmResult = await this.$confirm(
                "此操作将永久删除改用户，是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((error) => error);
            if (confirmResult !== "confirm") {
                return this.$message.info("已经取消删除");
            }
            const { data: result } = await this.$http.delete("users/" + id);
            if (result.meta.status !== 200) {
                return this.$message.error("删除用户失败");
            }
            this.$message.success("删除用户成功");
            this.getUserList();
        },
    },
};
</script>

<style scoped>
/* 卡片视图区域样式 */
.el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
}
/* 搜索与添加区域样式 */
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
/* 用户展示区域样式 */
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
</style>