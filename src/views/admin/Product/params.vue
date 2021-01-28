<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Brea/>
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数!"  :closable="false" show-icon  style="background:#E6A23C;color:#fff;"/>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            v-model="seleCatekeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addFlag=true">添加参数</el-button>
          <!-- 动态表格 -->
          <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签   -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEdit(scope.row.attr_id)"
                  size="mini"
                >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.attr_id)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addFlag=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签   -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEdit(scope.row.attr_id)"
                >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addFlag">
      <el-form :model="addForm" :rules="rules" ref="addFormRef">
        <el-form-item :label="titleText" prop="attr_name" :label-width="'80px'">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改动态对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editFlag">
      <el-form :model="editForm" :rules="rules" ref="editFormRef">
        <el-form-item :label="titleText" prop="attr_name" :label-width="'80px'">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Brea from '../Brea/brea'
export default {
  components: {Brea},
  data() {
    return {
      //商品分类列表
      catelist: [],
      //级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //级联选择框的双向绑定到的数组
      seleCatekeys: [],
      //被激活的页签的名称
      activeName: "many",
      //动态参数数据
      manyTableDate: [],
      //静态属性数据
      onlyTableDate: [],
      // 对话框的显示隐藏
      addFlag: false,
      //添加参数的表单数据
      addForm: {
        attr_name: ""
      },
      // 对话框的显示隐藏
      editFlag: false,
      //修改参数的表单数据
      editForm: {
        id: 0,
        attr_name: ""
      },
      rules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    async getCatelist() {
      var { data: res } = await this.$http.get("categories");
      //   console.log(res);
      this.catelist = res.data;
    },
    //级联选择框中项变化，会触发这个函数
    handleChange() {
      //   console.log(this.seleCatekeys);
      this.getParamsData();
    },
    //tab页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    //获取参数的列表数据
    async getParamsData() {
      if (this.seleCatekeys.length !== 3) {
        return (
          (this.seleCatekeys = []),
          (this.manyTableDate = []),
          (this.onlyTableDate = [])
        );
      }
      //证明是三级分类
      console.log(this.seleCatekeys);
      //根据所选分类id，和当前所处面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      console.log(res.data);


      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        //文本框中输入的值
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    //点击按钮，添加参数
    addParams(addFormRef) {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          var { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          );
          this.addFlag = false;
          this.getParamsData();
          this.$message.success("添加成功");
          this.$refs.addFormRef.resetFields();
        }
      });
    },
    //点击编辑,展示修改的对话框
    async showEdit(attr_id) {
      //查询参数信息
      var {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      this.editForm = res.data;
      this.editFlag = true;
    },
    //重置修改的表单
    editParams(editFormRef) {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          var {
            data: res
          } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          );
          this.$message.success("修改参数成功");
          this.getParamsData();
          this.editFlag = false;
        }
      });
    },
    //删除
    del(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${id}`
          );
          console.log(res);
          this.$message.success("删除参数成功");
          this.getParamsData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //文本框失去焦点，或摁下enter都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        (row.inputValue = ""), (row.inputVisible = false);
        return;
      }
      //如果没有return则后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //调用保存的参数项
      this.seave(row);
        this.$message.success("添加参数项成功");
    },
    //需要发起请求，保存操作
    async seave(row) {
      var { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
    },
    //点击按钮，展示输入文本框
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //$nextTick方法作用，就是当页面上元素被从新渲染后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.seave(row);
        this.$message.success("删除参数项成功");
    }
  },
  computed: {
    //如果按钮需要被禁用。则返回true,否则返回false
    isBtnDisabled() {
      if (this.seleCatekeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.seleCatekeys.length === 3) {
        return this.seleCatekeys[2];
      }
      return null;
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>
<style lang="scss" scope>
.el-card {
  margin-top: 10px;
}
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>