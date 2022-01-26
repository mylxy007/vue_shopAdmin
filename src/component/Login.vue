<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/images/avatar.jpg" alt="" />
            </div>
            <el-form
                label-width="0px"
                class="login_form"
                :model="loginForm"
                :rules="loginFormRules"
                ref="loginFormRef"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        prefix-icon="el-icon-user"
                        v-model="loginForm.username"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                        prefix-icon="el-icon-lock"
                        v-model="loginForm.password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            // 登录表单的数据绑定对象
            loginForm: {
                username: "admin",
                password: "123456",
            },
            loginFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入登录名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 5,
                        message: "长度在 3 到 5 个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入登录密码",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 15,
                        message: "长度在 6 到 15 个字符",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        //点击重置按钮，重置登录表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            //判断登录表单的验证是否全部通过
            //validate函数的参数是一个回调函数，有两个值，1.是否通过，boolean， 2.未通过的字段，对象
            this.$refs.loginFormRef.validate(async (vali) => {
                // vali为布尔值，通过为true
                if (!vali) return;
                //发送请求
                const { data: result } = await this.$http.post(
                    "/login",
                    this.loginForm
                );
                if (result.meta.status !== 200)
                    return this.$message.error("登录失败");
                this.$message.success("登录成功");
                console.log(result);
                // 将登陆成功后得到的token保存到客户端的sessionStorage中
                sessionStorage.setItem("token", result.data.token);
                //跳转到 Home 组件
                this.$router.push("/home");
            });
        },
    },
};
</script>

<style>
.login_container {
    background-color: #409eff;
    height: 100%;
}
/* 登录盒子 */
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
/* 头像样式 */
.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
}
img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}
/* 登录表单样式 */
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>