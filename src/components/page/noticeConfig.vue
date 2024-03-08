<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <el-button type="primary" plain class="btn" style="margin-bottom: 18px;"
        @click="addNoticeTypeClick">新增</el-button>
      <!--      <div style="display: flex; ">
        <el-input placeholder="请输入主机名" v-model="inputHostName"  style="margin-right: 30px;">
        </el-input>
        <el-button type="primary" class="btn" icon="el-icon-search" @click="getMonitorItemAll" >搜索</el-button>
      </div> -->

    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">

      <el-table-column type="index" prop="index" style="width: 25%">
      </el-table-column>
      <el-table-column prop="noticeTypeName" property="noticeTypeName" label="通知类型" style="width: 25%">
      </el-table-column>
      <el-table-column prop="intervalMinute" property="intervalMinute" label="间隔时间(分钟)" style="width: 25%">
      </el-table-column>

      <el-table-column label="操作" style="width: 25%">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="viewNoticeConfigClick(scope.row)">查看</el-button>
          <el-button size="medium" type="text" @click="editNoticeConfigClick(scope.row)">编辑</el-button>
          <el-button size="medium" type="text" @click="deleteNoticeTypeClick(scope.row)"
            v-if="scope.row.noticeTypeName != '邮箱'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible.sync="editNoticeConfigDialogVisible" width="450px">
      <el-form :model="viewAndEditNoticeConfigForm" :rules="rules" :label-position="labelPosition">
        <el-form-item label="通知类型" :label-width="formLabelWidth">
          <el-input v-model="viewAndEditNoticeConfigForm.noticeTypeName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="WebHook地址" :label-width="formLabelWidth"
          v-if="viewAndEditNoticeConfigForm.noticeTypeName == '企业微信'">
          <el-input v-model="viewAndEditNoticeConfigForm.WebHookAddr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户" :label-width="formLabelWidth">
          <el-select v-model="viewAndEditNoticeConfigForm.usernames" multiple placeholder="请选择用户">

            <el-option v-for="(item,index) in viewAndEditNoticeConfigForm.userNameOptions" :key="index" :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔时间(分钟)" prop="intervalMinute" :min="0" :max="1440" :label-width="formLabelWidth">
          <el-input v-model="viewAndEditNoticeConfigForm.intervalMinute" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="padding-left: 52px;">
          <el-switch v-model="viewAndEditNoticeConfigForm.enable"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editNoticeConfigDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNoticeConfigCommit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看" :visible.sync="viewNoticeConfigDialogVisible" width="450px">
      <el-form :model="viewAndEditNoticeConfigForm" :rules="rules" :label-position="labelPosition">
        <el-form-item label="通知类型" :label-width="formLabelWidth">
          <el-input v-model="viewAndEditNoticeConfigForm.noticeTypeName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="WebHook地址" :label-width="formLabelWidth"
          v-if="viewAndEditNoticeConfigForm.noticeTypeName == '企业微信'">
          <el-input v-model="viewAndEditNoticeConfigForm.WebHookAddr" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户" :label-width="formLabelWidth">
          <el-select v-model="viewAndEditNoticeConfigForm.usernames" multiple placeholder="请选择用户" disabled>

            <el-option v-for="(item,index) in viewAndEditNoticeConfigForm.userNameOptions" :key="index" :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔时间(分钟)" prop="intervalMinute" :min="0" :max="1440" :label-width="formLabelWidth">
          <el-input v-model="viewAndEditNoticeConfigForm.intervalMinute" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="padding-left: 52px;">
          <el-switch v-model="viewAndEditNoticeConfigForm.enable" disabled></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewNoticeConfigDialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="editNoticeConfigCommit">确 定</el-button> -->
      </div>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addDialogFormVisible" width="450px">
      <el-form :model="addNoticeConfigForm" :rules="addRules" :label-position="labelPosition">
        <el-form-item label="通知类型" :label-width="formLabelWidth">
          <el-select v-model="addNoticeConfigForm.noticeTypeName" placeholder="请选择通知类型">
            <el-option v-for="(item,index) in addNoticeConfigForm.noticeTypeNameOptions" :key="index" :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="WebHook地址" :label-width="formLabelWidth"
          v-if="addNoticeConfigForm.noticeTypeName == '企业微信'">
          <el-input v-model="addNoticeConfigForm.WebHookAddr" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户" :label-width="formLabelWidth">
          <el-select v-model="addNoticeConfigForm.username" multiple placeholder="请选择用户" >
            <el-option v-for="(item,index) in addNoticeConfigForm.usernameOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="间隔时间(分钟)" prop="intervalMinute" :min="0" :max="1440" :label-width="formLabelWidth">
          <el-input v-model="addNoticeConfigForm.intervalMinute" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="padding-left: 52px;">
          <el-switch v-model="addNoticeConfigForm.enable"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNoticeTypeCommit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    mounted() {
      this.getNoticeTypeAll();
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
      async deleteNoticeTypeClick(row) {
        var noticeTypeId = row.id
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`http://127.0.0.1:8080/deleteNoticeConfigById/${noticeTypeId}`).then(response => {
            if (response.data.code == 200) {
              this.$message({
                type: 'success',
                showIcon: true,
                message: response.data.msg
              })
            } else {
              this.$message({
                message: response.data.msg,
                type: "error",
                showIcon: true
              })
            }
            this.getNoticeTypeAll()
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
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      async  addNoticeTypeCommit() {
        this.addNoticeConfigForm.usernames = ""
        await  this.$axios.post("http://127.0.0.1:8080/addNoticeType", this.addNoticeConfigForm).then(response => {
          if (response.data.code == 200) {
            this.$message({
              type: 'success',
              showIcon: true,
              message: response.data.msg
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
              showIcon: true
            })
          }
          this.getNoticeTypeAll()
          this.addDialogFormVisible = false
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
        });

      },
      async addNoticeTypeClick(row) {
      await  this.$axios.get("http://127.0.0.1:8080/getNoticeTypeNamesByIsChange").then(response => {
          if (response.data.code == 200) {
            this.addNoticeConfigForm.noticeTypeNameOptions = response.data.data
          } else {
            this.$message({
              message: response.data.data.msg,
              type: "error",
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
        });
       await this.$axios.get("http://127.0.0.1:8080/getUserNameAll").then(response => {
          if (response.data.code == 200) {
            this.addNoticeConfigForm.usernameOptions = response.data.data
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
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
        });
        this.addDialogFormVisible = true
      },
     async viewNoticeConfigClick(row) {
       var noticeTypeId = row.id
       this.viewAndEditNoticeConfigForm.noticeTypeId = noticeTypeId
        // 根据通知类型id找通知类型
        var noticeTypeId = row.id
      await  this.$axios.get(`http://127.0.0.1:8080/noticeType/${noticeTypeId}`).then(response => {
          if (response.data.code == 200) {
            this.viewAndEditNoticeConfigForm.noticeTypeName = response.data.data.name
            this.viewAndEditNoticeConfigForm.intervalMinute = response.data.data.intervalMinute
            this.viewAndEditNoticeConfigForm.WebHookAddr = response.data.data.webHookAddr
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
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
        });
        var data = {
          params: {
            noticeTypeId: row.id
          }
        }
        // 获取已经选择好的用户
       await this.$axios.get("http://127.0.0.1:8080/getUserNameByNoticeTypeId", data).then(response => {
          if (response.data.code == 200) {
            this.viewAndEditNoticeConfigForm.usernames = response.data.data.usernames
            this.viewAndEditNoticeConfigForm.enable = response.data.data.enable
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
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
        });

        this.viewNoticeConfigDialogVisible = true
      },

      async getNoticeTypeAll() {
        this.loading = false
        await this.$axios.get("http://127.0.0.1:8080/noticeType").then(response => {
          if (response.data.code == 200) {
            this.tableData = response.data.data
            // tableData添加noticeTypeName字段
            this.tableData = this.tableData.map(item => {
              return {
                ...item,
                noticeTypeName: item.name
              };
            })

          } else {
            this.$message({
              message: response.data.data,
              type: "error",
              showIcon: true
            })
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
        });

      },
      async editNoticeConfigClick(row) {
        var noticeTypeId = row.id
        this.viewAndEditNoticeConfigForm.noticeTypeId = noticeTypeId
        this.$axios.get(`http://127.0.0.1:8080/noticeType/${noticeTypeId}`).then(response => {
          if (response.data.code == 200) {
            this.viewAndEditNoticeConfigForm.noticeTypeName = response.data.data.name
            this.viewAndEditNoticeConfigForm.intervalMinute = response.data.data.intervalMinute
            this.viewAndEditNoticeConfigForm.WebHookAddr = response.data.data.webHookAddr
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
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
        });
        let data = {
          params: {
            noticeTypeId: row.id
          }
        }
       await this.$axios.get("http://127.0.0.1:8080/getUserNameByNoticeTypeId", data).then(response => {
          if (response.data.code == 200) {
            this.viewAndEditNoticeConfigForm.usernames = response.data.data.usernames
            this.viewAndEditNoticeConfigForm.enable = response.data.data.enable
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
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
        });

       await this.$axios.get("http://127.0.0.1:8080/getUserNameAll").then(response => {
          if (response.data.code == 200) {
            this.viewAndEditNoticeConfigForm.userNameOptions = response.data.data
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
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
        });
        this.editNoticeConfigDialogVisible = true
      },
      async editNoticeConfigCommit() {
       await this.$axios.post("http://127.0.0.1:8080/viewAndEditNoticeConfig", this.viewAndEditNoticeConfigForm).then(response => {
          if (response.data.code == 200) {
            this.getNoticeTypeAll();
            this.$message({
              message: response.data.msg,
              type: "success",
              showIcon: true
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "error",
              showIcon: true
            })
          }
          this.editNoticeConfigDialogVisible = false
          this.getNoticeTypeAll()
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
        });

      },

    },

    data() {
      return {
        tableData: [],
        loading: true,
        editNoticeConfigDialogVisible: false,
        viewNoticeConfigDialogVisible: false,
        addDialogFormVisible: false,
        labelPosition: "right",
        formLabelWidth: '120px',
        viewAndEditNoticeConfigForm: {
          noticeTypeId: "",
          noticeTypeName: "",
          usernames: "",
          intervalMinute: "",
          WebHookAddr: "",
          enable: true,
          userNameOptions: []
        },
        addNoticeConfigForm: {
          noticeTypeName: "",
          noticeTypeNameOptions: "",
          WebHookAddr: "",
          usernames: "",
          usernameOptions: [],
          intervalMinute: "",
          enable: true
        },
        rules: {
          intervalMinute: [{
              required: true,
              message: '请输入0-1440的数字',
              min: 0,
              max: 1440,
              trigger: 'blur'
            },

          ],
        },
        addRules: {
          intervalMinute: [{
              required: true,
              message: '请输入0-1440的数字',
              min: 0,
              max: 1440,
              trigger: 'blur'
            },

          ],
        },
      }
    }
  }
</script>

<style>
</style>
