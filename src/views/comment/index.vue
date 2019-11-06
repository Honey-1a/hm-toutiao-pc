<template>
  <div class="container-comment">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="articleList">
        <el-table-column label="标题" width="400" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽，组件内部的数据在组件的插槽中使用 -->
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click="toggleStatus(scope.row)"
              type="danger"
              size="small"
              v-if="scope.row.comment_status"
            >关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" type="success" size="small" v-else>打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="reqParams.per_page"
      :current-page="reqParams.page"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>

export default {
  data () {
    return {
      articleList: [],
      reqParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      },
      total: 0
    }
  },
  created () {
    // 获取列表信息
    this.getArticles()
  },
  methods: {

    // 切换打开评论和关闭评论
    toggleStatus (row) {
      // row  有 id 和 comment_status(从getArticles中赋值得到)
      const text = row.comment_status ? '您确定关闭评论吗？关闭后则不能对文章进行评论！！！' : '您确定打开评论吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击成功
        // 发修改状态的请求
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${row.id}`, { allow_comment: !row.comment_status })

        // 成功
        this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        // 更新当前文章的状态
        row.comment_status = data.allow_comment
      }).catch(() => {})
    },
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articleList = data.results
      this.total = data.total_count
    },
    // 分页
    pageChange (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    }
  }
}
</script>

<style>
</style>
