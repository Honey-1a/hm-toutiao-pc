<template>
  <el-card>
    <div slot="header">
      <my-bread>素材管理</my-bread>
    </div>
    <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
      <el-radio-button label="false">全部</el-radio-button>
      <el-radio-button label="true">收藏</el-radio-button>
    </el-radio-group>
    <el-button @click="open" dialogVisible= "true" type="success" size="small" style="float:right">添加素材</el-button>
    <!-- 素材区域 -->
    <div class="img_list">
      <div class="img_item" v-for="item in images" :key="item.id">
        <img :src="item.url" alt />
        <div class="img_btn" v-show="!reqParams.collect">
          <span
            @click="toggleStatus(item)"
            class="el-icon-star-off"
            :class="{red:item.is_collected}"
          ></span>
          <span @click="delImage(item.id)" class="el-icon-delete"></span>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="reqParams.per_page"
      :current-page="reqParams.page"
      @current-change="pager"
    ></el-pagination>
    <!-- 添加素材 -->
    <!-- 对话框 -->
    <el-dialog @click="open" title="添加素材" :visible.sync="dialogVisible" width="300px">
       <!-- action 为上传文件地址 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :headers = "headers"
        :on-success="handelImage"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </el-card>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        collect: false,
        // 当前页数
        page: 1,
        // 每页显示条数
        per_page: 10
      },
      images: [],
      total: 0,
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      // 上传后的图片地址
      imageUrl: null,
      headers: { Authorization: `Bearer ${local.getUser().token}` }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 再次打开后清空上传素材
    open () {
      this.imageUrl = null
      this.dialogVisible = true
    },
    // 图片上传后的处理函数
    handelImage (res) {
      // 预览图片
      this.imageUrl = res.data.url
      // 提示信息
      this.$message.success('添加图片成功')
      // 2秒后关闭对话框，重新渲染列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages()
      }, 2000)
    },
    // 显示图片列表
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 控制分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换显示隐藏列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换 添加收藏与取消收藏
    async toggleStatus (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功改变状态 并提示
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },
    // 删除图片
    delImage (id) {
      // 显示确认框
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确认 发请求
          await this.$http.delete(`user/images/${id}`)
          // 提示
          this.$message.success('删除成功')
          // 更新列表
          this.getImages()
        })
        .catch({
          // 点击取消
        })
    }

  }
}
</script>

<style scoped lang="less">
.img_list {
  margin-top: 30px;

  .img_item {
    display: inline-block;
    width: 160px;
    height: 160px;
    border: 1px dashed #ddd;
    position: relative;

    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }

    .img_btn {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      position: absolute;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.3);
      left: 0;
      bottom: 0;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
