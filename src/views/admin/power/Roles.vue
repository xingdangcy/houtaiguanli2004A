<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色列表区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
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
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                {{scope.row}}
              </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
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
    <!-- 权限分配对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加权限对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  所有角色列表数据
      rolelist: [],
      // 控制分配权限的对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightlist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中的节点Id值数组
      defkeys: [],
      // 当前即将分配权限的角色ID
      roleId: "",

      // 控制添加用户对话框的显示于隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {
        id: 0,
        roleName: "",
        roleDesc: ""
      }
    };
  },
  // 侦听器
  watch: {},

  created() {
    this.getRolesList();
  },
  mounted() {},
  // 组件方法
  methods: {
    //  获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
      console.log(this.rolelist);
    },

    // 根据ID删除对应的用户信息
    async removeUserById(id) {
      // console.log(id)
      // 询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果用户确认删除，则返回值为字符串confirm
      //  如果用户取消删除，则返回值为cancel
      //  console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getRolesList();
    },
    //  根据ID删除对应权限
    async removeRightById(role, rightId) {
      //  弹框提示用户是否要删除
      const confirmResule = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResule !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      this.$message.success("删除用户成功");
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据权限失败");
      }
      //  把获取的权限数据保存到data中
      this.rightlist = res.data;
      console.log(this.rightlist);
      // 递归获取三级节点ID
      this.getLeafkeys(role, this.defkeys);

      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafkeys(node, arr) {
      if (!node.children) {
        // 如果当前node节点不包含children属性，则是三级节点
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafkeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defkeys = [];
    },
    async allotRights() {
      const keys = [
        this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // console.log(keys)
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    // 监听添加用户对话框的关闭事件
    // addDialogClased() {
    //   this.$refs.addFormRef.resetFields();
    // },
    // 点击按钮，添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户列表数据
        this.getRolesList();
        this.$refs.addFormRef.resetFields();
      });
    },
    // 展示编辑用户的对话框
    showEditDialog(row) {
      this.editForm = {
        id: row.id,
        roleName: row.roleName,
        roleDesc: row.roleDesc
      };

      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事/件
    // editDialogClosed(){
    //   this.$refs.editFormRef.resetFields()
    // },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        // 发起修改用户信息的数据请求
        var obj={
          roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc
        }
        const { data: res } = await this.$http.put(`roles/${this.editForm.id}`,obj);

        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        // 关闭对话框
        this.editDialogVisible = false;

        // 提示修改成功
        this.$message.success("更新用户信息成功！");
        // 刷新数据列表
        this.getRolesList();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
