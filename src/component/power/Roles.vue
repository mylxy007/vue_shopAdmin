<template>
    <div class="roles_container">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button
                        type="primary"
                        @click="addRoleDialogVisible = true"
                        >添加角色</el-button
                    >
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            :class="[
                                'bdbottom',
                                index1 === 0 ? 'bdtop' : '',
                                'vcenter',
                            ]"
                            v-for="(item1, index1) in scope.row.children"
                            :key="item1.id"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="
                                        removeRightById(scope.row, item1.id)
                                    "
                                    >{{ item1.authName }}</el-tag
                                >
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级、三级权限 -->
                            <el-col :span="19">
                                <el-row
                                    :class="[
                                        index2 === 0 ? '' : 'bdtop',
                                        'vcenter',
                                    ]"
                                    v-for="(item2, index2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="
                                                removeRightById(
                                                    scope.row,
                                                    item2.id
                                                )
                                            "
                                            >{{ item2.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 渲染三级权限 -->
                                    <el-col :span="18">
                                        <el-tag
                                            type="warning"
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            closable
                                            @close="
                                                removeRightById(
                                                    scope.row,
                                                    item3.id
                                                )
                                            "
                                            >{{ item3.authName }}</el-tag
                                        >
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    label="角色名称"
                    prop="roleName"
                ></el-table-column>
                <el-table-column
                    label="角色描述"
                    prop="roleDesc"
                ></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            @click="showEditRoleDialog(scope.row.id)"
                            >编辑</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="removeRoleById(scope.row.id)"
                            >删除</el-button
                        >
                        <el-button
                            size="mini"
                            type="warning"
                            icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色的对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addRoleDialogVisible"
            width="50%"
            @close="addRoleDialogClosed"
        >
            <!-- 内容主体区域 -->
            <el-form
                :model="addRoleForm"
                ref="addRoleFormRef"
                label-width="80px"
                :rules="addRoleFormRules"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="addRole">确定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改角色"
            :visible.sync="editRoleDialogVisible"
            width="50%"
            @close="editRoleDialogClosed"
        >
            <!-- 内容主体区域 -->
            <el-form
                :model="editRoleForm"
                :rules="addRoleFormRules"
                ref="editRoleFormRef"
                label-width="80px"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="editRole">确定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed"
        >
            <!-- 内容主体区域 树形控件-->
            <el-tree
                :data="rightsList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defKeys"
                ref="treeRef"
            ></el-tree>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="allotRights">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Roles",
    data() {
        return {
            //所以角色列表数据
            rolesList: [],
            //控制分配权限对话框显示与隐藏
            setRightDialogVisible: false,
            //所有权限数据
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                children: "children",
                label: "authName",
            },
            //默认选中的节点id值数组
            defKeys: [],
            //当前即将分配权限的角色id
            roleId: "",
            //控制添加角色对话框的显示与隐藏
            addRoleDialogVisible: false,
            //存放添加角色表单的数据
            addRoleForm: {
                roleName: "",
                roleDesc: "",
            },
            //添加角色表单验证规则
            addRoleFormRules: {
                roleName: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur",
                    },
                ],
            },
            //控制编辑角色对话框的显示与隐藏
            editRoleDialogVisible: false,
            //编辑角色表单数据
            editRoleForm: {
                roleId: "",
                roleName: "",
                roleDesc: "",
            },
        };
    },
    created() {
        this.getRolesList();
    },
    methods: {
        // 获取所有角色的列表
        async getRolesList() {
            const { data: result } = await this.$http.get("roles");
            if (result.meta.status !== 200) {
                return this.$message.error("获取角色列表失败");
            }
            this.rolesList = result.data;
            console.log(this.rolesList);
        },
        //移除权限对话框
        async removeRightById(role, rightId) {
            // 弹框提示用户是否删除数据
            const confirmResult = await this.$confirm(
                "此操作将永久删除权限，是否继续?",
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
            const { data: result } = await this.$http.delete(
                "roles/" + role.id + "/rights/" + rightId
            );
            if (result.meta.status !== 200) {
                return this.$message.error("删除权限失败");
            }
            this.$message.success("删除权限成功");
            // this.getRolesList();
            role.children = result.data;
        },
        //展示设置权限对话框
        async showSetRightDialog(role) {
            //获取要分配权限的角色id
            this.roleId = role.id;
            // 获取所有权限数据
            const { data: result } = await this.$http.get("rights/tree");
            if (result.meta.status !== 200) {
                return this.$message.error("获取权限数据失败");
            }
            //获取到的权限数据保存到rightsList中
            this.rightsList = result.data;
            console.log(this.rightsList);
            //递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys);
            this.setRightDialogVisible = true;
        },
        //通过递归的形式，获取角色下所有三级权限的id， 并保存到defKeys数组中
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id);
            }
            //递归下一级
            node.children.forEach((item) => this.getLeafKeys(item, arr));
        },
        //监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            this.defKeys = [];
        },
        //点击为角色分配权限
        async allotRights() {
            const keys = [
                //目前被选中节点的key组成的数组
                ...this.$refs.treeRef.getCheckedKeys(),
                //目前半选中节点的key组成的数组
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const idStr = keys.join(",");
            const { data: result } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids: idStr }
            );
            if (result.meta.status !== 200) {
                return this.$message.error("分配权限失败");
            }
            this.$message.success("分配权限成功");
            this.getRolesList();
            this.setRightDialogVisible = false;
        },
        //添加角色
        addRole() {
            this.$refs.addRoleFormRef.validate(async (valid) => {
                if (!valid) return;
                console.log(this.addRoleForm);
                const { data: result } = await this.$http.post(
                    "roles",
                    this.addRoleForm
                );
                console.log(result);
                //添加角色失败提示
                if (result.meta.status !== 201) {
                    return this.$message.error("添加角色失败");
                }
                //添加角色成功
                this.$message.success("添加角色成功");
                this.addRoleDialogVisible = false;
                //重新获取数据
                this.getRolesList();
            });
        },
        //关闭对话框时清空添加角色表单的内容
        addRoleDialogClosed() {
            this.$refs.addRoleFormRef.resetFields();
        },
        //根据 id 删除角色
        async removeRoleById(id) {
            //弹框提示用户是否删除数据
            console.log(id);
            const confirmResult = await this.$confirm(
                "此操作将永久删除该角色户，是否继续?",
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
            const { data: result } = await this.$http.delete("roles/" + id);
            console.log(result);
            if (result.meta.status !== 200) {
                return this.$message.error("删除角色失败");
            }
            this.$message.success("删除角色成功");
            this.getRolesList();
        },
        //展示修改角色对话框
        showEditRoleDialog(id) {
            this.editRoleForm.roleId = id;
            console.log(id);
            this.editRoleDialogVisible = true;
        },
        //修改角色信息
        editRole() {
            //判断表单验证是否全部满足
            this.$refs.editRoleFormRef.validate(async (valid) => {
                if (!valid) {
                    return;
                }
                //发送请求
                const { data: result } = await this.$http.put(
                    "roles/" + this.editRoleForm.roleId,
                    {
                        roleName: this.editRoleForm.roleName,
                        roleDesc: this.editRoleForm.roleDesc,
                    }
                );
                console.log(result);
                if (result.meta.status !== 200) {
                    return this.$message.error("修改角色失败");
                }
                this.$message.success("修改角色成功");
                //重新获取列表数据
                this.getRolesList();
                //关闭对话框
                this.editRoleDialogVisible = false;
            });
        },
        //关闭修改角色对话框时清空表单内容
        editRoleDialogClosed() {
            this.$refs.editRoleFormRef.resetFields();
        },
    },
};
</script>

<style>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>