<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="home_logo">
        <span>mes异常处理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏区域-->
      <el-aside width="200px">
        <el-menu
          router
          :default-active="activePath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409fff">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板-->
            <template slot="title">
              <!--一级菜单图表-->
              <i class="el-icon-location"></i>
              <!--一级菜单文字-->
              <span>{{item.authName}}</span>
            </template>
             <!--一级菜单的二级菜单-->
              <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="savePath('/'+subitem.path)">
                <!--子菜单模板-->
                <template slot="title">
                  <!--子菜单模板-->
                  <i class="el-icon-menu"></i>
                  <!--子菜单文字-->
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主界面区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      activePath: ''
    }
  },
  /* vue生命周期,该组件创建的时候就初始化菜单列表 */
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('/activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('初始化菜单列表失败!')
      this.menuList = res.data
    },
    savePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home_container{
    height:100%;
  }
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 0;
  color: white;
  font-size: 30px;
}
.el-header >div {
  display: flex;
  align-items: center;
  span{
    margin-left: 20px;
  }
}
  .el-aside{
    background-color: #333744;
  }

  .el-main{
    background-color: #EAEDF1;
  }

</style>
