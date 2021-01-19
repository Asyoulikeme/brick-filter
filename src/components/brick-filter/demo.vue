<!--
 * @Description:
 * @Version:
 * @Author: yuwei
 * @Date: 2020-09-29 17:18:47
 * @LastEditTime: 2020-10-05 11:54:49
-->
<template>
  <div id="app">
    <brick-filter
      ref="amaz-filter"
      :view-brick="filterView"
      @change="handleChange"
      @query="handleQuery"
      @allDone="handleAllDone"
      @negativeAllDone="negativeAllDone"
    >
    </brick-filter>
  </div>
</template>

<script>
/* eslint-disable */
import { BrickFilter } from './index'
import viewConfig from './viewConfig'
export default {
  name: 'Demo',
  components: {
    BrickFilter
  },
  data() {
    return {
      filterView: viewConfig,
      remoteData: {},
    }
  },

  created() {
    // Object.freeze(this.filterView)
    // Object.freeze(viewConfig)
    window.fss = this
  },
  methods: {
    handleChange({ key, newVal, oldVal, filter }) {
      console.table([
        `当前变更的字段为${key}`,
        `当前值为 ${newVal}`,
        `旧的值为 ${oldVal}`
      ])

      if (key === 'vendorCity') {
        // this.$refs["amaz-filter"].setOptionsMap("vendorType",[
        //   {
        //     text:"1",
        //     value:"1"
        //   }w
        // ])

      }
      /* console.table([
        `当前变更的字段为${key}`,
        `当前值为 ${newVal}`,
        `旧的值为 ${oldVal}`
      ])
      
      console.log(filter)
      */
      // this.$refs['amaz-filter'].setOptionsMap('fss', [{
      //   text: '牛逼',
      //   value: 'nb'
      // }])
    },
    handleAllDone(filter) {
      /* 如果想在 filter 完成初始化后，拿到远程数据的第一项作为，filter某一项的默认值，可以像下面这样 */
      const maps = this.$refs['amaz-filter'].getOptionsMap()
      //alert('all done')
      console.log(maps)
      // filter.vendorCitys.push(maps.vendorCitys[0].value)
      this.setupDefaultForSelect()
      alert("积极alldone 触发")

    },
    setupDefaultForSelect(){
      const map = this.$refs['amaz-filter'].getOptionsMap('vendorCity')
      
      this.$refs["amaz-filter"].setReactiveFilter("vendorCity",map[0].value)
    },
    negativeAllDone() {
      alert('消极 all done 触发')
    },
    handleQuery(data) {
      
      console.log(data)
    }
  },

  mounted() {}
}
</script>

<style scoped>
#app{
  background: #eaeaea;
  height: 100vh;
}
</style>