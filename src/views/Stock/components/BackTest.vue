<template>
  <div class="BackTestWrapper">
    <el-button type="primary" @click="backTest()">数据回测</el-button>
    <label>成功率：</label>
    <label id="successrangeid">{{replaySuccessRate}}</label>
    <el-table :data="replayData" style="width: 100%">
        <el-table-column label="日期" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ new Date(scope.row.date).toLocaleString().substring(0, 8) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="买操作" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.bought }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卖操作" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sold }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因" width="400">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否成功" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.success }}</span>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import { backTest,selectReplayList } from '@/request/stock.js'

export default {
  name: 'BackTest',
  data() {
    return {
      replayData:[],
      replaySuccessRate:""
    }
  },
  created() {
    
  },
  mounted() {
    this.selectReplayList()
  },
  props: {
    stockNum: { type: String }
  },
  methods: {
    backTest() {
      let param = {};
      param.stockNum = this.stockNum;
       backTest(param).then(res => {
        if(res.success) {
          alert('成功')
          this.selectReplayList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    selectReplayList(){
      let param = {};
      param.stockNum = this.stockNum;
      selectReplayList(param).then(res=>{
        if(res.success) {
          this.replayData = res.data
          var successcount = 0;
          var failcount = 0;
          for (var i = 0; i < res.data.length; i++) {
              if (res.data[i]["success"] == 0) {
                  failcount++;
              }
              if (res.data[i]["success"] == 1) {
                  successcount++;
              }
          }
          var totalcount = successcount + failcount;
          this.replaySuccessRate = (successcount / totalcount * 100).toFixed(0) + "%";
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.authorInfoWrapper
  height 200px
  .profileIntro
    box-sizing border-box
    display flex
    .username
      flex 1
      box-sizing border-box
      padding 0 10px
      line-height 50px
      color $PrimaryText
      cursor pointer
    .messageClick
      height 30px
      margin 10px 0
      margin-right 20px
    .headerImg
      cursor pointer
    .attention
      width 30px
      height 30px
      margin 10px 0
      cursor pointer
  .dataInfo
    .infoList
      display flex
      flex-wrap wrap
      .infoItem
        box-sizing border-box
        width 50%
        height 30px
        line-height 30px
        padding-left 30px
        cursor pointer
        .name
          margin-right 10px
          color $Warning
      .original
        cursor pointer
</style>