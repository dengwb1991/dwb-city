/**
 * dwb-city
 * @author dengwb
 */
let City = require('./src/City.vue')
City = City.default || City

export default {
  dwbCity: City,
  install: (Vue) => {
    Vue.component(City.name, City)
  }
}
