<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <el-form label-width="80px" size="small">
        <el-form-item label="状态:">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道 -->
          <el-form-item label="频道:">
            <!-- v-model 相当于添加了 :value 和 @input事件 -->
            <my-channel v-model="reqParams.channel_id"></my-channel>
          </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="dataArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <!-- 头部 -->
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果：</span>
      </div>
      <!-- 表格列表 -->
      <el-table :data="articleList" style="width: 100%">
        <el-table-column label="封面">
          <!-- 自定义渲染列表 -->
          <template slot-scope="scope">
            <!-- 作用域插槽获取封面图片 -->
            <el-image :src="scope.row.cover.images[0]" style="width : 150px;height:100px">
              <!-- 如没有图片时显示 -->
              <div slot="error">
                <img src="../../assets/error.gif" alt style="width : 150px;height:100px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>

        <!-- 状态信息 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0">草稿</el-tag>
            <el-tag type="info" v-if="scope.row.status===1">待审核</el-tag>

            <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>

            <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row.id)" type="primary" icon="el-icon-edit" circle plain></el-button>
            <el-button @click="delArticle(scope.row.id)" type="danger" icon="el-icon-delete" circle plain></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pageChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import Page from '@/test/index'
export default {
  // components: { Page },
  data () {
    return {
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页
        page: 1,
        // 每页显示多少条
        per_page: 10
      },

      dataArr: [],
      articleList: [],
      total: 0
    }
  },
  created () {
    // 获取文章列表信息
    this.getArticleList()
  },
  methods: {

    // 获取文章列表数据
    async getArticleList () {
      // 获取列表数据
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articleList = data.results
      this.total = data.total_count
    },
    pageChange (newPage) {
      // 将最新获取的页码赋值给page
      this.reqParams.page = newPage
      // 重新渲染页面
      this.getArticleList()
    },
    search () {
      // 获取筛选数据（准备日期数据）
      // 处理频道空字符串问题
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      // 搜索之后的页数显示默认为1
      this.reqParams.page = 1
      this.getArticleList()
    },
    changeDate (dataArr) {
      if (dataArr) {
        this.reqParams.begin_pubdate = dataArr[0]
        this.reqParams.end_pubdate = dataArr[0]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    toEdit (id) {
      this.$router.push('/publish', { query: id })
    },
    async delArticle (id) {
      await this.$http.delete(`articles/${id}`)
      this.$message.success('删除成功')
      this.getArticleList()
    }

  }
}
</script>

 <style scoped lang="less">
</style>
