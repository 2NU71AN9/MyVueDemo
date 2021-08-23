<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="dataArray" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['vcenter', 'bdbottom', index1 === 0 ? 'bdtop' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="['vcenter', index2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
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
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="290">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="handlerEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="handlerDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size="small"
              @click="handlerFenpei(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="fenPeiRightDialog"
      width="50%"
      @close="fenPeiRightDialogClose"
    >
      <el-tree
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defCheckedKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenPeiRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../net_work/api'
export default {
  data() {
    return {
      dataArray: [],
      fenPeiRightDialog: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      defCheckedKeys: [],
      curFenPeiRoleId: '',
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get(api.roles).then(
        (res) => {
          this.dataArray = res.data.data
        },
        (err) => {}
      )
    },
    handlerEdit(value) {},
    handlerDelete(value) {},
    handlerFenpei(node) {
      this.$http.get(api.rights(false)).then(
        (res) => {
          this.rightList = res.data.data
          this.getDefCheckedKeys(node, this.defCheckedKeys)
          this.curFenPeiRoleId = node.id
          this.fenPeiRightDialog = true
        },
        (err) => {}
      )
    },
    async removeRightById(role, rightId) {
      const result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (result !== 'confirm') return
      this.$http.delete(api.removeRightById(role.id, rightId)).then(
        (res) => {
          this.$message.success('删除成功')
          role.children = res.data.data
        },
        (err) => {}
      )
    },
    getDefCheckedKeys(node, array) {
      if (!node.children || node.children.length == 0) {
        return array.push(node.id)
      }
      node.children.forEach((node) => {
        this.getDefCheckedKeys(node, array)
      })
    },
    fenPeiRightDialogClose() {
      this.defCheckedKeys = []
      this.curFenPeiRoleId = ''
    },
    setRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ].join(',')
      this.$http.post(api.setRights(this.curFenPeiRoleId), { rids: keys }).then(
        (res) => {
          this.$message.success('分配权限成功!')
          this.fenPeiRightDialog = false
          this.loadData()
        },
        (err) => {}
      )
    },
  },
}
</script>

<style lang="less" scoped>
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
