<template>
 <div>
 <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                  <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
                  <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
 </div>
</template>

<script>
export default {
// 局部注册的组件
 components: {},
// 组件状态值
 data() {
 return {
    //  所有的权限列表
    rightsList:[]
 };
 },

// 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
 created() {
    //   获取所有权限
     this.getRightsList()
 },
 mounted() {
 },
// 组件方法
 methods: {
  //  获取权限列表
   async getRightsList(){
      const {data:res} = await this.$http.get('rights/list')
      if(res.meta.status !==200){
          return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
 },
// 计算属性
 computed:{

 }
};
</script>

<style scoped>

</style>
