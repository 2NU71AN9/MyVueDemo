<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/iconstore.png" alt="" />
        <span>AAAAAAAA</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <el-submenu
            v-for="menu in menuList"
            :index="'/' + menu.path"
            :key="menu.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in menu.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import api from '../net_work/api'
export default {
  data () {
    return {
      isCollapse: false,
      menuList: []
    }
  },
  created () {
    this.loadMenus()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    loadMenus () {
      this.$http.get(api.menu).then(
        (res) => {
          this.menuList = res.data.data
        },
        (error) => {}
      )
    },
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: wheat;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 20px;
      }
      > img {
        width: 50px;
        height: 50px;
        border-radius: 25px;
      }
    }
  }
  .el-aside {
    height: 100%;
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eee;
  }

  .toggle-button {
    height: 24px;
    width: 100%;
    background-color: chocolate;
    font-size: 10px;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
</style>
