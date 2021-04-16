<template>
  <div id="app">
    <Header v-if="isHeaderShow" id="headWrapper"></Header>
    <router-view class="main-content"></router-view>
    <Footer v-if="isFooterShow"></Footer>
    <el-backtop class="back-top" target="#app" title="快点我，带你上天！"></el-backtop>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    //  头部是否显示
    isHeaderShow() {
      let routerNameList = ['Error_404']
      if (routerNameList.includes(this.$route.name)) {
        return false
      } else {
        return true
      }
    },
    //  底部是否显示
    isFooterShow() {
      let routerNameList = ['Stock']
      if (routerNameList.includes(this.$route.name)) {
        return false
      } else {
        return true
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';

#app {
  height: 100%;
  overflow-x: hidden;
  -webkit-text-size-adjust: none;
  overflow-y: auto;

  >>> .el-backtop {
    background-color: $Success;
    color: #fff;
    z-index: 3;
  }

  .main-content {
    flex: 1;
    width: 90%;
    min-height: calc(100vh - 70px);
    margin: 0 auto;
    display: flex;
  }
}
</style>
