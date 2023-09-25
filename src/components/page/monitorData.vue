<template>
  <div>

    <div style="display: flex; justify-content: flex-end;" fit>
      <el-input placeholder="请输入主机名" v-model="inputHostName" clearable style="margin-right: 30px;width: 200px;">
      </el-input>
      <el-button type="primary" class="btn" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    <!--表格内容-->
    <el-table ref="list" :data="tableData" style="width: 100%" border stripe highlight-current-row
      :default-sort="{prop: 'date', order: 'descending'}" @row-click="handleRowClick" v-loading="loading">
      <!-- <el-table-column
        type="selection"
        width="45"
        align="center">
      </el-table-column> -->
      <el-table-column type="index" label="序号" width="200">
      </el-table-column>
      <el-table-column property="date" label="日期" width="200" sortable prop="createTime">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span style="margin-left: 5px">{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column property="hostName" label="主机名" width="200" prop="hostName">
      </el-table-column>
      <el-table-column property="monitorTypeName" label="监控类型" width="200" prop="monitorTypeName">
      </el-table-column>
      <el-table-column property="monitorTypeName" label="具体" width="200" prop="detail">
      </el-table-column>
      <el-table-column property="warnValue" label="数据" prop="data">
      </el-table-column>

    </el-table>
    <!--分页-->
    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
      @current-change="handleCurrentChange" @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper" style="margin-top: 20px;padding-bottom: 20px;">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Table",
    data() {
      return {
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总条数
        tableData: [],
        isShowEditDialog: false,
        inputHostName: "",
        loading: true
      }
    },
    mounted() {
      this.fetchData();
      this.startTimer();
      // const message = {
      //     currentPage: 1,
      //     pageSize: 10
      // };
      // const socket = new WebSocket(`ws://localhost:8080/ws/${message}`);

      // socket.onmessage = (event) => {
      //   this.tableData = JSON.parse(event.data).data;
      //   // 处理接收到的CPU使用率数据
      //   console.log(this.tableData);
      // };

      // socket.send(JSON.stringify(message));
    },
    beforeDestroy() {
      // 在组件销毁前停止定时器
      this.stopTimer();
    },
    methods: {
      startTimer() {
        // 使用 setInterval 每10秒调用一次 fetchData 方法
        this.timer = setInterval(() => {
          this.fetchData();
        }, 10000);
      },
      stopTimer() {
        // 在组件销毁前清除定时器
        clearInterval(this.timer);
      },
      fetchData() {
        // const url = `http://127.0.0.1:8080/monitorItem?page=${this.currentPage}&pageSize=${this.pageSize}`;
        const url = `http://127.0.0.1:8080/monitorData`
        const data = {
          "currentPage": this.currentPage,
          "pageSize": this.pageSize,
          "hostName": this.inputHostName
        }
        this.$axios.post(url, data).then(response => {

            this.tableData = response.data.data.tableData;
            this.total = response.data.data.total;
            if (response.data.code == 200) {
              this.tableData = response.data.data.tableData;
              this.total = response.data.data.total;

            } else {
              this.$message({
                message: response.data.msg,
                type: 'error',
                showIcon: true
              })
            }
            this.loading=false
          })
          .catch(error => {
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
      handleRowClick(row, event, column) {

        // 仅选中当前行
        this.setCurRowChecked(row);
      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        this.fetchData();
      },
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.fetchData();
      },

      // 选中当前行-当前行的复选框被勾选
      setCurRowChecked(row) {

        this.$refs.list.clearSelection();
        this.$refs.list.toggleRowSelection(row);
      }
    }
  }
</script>

<style scoped lang="less">
  .el-form {
    padding: 0 10px;
  }

  .el-date-editor {
    width: 100% !important;
  }
</style>
