<template>
  <div id="container">
    <el-card>
      <img src="../../assets/logo_index.png" alt />
      <el-form ref="loginForm" status-icon :model="LoginForm" :rules="LoginRules">
        <el-form-item prop="mobile">
          <el-input v-model="LoginForm.mobile" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="LoginForm.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:8px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Login" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入本次存储模块
import local from '@/utils/local'

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    return {
      LoginForm: { mobile: '13900000000', code: '246810' },
      LoginRules: {
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码为六位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    Login () {
      this.$refs['loginForm'].validate(async valid => {
        if (valid) {
          // console.log('ok')
          // this.$http
          //   .post('authorizations', this.LoginForm)
          //   .then(res => {
          //     // 保存用户信息
          //     local.setUser(res.data.data)
          //     this.$router.push('/')
          //   })
          //   .catch(() => {
          //     this.$message.error('用户名或密码错误')
          //   })

          // 用async和await改造登录请求
          // 接受调取接口后拿到的data数据
          // await获取的是成功后的数据，如有失败需要用try{可能发生错误的代码}catch(e){处理错误}捕获
          try {
            const { data: { data } } = await this.$http.post('authorizations', this.LoginForm)
            // 保存用户信息
            local.setUser(data)
            this.$router.push('/')
          } catch (e) {
            this.$message.error('用户名或密码错误')
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
#container {
  width: 100%;
  height: 100%;
  //   background: pink;
  position: absolute;
  top: 0;
  left: 0;
  background: url(../../assets/login_bg.jpg) no-repeat center / cover;
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 200px;
      display: block;
      margin: 0 auto 30px;
    }
  }
}
</style>
