<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <el-button type="primary" class="btn" @click="addHostClick">新增</el-button>
      <div style="display: flex; ">
        <el-input placeholder="请输入主机名" v-model="inputHostName" clearable>
        </el-input>
        <el-button type="primary" class="btn" icon="el-icon-search" style="margin-left: 30px;"
          @click="getHostAll">搜索</el-button>
      </div>

    </div>

    <el-table :data="tableData" style="width: 100%" fit v-loading="loading">
      
      <el-table-column type="index" width="250" label="序号">
      </el-table-column>
      <el-table-column label="主机名" width="250" prop="hostName">
        <template slot-scope="scope">
          <span>{{ scope.row.hostName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip" width="250" prop="ip">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" width="250" prop="enable">

        <template slot-scope="scope">
          <!-- <span>{{ scope.row.enable }}</span> -->

          <div>
            <el-tag :key="scope.row.enable" :type="scope.row.enable === 1 ? 'success' : 'danger'" effect="dark"
              v-if="scope.row.enable!=0">
              可用
            </el-tag>
            <el-tooltip :content="scope.row.reason" placement="right">
              <el-tag :key="scope.row.enable" :type="scope.row.enable === 0 ? 'danger' : 'success'" effect="dark"
                v-if="scope.row.enable==0">
                不可用
              </el-tag>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editHostClick(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteHostById(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
      style="margin-top: 20px;padding-bottom: 50px;" @current-change="handleCurrentChange"
      @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog :title="dialogType" :visible.sync="dialogVisible" width="45%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="主机名称" prop="hostName" :rules="rules.hostName">
          <el-input v-model="form.hostName" :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="主机ip" prop="ip" :rules="rules.ip" @input="isValidIP">
          <el-input v-model="form.ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="ssh端口" prop="port" :rules="rules.port">
          <el-input v-model="form.port" clearable></el-input>
        </el-form-item>
        <el-form-item label="ssh用户名" prop="userName" :rules="rules.userName">
          <el-input v-model="form.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="ssh密码" prop="password" :rules="rules.password">
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
    mounted() {
      this.getHostAll();
    },
    data() {
      return {
        dialogVisible: false,
        dialogType: "",
        inputHostName: "",
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总条数
        loading: true,
        form: {
          hostName: '',
          ip: '',
          port: '',
          userName: '',
          password: '',
          reason: '',
        },
        tableData: [],
        rules: {
          hostName: [{
            required: true,
            message: '主机名称不能为空',
            trigger: 'blur'
          }],
          ip: [{
            required: true,
            message: '主机ip不能为空',
            trigger: 'blur'
          }, {
            validator: this.isValidIP,
            trigger: 'blur'
          }],
          port: [{
            required: true,
            message: 'ssh端口不能为空',
            trigger: 'blur'
          }, {
            pattern: /^([1-9]\d{0,4}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: '请输入1-65535之间的端口',
            trigger: 'blur'
          }],
          userName: [{
            required: true,
            message: 'ssh用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: 'ssh密码不能为空',
            trigger: 'blur'
          }]
        }
      }
    },

    methods: {

      initForm() {
        this.form = {
          hostName: '',
          ip: '',
          port: '',
          userName: '',
          password: '',
        }

      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        this.getHostAll();
      },
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.getHostAll();
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
      isValidIP(rule, value, callback) {
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipPattern.test(value)) {
          callback(new Error('请输入合法的IP地址'));
        } else {
          callback();
        }
      },
      addOrEditHost() {
        this.$refs.form.validate(vailid => {
          if (vailid) {
            if (this.dialogType == '编辑主机') {
              this.editHostById()
            }
            if (this.dialogType == '新添主机') {
              this.addHostOne()
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
      addHostClick() {
        this.initForm()
        this.openDialog("新添主机")
      },
      editHostClick(id) {
        this.openDialog("编辑主机")
        this.$axios.get(`http://127.0.0.1:8080/host/${id}`).then(response => {
          if (response.data.code == 200) {

            this.form = response.data.data
          }
          if (response.data.code != 200) {
            this.$message({
              message: response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
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
        })
      },
      editHostById() {
        this.$axios.put("http://127.0.0.1:8080/host/", this.form).then(response => {
          if (response.data.code == 200) {
            this.$message({
              message: '修改成功!',
              type: 'success',
              showIcon: true
            });
            this.getHostAll();
            this.dialogVisible = false
          }
          if (response.data.code != 200) {
            this.$message({
              message: response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
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
        })
      },
      getHostAll() {
        const queryData = {
          "inputHostName": this.inputHostName,
          "currentPage": this.currentPage,
          "pageSize": this.pageSize
        }
        this.$axios.get("http://127.0.0.1:8080/host/query", {
          params: queryData
        }).then(response => {

          if (response.data.code == 200) {
            this.tableData = response.data.data.tableData
            this.total = response.data.data.total
            console.log(this.tableData)
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error',
              showIcon: true
            });
          }
          this.loading = false
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
        })
      },
      addHostOne() {

        this.$axios.post("http://127.0.0.1:8080/host", this.form).then(response => {
          console.log(response)
          if (response.data.code == 200) {
            this.$message({
              message: '新添成功!',
              type: 'success',
              showIcon: true
            });
            this.getHostAll();
            this.dialogVisible = false
          } else {
            this.$message({
              message: response.data.msg,
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
          if (error.message == 'Network Error') {
            this.$message({
              message: "无法连接服务器！",
              type: 'error',
              showIcon: true
            });
          }
        })
      },
      deleteHostById(id) {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // data = {
          //   "id": id,
          // }
          console.log(id)
          this.$axios.delete(`http://127.0.0.1:8080/host/${id}`).then(response => {
            if (response.data.code = 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getHostAll();
            } else {
              this.$message({
                message: response.data.msg,
                type: 'error',
                showIcon: true
              });
            }
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
