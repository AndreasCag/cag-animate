import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api';
import ComponentSpringExample from './ComponentSpringExample.vue'

Vue.use(VueCompositionApi);

Vue.config.productionTip = false

new Vue({
  render: h => h(ComponentSpringExample),
}).$mount('#app')
