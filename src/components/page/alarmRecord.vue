<template>

  <div>
    <div style="background-color: white;border: rgb(230, 235, 245) solid;box-shadow:rgba(0, 0, 0, 0.1)">
      <div class="select_div">
        <el-form ref="formData" :model="formData">
          <el-row align="center">
            <el-col :span="5">
              <el-form-item label="主机">
                <el-input v-model="formData.hostName" placeholder="请输入主机名称" style="width: 180px;" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="日期范围">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.dateRange" type="daterange"
                  start-placeholder="开始日期" range-separator="一" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="时间范围">
                <!-- <el-time-select placeholder="起始时间"  v-model="formData.startTime" :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59'
                    }">
                </el-time-select>
                <el-time-select placeholder="结束时间" v-model="formData.endTime" :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:59',
                      minTime: startTime
                    }">
                </el-time-select> -->
                <el-time-picker is-range v-model="formData.timeRange" range-separator="一" start-placeholder="开始时间"
                  end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间范围">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item style="text-align: right;">
                <el-button type="primary" @click="clickQuery"
                  style="color: #fff;background-color: #409eff;border-color: #409eff;margin-bottom:0px;">查询</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!--分页-->
    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
      style="margin-top: 20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!--表格内容-->
    <el-table ref="list" :data="tableData" style="width: 100%" border stripe highlight-current-row
      :default-sort="{prop: 'date', order: 'descending'}" class="table" @row-click="handleRowClick" v-loading="loading">
      <!-- <el-table-column
        type="selection"
        width="45"
        align="center">
      </el-table-column> -->
      <el-table-column type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column property="date" label="日期" width="250" sortable prop="alarmTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 5px">{{scope.row.alarmTime}}</span>
        </template>
      </el-table-column>
      <el-table-column property="hostName" label="主机名" width="180" prop="hostName">
      </el-table-column>
      <el-table-column property="monitorTypeName" label="监控类型" prop="monitorTypeName">
      </el-table-column>
      <el-table-column property="detail" label="具体" prop="detail">
      </el-table-column>
      <el-table-column property="warnValue" label="数据" prop="data">
      </el-table-column>

    </el-table>

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
        loading: true,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateRange: '',
        formData: {
          hostName: '',
          timeRange: '',
          startTime: '',
          endTime: '',
          dateRange: '',
        },
        timePickerOptions: {
          selectableRange: '00:00:00 - 24:00:00',
        },
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        // const url = `http://127.0.0.1:8080/monitorAlarm?page=${this.currentPage}&pageSize=${this.pageSize}`;
        const url = "http://127.0.0.1:8080/monitorAlarm/query"
        // this.$axios.get(url).then(response => {
          this.$axios.post(url,{
          hostName: this.formData.hostName,
          dateRange: this.formData.dateRange,
          timeRange: this.formData.timeRange,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }).then(response => {
            console.log(response.data.data.tableData)

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
            this.loading=false
          })
      },
      // 点击表格行
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
      },
      clickQuery() {
        this.fetchData();
      },
      resetForm() {
        // this.$refs.form.resetFields();
        this.formData = {
          hostName: '',
          timeRange: '',
          startTime: '',
          endTime: '',
          dateRange: '',
        }
        // 重置其他数据
        this.currentPage = 1;
        this.fetchData();
      },
    }
  }
</script>

<style scoped lang="less">
  .el-form {
    padding: 0 10px;
  }

  // .el-date-editor {
  //   width: 100% !important;
  // }
  .table {
    width: 100% !important;
  }

  .my-date-picker {
    /* 重新定义样式，确保不受其他 CSS 样式影响 */

  }

  .my-button {
    /* 只作用于当前组件的样式 */

  }

  .select_div {
    padding-bottom: 0px;
    padding-top: 20px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 0px;
    margin-bottom: 0px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
