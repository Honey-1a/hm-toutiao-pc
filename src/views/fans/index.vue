<template>
  <div class="container">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="first">
          <!-- 粉丝列表 -->
          <div class="fans_List">
            <div class="fansItem" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="small">
                <span>+关注</span>
              </el-button>
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
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
            <!-- 粉丝画像 -->
            <!-- 首先装备一个具有宽高的div -->
            <div ref="dom" style="width: 600px;height:400px;">
            </div>
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import circleUrl from '../../assets/avatar.jpg'
import echarts from 'echarts'
export default {
  mounted () {
    // 基于dom,准备echars实例
    const dom = this.$refs.dom
    const myechars = echarts.init(dom)
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myechars.setOption(option)
  },
  data () {
    return {
      activeName: 'first',
      circleUrl,
      reqParams: {
        page: 1,
        per_page: 21
      },
      total: 0,
      fansList: []
    }
  },
  created () {
    this.getFanslist()
  },
  methods: {
    // 获取粉丝列表
    async getFanslist () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fansList = data.results

      this.total = data.total_count
    },
    //   分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFanslist()
    }
  }
}
</script>

<style scope lang="less">
.fansItem {
  width: 150px;
  height: 190px;
  padding-top: 20px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
