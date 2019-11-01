<template>
    <!-- 基本布局 -->
    <el-select :value="value" @change="fn" placeholder="请选择" clearable>
      <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>

</template>

<script>
export default {
  props: ['value'],
  name: 'my-channel',
  data () {
    return {
      // value: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    // 频道渲染，获取频道信息
    async getChannelOptions () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.channelOptions = data.channels
    },
    // 当频道选项发生改变时，将频道的ID赋值给父组件
    fn (id) {
      // 如频道id为空时,将null赋值给id
      if (id === '') id = null
      // 将子组件频道改变数据传给父元素
      this.$emit('input', id)
    }
  }
}
</script>

<style>
</style>
