<template>
  <div class="stock-wrapper">
    <div class="gtja-section">
      <div class="pure-g">
        <div class="pure-u-1-5" v-for="(item, index) of shStock" :key="index">
          <div class="index" id="szzs-panel">
            <h2>{{ item[1] }}</h2>

            <div v-if="item[2] - item[6] > 0" class="stock-up">
              <span>{{ item[2] }}</span>
              <p>
                <i v-if="item[2] - item[6] > 0" class="el-icon-top"></i>
                <i v-if="item[2] - item[6] < 0" class="el-icon-bottom"></i>
                {{ (item[2] - item[6]).toFixed(2) }}
                <i v-if="item[2] - item[6] > 0" class="el-icon-top"></i>
                <i v-if="item[2] - item[6] < 0" class="el-icon-bottom"></i>
                {{ item[3] }}
              </p>
            </div>
            <div v-if="item[2] - item[6] < 0" class="stock-down">
              <span>{{ item[2] }}</span>
              <p>
                <i v-if="item[2] - item[6] > 0" class="el-icon-top"></i>
                <i v-if="item[2] - item[6] < 0" class="el-icon-bottom"></i>
                {{ (item[2] - item[6]).toFixed(2) }}
                <i v-if="item[2] - item[6] > 0" class="el-icon-top"></i>
                <i v-if="item[2] - item[6] < 0" class="el-icon-bottom"></i>
                {{ item[3] }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="false">
      <el-button @click="drawer = true" type="primary" style="margin-left: 16px">操作</el-button>
      <el-drawer :visible.sync="drawer" :direction="direction">
        <div class="drawerSwapper" style="margin: 10px">
          <el-button round size="mini" @click="updateStockList()" type="primary" style="margin-left: 16px"
            >更新股票列表</el-button
          >

          <el-divider>
            <div style="display: flex">
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="updateStockTimeInfo()"
                type="primary"
                style="margin-left: 16px"
                >更新分时线</el-button
              >
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="stopUpdateTaskByType(1)"
                type="danger"
                style="margin-left: 16px"
                >停止更新</el-button
              >
            </div>
          </el-divider>
          <div>{{ timeTaskInfo }}</div>
          <el-progress :text-inside="true" :percentage="percentageTimeData"></el-progress>

          <el-divider>
            <div style="display: flex">
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="updateStockDayInfo()"
                type="primary"
                style="margin-left: 16px"
                >更新日线</el-button
              >
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="stopUpdateTaskByType(2)"
                type="danger"
                style="margin-left: 16px"
                >停止更新</el-button
              >
            </div>
          </el-divider>
          <div>{{ dayTaskInfo }}</div>
          <el-progress :text-inside="true" :percentage="percentageDayData"></el-progress>

          <el-divider>
            <div style="display: flex">
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="updateStockWeekInfo()"
                type="primary"
                style="margin-left: 16px"
                >更新周线</el-button
              >
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="stopUpdateTaskByType(3)"
                type="danger"
                style="margin-left: 16px"
                >停止更新</el-button
              >
            </div>
          </el-divider>
          <div>{{ weekTaskInfo }}</div>
          <el-progress :text-inside="true" :percentage="percentageWeekData"></el-progress>

          <el-divider>
            <div style="display: flex">
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="updateStockMonthInfo()"
                type="primary"
                style="margin-left: 16px"
                >更新月线</el-button
              >
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="stopUpdateTaskByType(4)"
                type="danger"
                style="margin-left: 16px"
                >停止更新</el-button
              >
            </div>
          </el-divider>
          <div>{{ monthTaskInfo }}</div>
          <el-progress :text-inside="true" :percentage="percentageMonthData"></el-progress>
        </div>
      </el-drawer>
    </div>
    <el-table class="stock-table" :data="stockTableData" v-loading="loading" stripe>
      <el-table-column label="股票编号" width="110">
        <template slot-scope="scope">
          <span class="stock-num blue" @click="handleEdit(scope.$index, scope.row)">{{ scope.row.stocknum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="股票名称" width="110">
        <template slot-scope="scope">
          <span class="stock-name blue" @click="handleEdit(scope.$index, scope.row)">{{ scope.row.stockname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新价" width="90" align="center">
        <template slot-scope="scope">
          <span class="stock-close" :class="doubleToPercent(scope.row.updownrange).includes('-') ? 'green' : 'red'">{{ scope.row.close }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单日涨跌幅" width="94" align="center">
        <template slot-scope="scope">
          <span class="stock-updownrange" :class="doubleToPercent(scope.row.updownrange).includes('-') ? 'green' : 'red'">{{ doubleToPercent(scope.row.updownrange) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="3日涨跌幅" width="94" align="center">
        <template slot-scope="scope">
          <span class="stock-updownrange3" :class="doubleToPercent(scope.row.updownrange3).includes('-') ? 'green' : 'red'">{{ doubleToPercent(scope.row.updownrange3) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="5日涨跌幅" width="94" align="center">
        <template slot-scope="scope">
          <span class="stock-updownrange5" :class="doubleToPercent(scope.row.updownrange5).includes('-') ? 'green' : 'red'">{{ doubleToPercent(scope.row.updownrange5) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="涨跌额" width="90" align="center">
        <template slot-scope="scope">
          <span class="stock-updownprices" :class="scope.row.updownprices.toFixed(2).includes('-') ? 'green' : 'red'">{{ scope.row.updownprices.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="换手率" width="90" align="center">
        <template slot-scope="scope">
          <span class="stock-turnoverrate">{{ doubleToPercent(scope.row.turnoverrate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="振幅" width="90" align="center">
        <template slot-scope="scope">
          <span class="stock-amplitude">{{ doubleToPercent(scope.row.amplitude) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上市日期" width="120" prop="lISTING_DATE" align="center"></el-table-column>
      <el-table-column label="流通股本" align="center">
        <template slot-scope="scope">
          {{ parseInt(scope.row.totalFlowShares) }}
        </template>
      </el-table-column>
      <el-table-column label="总股本" align="center">
        <template slot-scope="scope">
          {{ parseInt(scope.row.totalShares) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="60" fixed="right">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination 
      class="stock-pagination"
      :current-page="pageData.page"
      :page-size="pageData.limit"
      :total="pageData.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="sizes, total, prev, pager, next"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
  </div>
</template>

<script>
import {
  getStockList,
  updateStockList,
  updateStockDayInfo,
  updateStockTimeInfo,
  updateStockWeekInfo,
  updateStockMonthInfo,
  stopUpdateTaskByType,
  getShStock
} from '@/request/stock.js'

export default {
  name: 'StockList',
  data() {
    return {
      // 表格树
      stockTableData: [],
      // 分页组件数据
      pageData: {
        page: 1,  //  页码
        limit: 20,  //  页大小
        total: 0
      },
      loading: false,
      drawer: false,
      direction: 'rtl',
      shStock: [],
      percentageTimeData: 0,
      percentageDayData: 0,
      percentageWeekData: 0,
      percentageMonthData: 0,
      timeTaskInfo: '',
      dayTaskInfo: '',
      weekTaskInfo: '',
      monthTaskInfo: ''
    }
  },
  created() {
    this.getStockTableData()
    this.getShStock()
    this.initSocket()
  },
  methods: {
    getSocket() {
      var webSocket = null
      var connectUrl = ''

      if (window.location.protocol == 'http:') {
        connectUrl = 'ws://localhost:8080/websocket/' + 'stock'
      } else {
        connectUrl = 'wss://localhost:8080/websocket/' + 'stock'
      }

      if ('WebSocket' in window) {
        webSocket = new WebSocket(connectUrl)
      } else if ('MozWebSocket' in window) {
        webSocket = new MozWebSocket(connectUrl)
      } else {
        console.log('Error: WebSocket is not supported by this browser.')
        return
      }
      return webSocket
    },
    initSocket() {
      let socket = this.getSocket()
      let _this = this

      socket.onopen = function() {
        console.log('Info: WebSocket connection opened.')
      }

      socket.onmessage = function(message) {
        var result = JSON.parse(message.data)
        if (result.runTask == true) {
          console.log(JSON.stringify(result))
          var taskId = result.taskId

          var totalCount = result.totalCount
          var completeCount = result.completeCount
          var taskInfo = result.taskInfo
          var fenzi = (completeCount / totalCount) * 100
          if (taskId == 0) {
            _this.percentageTimeData = fenzi.toFixed(0)
            _this.timeTaskInfo = taskInfo
          }
          if (taskId == 1) {
            _this.percentageDayData = fenzi.toFixed(0)
            _this.dayTaskInfo = taskInfo
          }
          if (taskId == 2) {
            _this.percentageWeekData = fenzi.toFixed(0)
            _this.weekTaskInfo = taskInfo
          }
          if (taskId == 3) {
            _this.percentageMonthData = fenzi.toFixed(0)
            _this.monthTaskInfo = taskInfo
          }

          console.log(this.percentageDayData)
          // layui.element.progress('demo', (fenzi + "").substr(0, (fenzi + "").indexOf(".") + 3) + '%')
          // $("#processInfo").text(result.taskInfo)
          console.log('接受消息：' + result.runTask)
        }
      }

      /*
      socket.onclose = function() {
          document.getElementById('chat').onkeydown = null;
          Console.log('Info: WebSocket closed.');
      };*/
    },
    getShStock() {
      getShStock().then((res) => {
        this.shStock = res.list
        console.log(res)
      })
    },
    /**
     * 表格数据获取相关事件 | 获取表格数据
     */
    getStockTableData() {
      this.loading = true
      getStockList({
        page: this.pageData.page,
        limit: this.pageData.limit
      }).then((res) => {
        this.loading = false
        if (res.success) {
          this.stockTableData = res.data
          this.pageData.total = res.count
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    /**
     * 表格数据获取相关事件 | 分页组件 | 当前页码改变
     */
    handleCurrentChange(page) {
      this.pageData.page = page
      this.getStockTableData()
    },
    /**
     * 表格数据获取相关事件 | 分页组件 | 页大小改变时
     */
    handleSizeChange(limit) {
      this.pageData.limit = limit
      this.getStockTableData()
    },
    updateStockList() {
      updateStockList().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockDayInfo() {
      updateStockDayInfo().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockWeekInfo() {
      updateStockWeekInfo().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockMonthInfo() {
      updateStockMonthInfo().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockTimeInfo() {
      updateStockTimeInfo().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    stopUpdateTaskByType(taskType) {
      stopUpdateTaskByType({ taskType: taskType }).then((res) => {
        if (res.success) {
          alert('已停止')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/stock/detail/' + row.stocknum
      })
      // console.log(row);
      // console.log(index);
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    doubleToPercent(count) {
      var resultCount = (count * 100).toFixed(2)
      var resultStr = resultCount + '%'
      return resultStr
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';

.stock-wrapper {
  display: block !important;
  padding 16px 0 24px 0

  .gtja-section {
    margin-bottom 16px
    width: 100%;
    height: 222px;
    background: $ThemeColor;

    .pure-g {
      text-rendering: optimizespeed;
      display: flex;
      display: -webkit-flex;
      -webkit-flex-flow: row wrap;
      display: -ms-flexbox;
      -ms-flex-flow: row wrap;

      .pure-u-1-5 {
        width: 20%;

        .index {
          color: #fff;
          text-align: center;
          padding-top: 55px;

          h2 {
            font-size: 18px;
            font-weight: lighter;
            margin-bottom: 8px;
          }

          .stock-up {
            color: #ff5c5c;

            span {
              display: block;
              font-size: 36px;
              margin-bottom: 10px;
            }

            p {
              font-size: 14px;
              margin-bottom: 10px;

              .gtja-iconfont {
                font-family: 'gtja-iconfont' !important;
                font-size: 1.6rem;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -webkit-text-stroke-width: 0.2px;
                -moz-osx-font-smoothing: grayscale;
              }
            }
          }

          .stock-down {
            color: #4f9f3f;

            span {
              display: block;
              font-size: 36px;
              margin-bottom: 10px;
            }

            p {
              font-size: 14px;
              margin-bottom: 10px;

              .gtja-iconfont {
                font-family: 'gtja-iconfont' !important;
                font-size: 1.6rem;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -webkit-text-stroke-width: 0.2px;
                -moz-osx-font-smoothing: grayscale;
              }
            }
          }
        }
      }
    }
  }

  .stock-table {
    position sticky
    top 0
    max-height calc(100vh - 64px)
    width: 100%
    >>> td {
      padding: 8px 0;
      .blue {
        color $Primary 
        cursor pointer
        &:hover {
          color $ThemeColor
        } 
      }
      .red {
        color $Danger 
        cursor pointer
        &:hover {
          color $ThemeColor
        } 
      }
      .green {
        color $Success
        cursor pointer
        &:hover {
          color $ThemeColor
        } 
      }
    }
    >>> .el-table__header-wrapper {
      th {
        background: $tabBackColor;
        padding: 8px 0;
        color $PrimaryText
      }
    }

    >>> .el-table__body-wrapper {
      max-height calc(100vh - 104px)
      overflow-y: auto;
      setScrollbar(8px);
    }
  }

  .stock-pagination {
    margin-top 8px
    text-align: center;
  }
}
</style>
