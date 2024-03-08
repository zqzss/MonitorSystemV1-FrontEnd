<template>
  <div>

    <div style="display: flex; justify-content: space-between;">
      <el-button type="primary" plain class="btn" style="margin-bottom: 18px;" @click="addMonitorItemClick">新增</el-button>
      <div style="display: flex; ">
        <el-input placeholder="请输入主机名" v-model="inputHostName"  style="margin-right: 30px;">
        </el-input>
        <el-button type="primary" class="btn" icon="el-icon-search" @click="getMonitorItemAll" >搜索</el-button>
      </div>

    </div>
    <el-table :data="tableData" style="width: 100%" fit v-loading="loading">
      <el-table-column type="index" width="200"  :fit="true" label="序号">
      </el-table-column>
      <el-table-column label="监控类型" width="200"  :fit="true" prop="monitorType">
      </el-table-column>
      <el-table-column label="监控主机" width="200" :fit="true" prop="hostName">
      </el-table-column>
      <el-table-column label="阈值" width="200" :fit="true" prop="warnValue">
      </el-table-column>
      <el-table-column label="具体" width="200" :fit="true" prop="detail">
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" @click="editMonitorItemClick(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteMonitorItemById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
      style="margin-top: 20px;padding-bottom: 50px;" @current-change="handleCurrentChange" @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog title="新增监控项" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="form" ref="form" :rules="rules">

        <el-form-item label="监控类型" :label-width="formLabelWidth" :rules="rules.selectMonitorType"
          prop="selectMonitorType">
          <el-select v-model="form.selectMonitorType" placeholder="请选择监控类型" filterable clearable>
            <el-option v-for="(item,index) in monitorTypeName" :key="index" :label="item" :value="item"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="关联主机" :label-width="formLabelWidth" :rules="rules.selectHost" prop="selectHost">
          <el-select v-model="form.selectHost" placeholder="请选择关联主机" filterable clearable>
            <el-option v-for="(item,index) in hostName" :key="index" :label="item" :value="item"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item :label="form.selectMonitorType" :label-width="formLabelWidth" :rules="rules.warnValue" v-if="form.selectMonitorType == 'cpu使用率(单位: %)' || form.selectMonitorType == '内存剩余空间(单位: G)' || form.selectMonitorType == '磁盘分区剩余空间(单位: G)'"
          prop="warnValue">
          <el-input v-model="form.warnValue" style="width: 220px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="具体" :label-width="formLabelWidth" v-if="form.selectMonitorType == '磁盘分区剩余空间(单位: G)' || form.selectMonitorType == '端口' || form.selectMonitorType == '进程名称' || form.selectMonitorType == 'url'"
          :rules="rules.detail" prop="detail">
          <el-input v-model="form.detail" autocomplete="off" style="width: 220px;" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditMonitorItem()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    mounted() {
      this.getMonitorItemAll();
    },
    methods: {
      initForm() {
        this.form = {
          selectMonitorType: 'cpu使用率',
          selectHost: '',
          warnValue: '',
          detail: ''
        }

      },
      openDialog(type) {
        this.dialogFormVisible = true;
        this.dialogType = type;
      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        this.getMonitorItemAll();
      },
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.getMonitorItemAll();
      },
      deleteMonitorItemById(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`http://127.0.0.1:8080/monitorItem/${id}`).then(response => {
            if (response.data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getMonitorItemAll();
            }
            else{
              this.$message({
                type: 'error',
                message: response.data.msg
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
        })
      },
      getMonitorItemAll() {
        const queryData = {
          "inputHostName": this.inputHostName,
          "currentPage": this.currentPage,
          "pageSize": this.pageSize
        }
        this.loading = true
        this.$axios.get("http://127.0.0.1:8080/monitorItem",{ params: queryData }).then(response => {
          if(response.data.code == 200){
            this.tableData = response.data.data.tableData;
            this.total = response.data.data.total;
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
          this.loading=false;
        })
      },
      editMonitorItemClick(id) {
        this.openDialog("编辑监控项");
        this.$axios.get(`http://127.0.0.1:8080/monitorItem/${id}`).then(response => {
          if (response.data.code == 200) {

            this.form = response.data.data
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
      addMonitorItemClick() {
        this.openDialog("新添监控项");
        this.initForm();
        this.$axios.get("http://127.0.0.1:8080/monitorType/name").then(response => {

          if (response.data.code == 200) {
            this.monitorTypeName = response.data.data
            this.form.selectMonitorType = this.monitorTypeName[0]
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
        this.$axios.get("http://127.0.0.1:8080/host/name").then(response => {

          if (response.data.code == 200) {
            this.hostName = response.data.data

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
      addOrEditMonitorItem(id, formName) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // if (this.form.selectMonitorType != '磁盘分区剩余空间(单位:G)') {
            //   this.form.detail = null
            // }
            if (this.dialogType == '新添监控项') {
              this.$axios.post("http://127.0.0.1:8080/monitorItem", this.form).then(response => {
                if (response.data.code == 200) {
                  this.hostName = response.data.data
                  this.$message({
                    message: '新添成功!',
                    type: 'success',
                    showIcon: true
                  });
                  this.dialogFormVisible = false;
                  this.getMonitorItemAll();
                  this.initForm();
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
            } else {
              this.$axios.put("http://127.0.0.1:8080/monitorItem", this.form).then(response => {
                if (response.data.code == 200) {
                  this.$message({
                    message: '修改成功!',
                    type: 'success',
                    showIcon: true
                  });
                  this.getMonitorItemAll();
                  this.initForm()
                  this.dialogFormVisible = false
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
            }
          } else {
            this.$message({
              message: '表单验证不通过!',
              type: 'error',
              showIcon: true
            })
            return;

          }
        });

      }

    },
    data() {
      return {
        dialogType: '',

        inputHostName: "",
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总条数
        loading: true,

        tableData: [{
          detail: '',
          monitorType: '',
          hostName: '',
          warnValue: '',
          id: '',
          reason: '',
        }],
        dialogFormVisible: false,
        form: {
          selectMonitorType: '',
          selectHost: '',
          warnValue: '',
          detail: ''
        },
        monitorTypeName: [],
        hostName: [],
        formLabelWidth: '120px',
        rules: {
          selectMonitorType: [{
            required: true,
            message: '监控类型不能为空',
            trigger: 'blur'
          }],
          selectHost: [{
            required: true,
            message: '关联主机不能为空',
            trigger: 'blur'
          }],
          warnValue: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          // {
          //   pattern: /^(100|[1-9]\d?|\d)(\.\d{1,2})?$/,
          //   message: '请输入0-100的数',
          //   trigger: 'blur'
          // },
          ],
          detail: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        }
      }
    }
  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
