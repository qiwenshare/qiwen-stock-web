<template>
  <div class="stockWrapper">
    <div>
      <div class="gtja-section stock">
        <div class="pure-g">
          <div class="pure-u-1-5"  v-for="(item,index) of shStock" :key="index">
            <div class="index" id="szzs-panel">
              <h2>{{item[1]}}</h2>
              
              <div v-if="(item[2] - item[6]) > 0" class="stock-up">
                <span>{{item[2]}}</span>
                <p>
                  <i v-if="(item[2] - item[6]) > 0" class="el-icon-top"></i>
                  <i v-if="(item[2] - item[6]) < 0" class="el-icon-bottom"></i>
                  {{(item[2] - item[6]).toFixed(2)}}
                  <i v-if="(item[2] - item[6]) > 0" class="el-icon-top"></i>
                  <i v-if="(item[2] - item[6]) < 0" class="el-icon-bottom"></i>
                  {{item[3]}}
                </p>
              </div>
              <div v-if="(item[2] - item[6]) < 0" class="stock-down">
                <span>{{item[2]}}</span>
                <p>
                  <i v-if="(item[2] - item[6]) > 0" class="el-icon-top"></i>
                  <i v-if="(item[2] - item[6]) < 0" class="el-icon-bottom"></i>
                  {{(item[2] - item[6]).toFixed(2)}}
                  <i v-if="(item[2] - item[6]) > 0" class="el-icon-top"></i>
                  <i v-if="(item[2] - item[6]) < 0" class="el-icon-bottom"></i>
                  {{item[3]}}
                </p>
              </div>
            </div>
          </div>
          <!-- <div class="pure-u-1-5">
            <div class="index" id="szcz-panel">
              <h2>深证成指</h2>
              <div class="stock-down">
                <span>2701.73</span>
                <p>
                  <i class="el-icon-bottom"></i>43.89
                  <i class="el-icon-bottom"></i>1.60%
                </p>
              </div>
            </div>
          </div>
          <div class="pure-u-1-5">
            <div class="index" id="cybz-panel">
              <h2>创业板指</h2>
              <div class="stock-down">
                <span>2701.73</span>
                <p>
                  <i class="el-icon-bottom"></i>43.89
                  <i class="el-icon-bottom"></i>1.60%
                </p>
              </div>
            </div>
          </div>
          <div class="pure-u-1-5">
            <div class="index" id="hszs-panel">
              <h2>恒生指数</h2>
              <div class="stock-down">
                <span>2701.73</span>
                <p>
                  <i class="el-icon-bottom"></i>43.89
                  <i class="el-icon-bottom"></i>1.60%
                </p>
              </div>
            </div>
          </div>
          <div class="pure-u-1-5">
            <div class="index" id="dqszs-panel">
              <h2>道琼斯指数</h2>
              <div class="stock-down">
                <span>2701.73</span>
                <p>
                  <i class="el-icon-bottom"></i>43.89
                  <i class="el-icon-bottom"></i>1.60%
                </p>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div>
      <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">操作</el-button>
      <el-drawer :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <el-button @click="updateStockList()" type="primary" style="margin-left: 16px;">更新股票列表</el-button>
        <el-button @click="updateStockTimeInfo()" type="primary" style="margin-left: 16px;">更新分时线</el-button>
        <el-button @click="updateStockDayInfo()" type="primary" style="margin-left: 16px;">更新日线</el-button>
        <el-button @click="updateStockWeekInfo()" type="primary" style="margin-left: 16px;">更新周线</el-button>
        <el-button @click="updateStockMonthInfo()" type="primary" style="margin-left: 16px;">更新月线</el-button>
      </el-drawer>
    </div>
    <div>
      <el-table :data="stockTableData" style="width: 100%">
        <el-table-column label="股票编号" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.stocknum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="股票名称" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.stockname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新价" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.close }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单日涨跌幅" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ doubleToPercent(scope.row.updownrange) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="3日涨跌幅" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ doubleToPercent(scope.row.updownrange3) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="5日涨跌幅" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ doubleToPercent(scope.row.updownrange5) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="涨跌额" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.updownprices.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="换手率" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ doubleToPercent(scope.row.turnoverrate) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="振幅" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ doubleToPercent(scope.row.amplitude) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上市日期" width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.lISTING_DATE }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流通股本" width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ parseInt(scope.row.totalFlowShares) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总股本" width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ parseInt(scope.row.totalShares) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="50">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
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
  getShStock
} from '@/request/stock.js'

export default {
  name: 'StockList',
  data() {
    return {
      stockTableData: [],
      drawer: false,
      direction: 'rtl',
      shStock:[]
    }
  },
  created() {
    this.getStockList()
    this.getShStock()
  },
  methods: {
    getShStock(){
      getShStock().then(res => {
        this.shStock = res.list
        console.log(res)
      })
    },
    getStockList() {
      let data = {
        page: 1,
        limit: 10
      }
      getStockList(data).then(res => {
        if (res.success) {
          this.stockTableData = res.data
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockList() {
      updateStockList().then(res => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockDayInfo() {
      updateStockDayInfo().then(res => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockWeekInfo() {
      updateStockWeekInfo().then(res => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockMonthInfo() {
      updateStockMonthInfo().then(res => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    updateStockTimeInfo() {
      updateStockTimeInfo().then(res => {
        if (res.success) {
          alert('成功')
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
@import '~@/assets/styles/varibles.styl'
.stockWrapper
  display block !important
  padding 20px 0
  .gtja-section
    margin-top 20px
    width 1200px
    height 222px
    background-color #004e98
    // background: url(../../images/stock.jpg) no-repeat;
    .pure-g
      text-rendering optimizespeed
      display flex
      display -webkit-flex
      -webkit-flex-flow row wrap
      display -ms-flexbox
      -ms-flex-flow row wrap
      .pure-u-1-5
        width 20%
        .index
          color #fff
          text-align center
          padding-top 55px
          h2
            font-size 18px
            font-weight lighter
            margin-bottom 8px
          .stock-up
            color #ff5c5c
            span
              display block
              font-size 36px
              margin-bottom 10px
            
            p
              font-size 14px
              margin-bottom 10px
              .gtja-iconfont
                font-family 'gtja-iconfont' !important
                font-size 1.6rem
                font-style normal
                -webkit-font-smoothing antialiased
                -webkit-text-stroke-width 0.2px
                -moz-osx-font-smoothing grayscale
              // .icon-xiajiang:before
              //   content '\e620'
          .stock-down
            color #4f9f3f
            span
              display block
              font-size 36px
              margin-bottom 10px
            
            p
              font-size 14px
              margin-bottom 10px
              .gtja-iconfont
                font-family 'gtja-iconfont' !important
                font-size 1.6rem
                font-style normal
                -webkit-font-smoothing antialiased
                -webkit-text-stroke-width 0.2px
                -moz-osx-font-smoothing grayscale
              // .icon-xiajiang:before
              //   content '\e620'
</style>