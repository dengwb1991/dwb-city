# Dwb-City

## Install

``` bash
npm i dwb-city --save
```

## Mount

### mount with global

``` javascript
import Vue from 'vue'
import City from 'dwb-city'

Vue.use(City)
```

### mount with component

``` javascript
import { dwbCity } from 'dwb-city'

export default {
  components: {
    dwbCity
  }
}
```

## Use
``` html
<dwb-city v-model="show"
      :data="cityData"
      :city="city"
      ref="city"
      @change="getData"/>
```
``` javascript
data () {
  return {
    cityData: [CITY JSON],
    show: [True/False],
    city: [110000, 110100, 110112]
  }
}
// set Data Method or
this.$refs.city.setCurr(this.city)
```

## Example
[[Dwb City]](http://vuetool.dengwb.com/#/city)

## Author
[[Dengwb]](http://www.dengwb.com/app/welcome.html)# dwb-city
