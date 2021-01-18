<template>
  <div>
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="/logo.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主题区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 侧边主体内容 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      menulist: [],
      iconsObj: {
        "125": "el-icon-s-custom",
        "103": "el-icon-bank-card",
        "101": "el-icon-s-goods",
        "102": "el-icon-shopping-cart-full",
        "145": "el-icon-data-line"
      },
      // 定义一个布尔值  是否折叠
      isCollapse: false,
      activePath:''
    };
  },

  created() {
    //   左侧菜单数据
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  mounted() {},
  // 组件方法
  methods: {
    logout() {
      //  清空token
      window.sessionStorage.clear("token");
      // 跳转到登录页
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
    }
  },
  // 计算属性
  computed: {}
};
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 40px;
    height: 40px;
  }
}
.el-aside {
  background: #333744;
  min-height: 600px;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #eaedf1;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
