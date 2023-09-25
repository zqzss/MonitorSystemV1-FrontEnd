<template>
  <el-header>
    <!-- 右侧导航栏折叠按钮 -->
    <span class="btn-collapse" @click="collapseChage" :title="collapse ? '展开侧边栏' : '收起侧边栏'">
      <i class="el-icon-menu"></i>
    </span>
    <!-- 系统标题 -->
    <h3 class="header-title margin-l-10">后台管理系统</h3>
    <div class="header-right">
      <!-- 消息中心 -->
      <div class="btn-info">
        <el-tooltip placement="bottom">
          <span slot="content">{{message ? `有${message}条消息` : '消息中心'}}</span>
          <router-link to="/info">
            <i class="el-icon-bell"></i>
          </router-link>
        </el-tooltip>
        <span class="btn-info-tip" v-if="message"></span>
      </div>
      <!-- 用户头像 -->
      <img class="header-portrait" src="static/portrait.jpg" alt="用户头像">
      <!-- 用户名下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <a href="https://github.com/nut77/vue2-elementui-admin" target="_blank">
            <el-dropdown-item>项目仓库</el-dropdown-item>
          </a> -->
          <el-dropdown-item  command="updatePassword">修改密码</el-dropdown-item>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-drawer title="修改密码" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <el-form label-position="top" v-show="drawer" label-width="80px" :model="formUpdatePassword"
          style="padding-left: 20px;padding-right: 20px;" :rules="rules" ref="ruleForm">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="formUpdatePassword.oldPassword" clearable show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="formUpdatePassword.newPassword" clearable show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="formUpdatePassword.confirmPassword" clearable show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">确认</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>

  </el-header>
</template>

<script>
  import Bus from './bus';
  export default {
    name: "Header",
    data() {
      return {
        message: 1,
        username: localStorage.getItem('username'),
        collapse: false,
        drawer: false,
        direction: 'rtl',
        formUpdatePassword: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [{
              required: true,
              message: '请输入旧密码',
              trigger: 'blur'
            },
            {
              min: 4,
              max: 16,
              message: '长度在 4 到 16 个字符',
              trigger: 'blur'
            }
          ],
          newPassword: [{
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            },
            {
              min: 4,
              max: 16,
              message: '长度在 4 到 16 个字符',
              trigger: 'blur'
            }
          ],
          confirmPassword: [{
              required: true,
              message: '请输入确认密码',
              trigger: 'blur'
            },
            {
              min: 4,
              max: 16,
              message: '长度在 4 到 16 个字符',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    methods: {
      // 点击修改密码确认按钮
      onSubmit(formName) {
        let isValid = true; // 标记变量
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.$notify.error({
              title: '错误',
              message: '表单验证不通过！'
            });
            isValid = false;
          }
        });

        if (isValid == false) {
          return;
        }
        if (this.formUpdatePassword.newPassword != this.formUpdatePassword.confirmPassword) {
          this.$notify.error({
            title: '错误',
            message: '新密码和确认密码不一致！'
          });
        } else {
          const userId = localStorage.getItem("userId");
          let data = {
            oldPassword: this.formUpdatePassword.oldPassword,
            newPassword: this.formUpdatePassword.newPassword,
            confirmPassword: this.formUpdatePassword.confirmPassword,
            userId: userId
          }
          this.$axios.post("http://127.0.0.1:8080/user/updatePwd", data).then(response => {
            if (response.data.code == 200) {
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success'
              });
              this.drawer = false
              this.formUpdatePassword = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
              }
            } else {
              this.$notify({
                title: '错误',
                message: response.data.msg,
                type: 'error'
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
            else  {
              this.$message({
                message: "无法连接服务器！",
                type: 'error',
                showIcon: true
              });
            }

          })

        }
      },
      onCancel() {
        this.drawer = false,
          this.formUpdatePassword = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
      },
      // 抽屉关闭
      handleClose(done) {

      },
      // 侧边栏折叠打开效果
      collapseChage() {

        this.collapse = !this.collapse;
        Bus.$emit('collapse', this.collapse);
      },

      // 用户名下拉菜单选择事件
      handleCommand(command) {

        if ('loginout' == command) {
          let data = {
            username: localStorage.getItem('username')
          }
          this.$axios.post('http://127.0.0.1:8080/logout', data).
          then(reponse => {
            if (reponse.data.code == 200) {
              localStorage.removeItem('username');
              localStorage.removeItem('token');
              this.$router.push('/login');
              console.log(localStorage);
            }

          }).catch(error => {
            this.$message({
              message: '连接服务器失败!',
              type: 'error',
              showIcon: true
            });
          })


        }
        if ('updatePassword' == command) {
          this.drawer = true
        }
      }
    }
  }
</script>

<style scoped lang="less">
  [class*='el-icon'] {
    cursor: pointer;
  }

  .el-header {
    width: 100%;
    padding: 0 30px;
    background-color: @headerBgColor;
    // background-color: rgb(103, 196, 237);
    color: white;
    // color: rgb(235, 204, 111);
    font-size: 16px;
    line-height: 53px;
  }

  .header-title,
  .btn-info {
    display: inline-block;
  }

  .header-title,
  .btn-collapse,
  .el-icon-bell {
    font-size: 25px;
  }

  .header-right {
    float: right;
  }

  .btn-collapse {
    vertical-align: sub;
  }

  .btn-info {
    position: relative;
  }

  .btn-info-tip {
    position: absolute;
    top: 10px;
    .circle(8px);
    background-color: #ff464f;
  }

  .el-icon-bell {
    color: white;
    vertical-align: text-top;
  }

  .header-portrait {
    .circle(40px);
    margin: 0 20px;
    vertical-align: middle;
  }

  .el-dropdown-link {
    color: white;
    cursor: pointer;
  }
</style>
