<template>
  <div class="container-setting">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号:">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机:">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称:">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:">
              <el-input type="textarea" :rows="3" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :headers="headers"
            :http-request="saveImage"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
import eventBus from '@/eventBus'

export default {
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null,
        photo: null
      },
      // 请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },

  created () {
    // 获取用户信息
    this.getuserInfo()
  },
  methods: {
    async saveInfo () {
      // 保存用户信息(除去用户头像)
      await this.$http.patch('user/profile', {
        name: this.userInfo.name,
        intro: this.userInfo.intro,
        email: this.userInfo.email
      })
      // 提示
      this.$message.success('修改用户信息成功')
      // 更新home组件的用户名
      // 谁接受数据，谁触发事件
      eventBus.$emit('updateUser', this.userInfo.name)
      // 更新本地存储信息
      const user = local.getUser()
      user.name = this.userInfo.name
      local.setUser(user)
    },
    // 获取用户信息
    async getuserInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    // 修改头像，上传组件
    async saveImage (result) {
    // 选择文件后触发当前函数，默认选择一个默认
    // 1获取文件数据
      const file = result.file
      // 2创建一个formData
      const formData = new FormData()
      // 3追加到formData
      formData.append('photo', file)
      // 4使用axios提交数据
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      //   5拿着上传的图片进行预览
      this.userInfo.photo = data.photo
      //   6提示
      this.$message.success('修改图片成功')
      //   8更新home组件
      eventBus.$emit('updatePhoto', data.photo)
      //   9更新本地存储信息
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  }
}
</script>

<style>
</style>
