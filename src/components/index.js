// 封装全局注册的组件
import MyBread from '@/components/my_bread'
// 频道全局组件
import MyChannel from '@/components/my_channel'

export default {
  install (Vue) {
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
  }
}
