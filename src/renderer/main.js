import Vue from 'vue'
import { Row, Col, Checkbox, CheckboxGroup, Button, Dialog, Input, Progress} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(Row)
Vue.use(Col)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Progress)
import App from './App'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')

