<template xmlns:el-col="http://www.w3.org/1999/html">
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--输入框区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" plain @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949" @change="changeUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)">删除</el-button>
            <el-button type="primary" icon="el-icon-setting" size="mini">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 10, 20, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      @close="resetFormFields"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <!--添加用户表单区域-->
      <el-form   label-width="100px" :model="userForm" :rules="userFormRules"
                 ref="userFormRef" >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="userForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" >
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改用户对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="30%"
    >
      <!--修改用户表单区域-->
      <el-form   label-width="100px" :model="editForm" :rules="userFormRules"
                 ref="editUserFormRef" >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    const checkMobile = (rule, value, callback) => {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    const checkEmail = (rule, value, callback) => {
      let reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    return {
      /* 前端分页参数 */
      queryInfo: {
        /* 查询条件 */
        query: '',
        /* 当前页 */
        pagenum: 1,
        /* 单页数据量 */
        pagesize: 2
      },
      userList: [],
      totalCount: 0,
      dialogVisible: false,
      editdialogVisible: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: { },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.totalCount = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    /* 页码值改变 */
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getUserList()
    },
    /* 监听switch开关改变用户状态 */
    async changeUserState (info) {
      const { data: res } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
      if (res.meta.status !== 200) {
        info.mg_state = !info.mg_state
        return this.$message.error('用户状态失败!')
      }
      this.$message.success('用户状态修改成功!')
    },
    /* 关闭表单时重置所有表单栏位 */
    resetFormFields () {
      this.$refs.userFormRef.resetFields()
    },
    /* 添加用户 */
    addUser () {
      this.$refs.userFormRef.validate(async vali => {
        if (!vali) return this.$message.error('表单校验失败!')
        const { data: res } = await this.$http.post('users', this.userForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功!')
        /* 关闭对话框 */
        this.dialogVisible = false
        /* 重新获取用户列表 */
        this.getUserList()
      })
    },
    /* 展示修改用户信息对话框 */
    async showEditDialog (userId) {
      const { data: res } = await this.$http.get('users/' + userId)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      /* 获取数据之后再显示对话框 */
      this.editdialogVisible = true
    },
    updateUserInfo () {
      this.$refs.editUserFormRef.validate(async vali => {
        if (!vali) return this.$message.error('表单校验失败!')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功!')
        /* 关闭对话框 */
        this.editdialogVisible = false
        /* 重新获取用户列表 */
        this.getUserList()
      })
    },
    deleteUserById (userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + userId)
        if (res.meta.status !== 200) {
          this.$message.error('删除用户失败')
        }
        this.$message.success('删除用户成功!')
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
