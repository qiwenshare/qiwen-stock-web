<template>
  <div class="login-wrapper" id="loginBackground">
    <div class="login-form-wrapper">
      <h1 class="login-title">登录</h1>
      <p class="login-system">奇文股票</p>
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
        label-width="100px"
        hide-required-asterisk
      >
        <el-form-item>
          <el-alert type="success" description="请注册后登录，注册数据不会长期保留，仅供开发测试使用"> </el-alert>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input prefix-icon="el-icon-mobile-phone" v-model="loginForm.userName" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <drag-verify
            ref="dragVerifyRef"
            text="请按住滑块拖动解锁"
            successText="验证通过"
            handlerIcon="el-icon-d-arrow-right"
            handlerBg="#F5F7FA"
            successIcon="el-icon-circle-check"
            :width="375"
            :isPassing.sync="isPassing"
            @update:isPassing="updateIsPassing"
          ></drag-verify>
        </el-form-item>
        <el-form-item class="login-btn-form-item">
          <el-button class="login-btn" type="primary" :disabled="submitDisabled" @click="submitForm('loginForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CanvasNest from 'canvas-nest.js'
import DragVerify from '@/components/DragVerify.vue'
import { login } from '@/request/user.js'

// 配置
const config = {
  color: '64, 158, 255', // 线条颜色
  pointColor: '64, 158, 255', // 节点颜色
  opacity: 0.5, // 线条透明度
  count: 99, // 线条数量
  zIndex: -1 // 画面层级
}

export default {
  name: 'Login',
  components: { DragVerify },
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginFormRules: {
        userName: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      isPassing: false,
      submitDisabled: true,
      qqIcon: require('@/assets/images/login/qqIcon.png')
    }
  },
  computed: {
    url() {
      let _url = this.$route.query.Rurl //获取路由前置守卫中next函数的参数，即登录后要去的页面
      return _url ? { path: _url } : { name: 'Stock' }
    }
  },
  watch: {
    //  已验证通过时，若重新输入用户名或密码，滑动解锁恢复原样
    'loginForm.userName'() {
      this.isPassing = false
      this.$refs.dragVerifyRef.reset()
    },
    'loginForm.password'() {
      this.isPassing = false
      this.$refs.dragVerifyRef.reset()
    }
  },
  methods: {
    //  滑动解锁完成
    updateIsPassing(isPassing) {
      if (isPassing) {
        this.submitDisabled = false
      } else {
        this.submitDisabled = true
      }
    },
    // 登录按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 各项校验通过
          let data = {
            username: this.loginForm.userName,
            password: this.loginForm.password
          }
          login(data, true).then((res) => {
            if (res.success) {
              this.$refs[formName].resetFields()
              this.$store.dispatch('getUserInfo').then(() => {
                this.$router.replace(this.url)
              })
            } else {
              this.$message.error('手机号或密码错误！')
              this.isPassing = false
              this.$refs.dragVerifyRef.reset()
            }
          })
        } else {
          this.$message.error('请完善信息！')
          return false
        }
      })
    }
  },
  created() {
    if (this.$store.getters.isLogin) {
      // 用户若已登录，自动跳转到首页
      let username = this.$store.getters.username
      this.$message({
        message: username + ' 您已登录！已跳转到首页',
        center: true,
        type: 'success'
      })
      this.$router.replace({ name: 'Home' })
    }
    this.$nextTick(() => {
      let element = document.getElementById('loginBackground')
      new CanvasNest(element, config)
    })
  }
}
</script>
<style lang="stylus" scoped>
.login-wrapper {
  height: calc(100vh - 189px) !important;
  min-height: 500px !important;
  padding-top: 50px;

  .login-form-wrapper {
    width: 375px;
    margin: 0 auto;
    text-align: center;

    .login-title {
      margin-bottom: 10px;
      font-weight: 300;
      font-size: 30px;
      color: #000;
    }

    .login-system {
      font-weight: 300;
      color: #999;
    }

    .login-form {
      width: 100%;
      margin-top: 20px;

      >>> .el-form-item__content {
        margin-left: 0 !important;
      }

      &>>> .el-input__inner {
        font-size: 16px;
      }

      .forgetPassword {
        text-align: right;
        margin: -22px 0 0 0;
      }

      .login-btn-form-item {
        .login-btn {
          width: 100%;
        }

        &>>> .el-button {
          padding: 10px 90px;
          font-size: 16px;
        }
      }
    }

    .tip {
      width: 70%;
      margin-left: 86px;
    }
  }
}
</style>
