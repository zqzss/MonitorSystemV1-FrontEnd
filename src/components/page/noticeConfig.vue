<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">

      <el-table-column type="index" prop="index" style="width: 25%">
      </el-table-column>
      <el-table-column prop="name" property="name" label="通知类型" style="width: 25%">
      </el-table-column>
      <el-table-column prop="intervalMinute" property="intervalMinute" label="间隔时间(分钟)" style="width: 25%">
      </el-table-column>

      <el-table-column label="操作" style="width: 25%">
        <template slot-scope="scope">
          <el-button  type="text" size="medium" @click="viewNoticeConfigClick(scope.row)">查看</el-button>
          <el-button size="medium" type="text" @click="editNoticeConfigClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="form" :rules="rules" :label-position="labelPosition">
        <el-form-item label="通知类型" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户" :label-width="formLabelWidth">
          <el-select v-model="form.users" multiple placeholder="请选择用户">

            <el-option v-for="(item,index) in form.options" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔时间(分钟)" prop="intervalMinute" :min="0" :max="1440" :label-width="formLabelWidth">
          <el-input v-model="form.intervalMinute" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="padding-left: 52px;">
          <el-switch v-model="form.enable"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNoticeConfigCommit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看" :visible.sync="viewDialogFormVisible" width="450px">
      <el-form :model="form" :rules="rules" :label-position="labelPosition">
        <el-form-item label="通知类型" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户" :label-width="formLabelWidth">
          <el-select v-model="form.users" multiple placeholder="请选择用户" disabled>

            <el-option v-for="(item,index) in form.options" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔时间(分钟)" prop="intervalMinute" :min="0" :max="1440" :label-width="formLabelWidth">
          <el-input v-model="form.intervalMinute" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="padding-left: 52px;">
          <el-switch v-model="form.enable" disabled></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="editNoticeConfigCommit">确 定</el-button> -->
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
      viewNoticeConfigClick(row){
        this.getNoticeTypeAll();
        this.form.name = row.name
        let data = {
          params: {
            name: row.name
          }
        }
        this.form.intervalMinute = row.intervalMinute
        this.$axios.get("http://127.0.0.1:8080/noticeItem/username", data).then(response => {
          if (response.data.code == 200) {
            this.form.users = response.data.data.usernames
            this.form.enable = response.data.data.enable
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

        this.$axios.get("http://127.0.0.1:8080/user/name").then(response => {
          if (response.data.code == 200) {
            this.form.options = response.data.data
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
        this.viewDialogFormVisible = true
      },
      getNoticeTypeAll() {
        this.$axios.get("http://127.0.0.1:8080/noticeType").then(response => {
          if (response.data.code == 200) {
            this.tableData = response.data.data
          } else {
            this.$message({
              message: response.data.data,
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

      },
      editNoticeConfigClick(row) {
        this.getNoticeTypeAll();
        this.dialogFormVisible = true
        this.form.name = row.name
        let data = {
          params: {
            name: row.name
          }
        }
        this.form.intervalMinute = row.intervalMinute
        this.$axios.get("http://127.0.0.1:8080/noticeItem/username", data).then(response => {
          if (response.data.code == 200) {
            this.form.users = response.data.data.usernames
            this.form.enable = response.data.data.enable
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

        this.$axios.get("http://127.0.0.1:8080/user/name").then(response => {
          if (response.data.code == 200) {
            this.form.options = response.data.data
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
      },
      editNoticeConfigCommit() {
        console.log(this.form)
        this.$axios.post("http://127.0.0.1:8080/noticeItem", this.form).then(response => {
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

        this.dialogFormVisible = false
      },

    },

    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        viewDialogFormVisible: false,
        labelPosition: "right",
        formLabelWidth: '120px',
        form: {
          name: "",
          users: "",
          intervalMinute: "",
          enable: true,
          options: []
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
        }
      }
    }
  }
</script>

<style>
</style>
