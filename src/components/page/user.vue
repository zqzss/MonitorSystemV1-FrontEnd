<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <el-button type="primary" class="btn" @click="addUserClick">新增</el-button>
      <div style="display: flex; ">
        <el-input placeholder="请输入用户名" v-model="inputUserName" clearable style="margin-right: 30px;">
        </el-input>
        <el-button type="primary" class="btn" icon="el-icon-search" @click="getUserAll" >搜索</el-button>
      </div>

    </div>

    <el-table :data="tableData" style="width: 100%" fit v-loading="loading">
      <el-table-column type="index" width="250" label="序号">
      </el-table-column>
      <el-table-column label="用户名" width="250" prop="username">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全名" width="250" prop="fullname">
        <template slot-scope="scope">
          <span>{{ scope.row.fullname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" prop="email">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column >

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editUserClick(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteUserById(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
      style="margin-top: 20px;padding-bottom: 50px;" @current-change="handleCurrentChange" @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog :title="dialogType" :visible.sync="dialogVisible" width="45%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="用户名" prop="username" :rules="rules.username">
          <el-input v-model="form.username" :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="全名" prop="fullname" :rules="rules.fullname" >
          <el-input v-model="form.fullname" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :rules="rules.email">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel" >
          <el-input v-model="form.tel" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description" >
          <el-input v-model="form.description" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="rules.password" v-if="this.dialogType == '新添用户'">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="addOrEditHost">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
  export default {
    created() {
      this.getUserAll();
    },
    data() {
      return {
        dialogVisible: false,
        dialogType: "",
        inputUserName: "",
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总条数
        loading: true,
        form: {
          username: '',
          fullname: '',
          email: '',
          tel: '',
          password: '',
          description: '',
        },
        tableData: [],
        rules: {
          username: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          }],
          fullname: [{
            required: true,
            message: '全名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        }
      }
    },

    methods: {

      initForm() {
        this.form = {
          username: '',
          fullname: '',
          tel: '',
          email: '',
          password: '',
          description: '',
        }

      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        this.getUserAll();
      },
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.getUserAll();
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      cancelForm() {
        // 关闭对话框
        this.dialogVisible = false;
        // 重置表单数据为空
        // this.$refs.form.resetFields();
        this.initForm()
      },

      addOrEditHost() {
        this.$refs.form.validate(vailid => {
          if (vailid) {
            if (this.dialogType == '编辑用户') {
              this.editUserById()
            }
            if (this.dialogType == '新添用户') {
              this.addUserOne()
            }

          } else {
            this.$message.error('表单校验不通过，请检查输入');
          }
        })

      },
      openDialog(type) {
        this.dialogVisible = true;
        this.dialogType = type;
      },
      addUserClick() {
        this.initForm()
        this.openDialog("新添用户")
      },
      editUserClick(id) {
        this.openDialog("编辑用户")
        this.$axios.get(`http://127.0.0.1:8080/user/${id}`).then(response => {
          if (response.data.code == 200) {

            this.form = response.data.data
          }
        }).catch(error => {
          if (error.response) {
            this.$message({
              message: error.response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
          else  {
            this.$message({
              message: "无法连接服务器！",
              type: 'error',
              showIcon: true
            });
          }
        })
      },
      editUserById() {
        this.$axios.put("http://127.0.0.1:8080/user/", this.form).then(response => {
          if (response.data.code == 200) {
            this.$message({
              message: '修改成功!',
              type: 'success',
              showIcon: true
            });
            this.getUserAll();
            this.dialogVisible = false
          }
        }).catch(error => {
          if (error.response) {
            this.$message({
              message: error.response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
          else  {
            this.$message({
              message: "无法连接服务器！",
              type: 'error',
              showIcon: true
            });
          }
        })
      },
      getUserAll() {
        const queryData = {
          "inputUserName": this.inputUserName,
          "currentPage": this.currentPage,
          "pageSize": this.pageSize
        }
        this.loading = true
        this.$axios.get("http://127.0.0.1:8080/user/query",{ params: queryData }).then(response => {
          if (response.data.code == 200) {
            this.tableData = response.data.data.tableData
            this.total = response.data.data.total
            console.log(this.tableData)
          }
          else{
            this.$message({
              message: response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
          this.loading=false;
        }).catch(error => {

          if (error.response) {
            this.$message({
              message: error.response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
          if (error.message == 'Network Error') {
            this.$message({
              message: "无法连接服务器！",
              type: 'error',
              showIcon: true
            });
          }
          this.loading = false
        })
      },
      addUserOne() {

        this.$axios.post("http://127.0.0.1:8080/user", this.form).then(response => {
          console.log(response)
          if (response.data.code == 200) {
            this.$message({
              message: '新添成功!',
              type: 'success',
              showIcon: true
            });
            this.getUserAll();
            this.dialogVisible = false
          } else {
            this.$message({
              message: '新添失败!',
              type: 'error',
              showIcon: true
            })
          }

        }).catch(error => {
          if (error.response) {
            this.$message({
              message: error.response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
          else  {
            this.$message({
              message: "无法连接服务器！",
              type: 'error',
              showIcon: true
            });
          }
        })
      },
      deleteUserById(id) {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // data = {
          //   "id": id,
          // }
          console.log(id)
          this.$axios.delete(`http://127.0.0.1:8080/user/${id}`).then(response => {
            if (response.data.code = 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getUserAll();
            }
          }).catch(error => {
            if (error.response) {
              this.$message({
                message: error.response.data.msg,
                type: 'error',
                showIcon: true
              });
            }
            else  {
              this.$message({
                message: "无法连接服务器！",
                type: 'error',
                showIcon: true
              });
            }
          })

        }).catch(() => {
          // this.$message({
          //   message: '连接服务器失败!',
          //   type: 'error',
          //   showIcon: true
          // });
        });
      }
    }
  }
</script>

<style>
  .btn {
    margin-bottom: 20px;
  }
</style>
