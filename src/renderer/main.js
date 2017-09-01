import Vue from 'vue'
import { Row, Col, Checkbox, CheckboxGroup, Select, Option} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(Row)
Vue.use(Col)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
import App from './App'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')

