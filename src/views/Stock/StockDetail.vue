<template>
  <div class="stockDetailWrapper">
    <div class="stockBaseInfo">
      <table style="width: 100%;">
        <tr style="font-size: 18px;">
          <td colspan="2">{{stockname}}({{stocknum}})</td>
          <td colspan="2">
            <div class="search rel" id="stockSearchId">
              <template>
                <el-select
                  v-model="value"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="查询股票"
                  :remote-method="queryStockByFilter"
                  :loading="loading"
                  @change="inputChange"
                >
                  <el-option
                    v-for="item in stockList"
                    :key="item.stocknum"
                    :label="item.stockname"
                    :value="item.stocknum"
                  ></el-option>
                </el-select>
              </template>
            </div>
            <button class="layui-btn" style="position: absolute; right: 50px;">+加自选</button>
          </td>
        </tr>
        <tr>
          <td v-if="updownprices >= 0" style="font-size: 54px;height: 70px;color: red;">
            {{close}}
            <i class="layui-icon layui-icon-triangle-d"></i>
          </td>
          <td v-if="updownprices < 0" style="font-size: 54px;height: 70px;color: green;">
            {{close}}
            <i class="layui-icon layui-icon-triangle-d"></i>
          </td>
          <td v-if="updownprices >= 0" style="color: red;">{{(updownprices * 1).toFixed(2)}}</td>
          <td v-if="updownprices < 0" style="color: green;">{{(updownprices * 1).toFixed(2)}}</td>
          <td v-if="updownprices >= 0" style="color: red;">{{(updownrange * 100).toFixed(2)}}%</td>
          <td v-if="updownprices < 0" style="color: green;">{{(updownrange * 100).toFixed(2)}}%</td>
        </tr>
        <tr>
          <td>{{amount}}</td>
          <td>{{amplitude}}</td>
          <td>{{turnoverrate}}</td>
          <td>{{preclose}}</td>
        </tr>
        <tr>
          <td>{{comparison}}</td>
          <td>{{high}}</td>
          <td>{{low}}</td>
          <td>{{open}}</td>
        </tr>
        <tr>
          <td>{{volume}}</td>
          <td>{{totalmarketvalue}}</td>
          <td>{{flowmarketvalue}}</td>
          <td>{{totalFlowShares}}</td>
        </tr>
      </table>
    </div>
    <div>
      <template>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="分时线" name="first">
            <div id="k-chart" class="main-chart"></div>
          </el-tab-pane>
          <el-tab-pane label="日线" name="second">
            <div id="day-chart" class="main-chart"></div>
          </el-tab-pane>
          <el-tab-pane label="周线" name="third">
            <div id="week-chart" class="main-chart"></div>
          </el-tab-pane>
          <el-tab-pane label="月线" name="fourth">
            <div id="month-chart" class="main-chart"></div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <div>
      <BackTest v-if="stockInfo" :stockInfo="stockInfo"></BackTest>
    </div>
  </div>
</template>

