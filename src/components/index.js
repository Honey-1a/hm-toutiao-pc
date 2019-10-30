// 封装全局注册的组件
import MyBread from '@/components/my_bread'

export default {
  install (Vue) {
    Vue.component(MyBread.name, MyBread)
  }
}
