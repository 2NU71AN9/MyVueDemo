<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="loadData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="loadData"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              :value="scope.row.mg_state"
              @change="stateChanged(scope.row)"
              >>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editUser(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="small"
                @click="collectUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="addUserDialogClose"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
      >
        <el-form-item label="用户名" prop="username" label-width="70px">
          <el-input v-model="addUserForm.username"> </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="70px">
          <el-input type="password" v-model="addUserForm.password"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="70px">
          <el-input v-model="addUserForm.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" label-width="70px">
          <el-input v-model="addUserForm.mobile"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialog"
      width="50%"
      @close="editUserDialogClose"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
      >
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="editUserForm.username" disabled> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="70px">
          <el-input v-model="editUserForm.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" label-width="70px">
          <el-input v-model="editUserForm.mobile"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../net_work/api'
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入正确邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^[1]([3-9])[0-9]{9}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入正确手机号'))
    }
    return {
      addUserDialog: false,
      editUserDialog: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      totalNum: 0,
      userList: [],
      addUserForm: { username: '', password: '', email: '', mobile: '' },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
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
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      editUserForm: {},
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get(api.users, { params: this.queryInfo }).then(
        (res) => {
          this.totalNum = res.data.data.total
          this.userList = res.data.data.users
        },
        (error) => {}
      )
    },
    editUser(user) {
      this.editUserForm = { ...user }
      this.editUserDialog = true
    },
    async deleteUser(id) {
      const result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (result !== 'confirm') return
      this.$http.delete(api.editUser(id)).then(
        (res) => {
          this.$message.success('用户删除成功')
          this.loadData()
        },
        (error) => {
          this.$message.error('用户删除失败')
        }
      )
    },
    collectUser(id) {
      console.log(id)
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.loadData()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.loadData()
    },
    stateChanged(user) {
      user.mg_state = !user.mg_state
      this.$http.put(api.userState(user.id, user.mg_state)).then(
        (res) => {
          this.$message.success('更新用户状态成功')
        },
        (error) => {}
      )
    },
    addUser() {
      this.$refs.addUserFormRef.validate((valid) => {
        if (!valid) return
        this.$http.post(api.addUser, this.addUserForm).then(
          (res) => {
            this.addUserDialog = false
            this.$message.success('用户添加成功')
            this.loadData()
          },
          (error) => {}
        )
      })
    },
    addUserDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    editUserAction() {
      this.$refs.editUserFormRef.validate((valid) => {
        if (!valid) return
        this.$http
          .put(api.editUser(this.editUserForm.id), this.editUserForm)
          .then(
            (res) => {
              this.editUserDialog = false
              this.$message.success('用户编辑成功')
              this.loadData()
            },
            (error) => {}
          )
      })
    },
    editUserDialogClose() {
      this.$refs.editUserFormRef.resetFields()
      this.editUserForm = {}
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>