<script>
import {
  getStocktimebar,
  queryStockByFilter,
  getStockInfoById,
  getStockdaybar,
  getStockweekbar,
  getStockmonthbar
} from '@/request/stock.js'
import { initMOption } from '@/assets/js/timeline.js'
import { makeOption } from '@/assets/js/dayline.js'
import BackTest from './components/BackTest.vue'
export default {
  name: 'StockDetail',
  components: {
    BackTest
  },
  data() { 
    return {
      stockInfo:{},
      amount: '',
      amplitude: '',
      close: '',
      high: '',
      low: '',
      open: '',
      preclose: '',
      stocknum: '',
      stockname: '',
      turnoverrate: '',
      updownprices: '',
      updownrange: '',
      volume: '',
      totalmarketvalue: '',
      flowmarketvalue: '',
      comparison: '',
      totalFlowShares: '',
      stockList: [],
      activeName: 'first',
      stockDayDataSave: [],
      stockWeekDataSave: [],
      stockMonthDataSave: [],
      echarts: {}
    }
  },
  created() {
    this.echarts = require('echarts')
    this.getStockInfoById(this.stockNum)
  },
  mounted() {
    this.getStocktimebar(this.stockNum)
  },
  computed: {
    stockNum() {
      return Number(this.$route.params.stocknum)
    }
  },
  methods: {
    tabClick(tab) {
      if (tab.name == 'first') {
        // var dom = document.getElementById("day-chart");
        // let dayChart = echarts.init(dom);
        // var VOLUMN_TYPE = 1;
        // dayChart.setOption(makeOption(this.stockDayDataSave, VOLUMN_TYPE), true);
      } else if (tab.name == 'second') {
        if (this.stockDayDataSave.length == 0) {
          this.getStockdaybar(this.stockNum)
        }
      } else if (tab.name == 'third') {
        if (this.stockWeekDataSave.length == 0) {
          this.getStockweekbar(this.stockNum)
        }
      } else {
        if (this.stockMonthDataSave == 0) {
          this.getStockmonthbar(this.stockNum)
        }
      }
    },
    getStocktimebar(searchText) {
      let data = {
        stockNum: searchText
      }
      getStocktimebar(data).then(res => {
        var echarts = require('echarts')
        var dom = document.getElementById('k-chart')
        let mDataChart = echarts.init(dom)
        mDataChart.setOption(initMOption(res.reverse(), 'hs'), true)
      })
    },
    getStockdaybar(searchText) {
      let data = {
        stockNum: searchText
      }
      let _this = this
      getStockdaybar(data).then(res => {
        _this.stockDayDataSave = res.reverse()
        var dayDom = document.getElementById('day-chart')
        let dayChart = this.echarts.init(dayDom)
        var VOLUMN_TYPE = 1
        dayChart.setOption(makeOption(res, VOLUMN_TYPE), true)
      })
    },
    getStockweekbar(searchText) {
      let data = {
        stockNum: searchText
      }
      let _this = this
      // stockInfo.stockNum = searchText; // "sh000001";
      getStockweekbar(data).then(res => {
        _this.stockWeekDataSave = res.reverse()
        var weekDom = document.getElementById('week-chart')
        let weekChart = this.echarts.init(weekDom)
        var VOLUMN_TYPE = 1
        weekChart.setOption(makeOption(res, VOLUMN_TYPE), true)
        //mDataChart.setOption(initMOption(res.reverse(), "hs"), true);
      })
    },
    getStockmonthbar(searchText) {
      let data = {
        stockNum: searchText
      }
      let _this = this
      // stockInfo.stockNum = searchText; // "sh000001";
      getStockmonthbar(data).then(res => {
        _this.stockMonthDataSave = res.reverse()
        var monthDom = document.getElementById('month-chart')
        let monthChart = this.echarts.init(monthDom)
        var VOLUMN_TYPE = 1
        monthChart.setOption(
          makeOption(this.stockMonthDataSave, VOLUMN_TYPE),
          true
        )
        //mDataChart.setOption(initMOption(res.reverse(), "hs"), true);
      })
    },
    queryStockByFilter(query) {
      var data1 = {}
      data1.filter = query // "sh000001";
      queryStockByFilter(data1).then(res => {
        if (res.success) {
          this.stockList = res.data
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    inputChange(stocknum) {
      this.$router.push({
        path: '/stock/detail/' + stocknum
      })
    },
    getStockInfoById(stockid) {
      let data = {
        stockId: stockid
      }
      let _this = this
      getStockInfoById(data).then(res => {
        var rawData = res
        _this.stockInfo = rawData;
        _this.amount = '成交额：' + rawData.amount
        _this.amplitude = '振幅：' + (rawData.amplitude * 100).toFixed(2) + '%'
        _this.close = rawData.close
        _this.high = '最高：' + rawData.high
        _this.low = '最低：' + rawData.low
        _this.open = '今开：' + rawData.open
        _this.preclose = '昨收：' + rawData.preclose
        _this.stocknum = rawData.stocknum
        _this.stockname = rawData.stockname
        _this.turnoverrate =
          '换手率：' + (rawData.turnoverrate * 100).toFixed(2) + '%'
        _this.updownprices = rawData.updownprices
        _this.updownrange = rawData.updownrange
        _this.volume = '成交量：' + rawData.volume
        _this.totalmarketvalue =
          '总市值：' + (rawData.totalmarketvalue / 100000000).toFixed(2) + '亿'
        _this.flowmarketvalue =
          '流通市值：' + (rawData.flowmarketvalue / 100000000).toFixed(2) + '亿'
        _this.totalFlowShares =
          '流通股本：' + (rawData.totalFlowShares / 100000000).toFixed(2) + '亿'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.stockDetailWrapper
  display block !important
  padding 20px 0
  .main-chart
    height 500px
    width 800px
</style>