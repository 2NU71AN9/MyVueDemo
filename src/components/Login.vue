<template>
  <div class="login_container">
    <div class="login_box">
      <div class="acatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            type="password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginAction">登录</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '../net_work/api'

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    loginAction() {
      this.$refs.loginFormRef.validate((isOk) => {
        if (!isOk) return
        this.$http.post(api.login, this.loginForm).then(
          (response) => {
            this.$message.success('登录成功')
            console.log(response.data.data.token)
            window.sessionStorage.setItem('token', response.data.data.token)
            this.$router.push('/home')
          },
          (error) => {
            this.$message.error('登录失败')
          }
        )
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: cadetblue;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 5px;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .acatar_box {
    width: 120px;
    height: 120px;
    border: #eee solid 1px;
    box-shadow: 0 0 10px #ddd;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
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
}
</style>>