<template>
  <div class="amazing-wrapper">
    <data-filter
      ref="filter"
      :config="viewBrick"
      @change="handleChange"
      @query="handleQuery"
      @allDone="handleFilterRenderComplete"
      @negativeAllDone="handleFilterRenderAndDataFetchComplete"
    ></data-filter>
  </div>
</template>

<script>
import DataFilter from "./child/data-filter";
import { _deepClone } from "./util";

export default {
  name: "BrickFilter",
  props: {
    viewBrick: {
      required: true,
      type: Array
    }
  },
  components: {
    DataFilter
  },
  data() {
    return {};
  },
  methods: {
    handleChange(key, newVal, oldVal, filter) {
      this.$emit("change", {
        key,
        newVal,
        oldVal,
        filter
      });
    },
    async handleQuery(data, notNeedKey) {
      /* 洗数据 */
      /* 出去的值是纯净的，不能双向操作的，并且不包含表单查询不需要的值 */
      this.$emit("query", this.dataClear(data, notNeedKey));
    },
    handleFilterRenderComplete({ filter, notNeedKey }) {
      this.$emit("allDone", this.dataClear(filter, notNeedKey));
    },
    handleFilterRenderAndDataFetchComplete({ filter, notNeedKey }) {
      this.$emit("negativeAllDone", this.dataClear(filter, notNeedKey));
    },
    dataClear(source, notNeedKey) {
      const copyData = _deepClone(source);
      notNeedKey.length &&
        notNeedKey.forEach(item => {
          delete copyData[item];
        });
      return copyData;
    },
    getOptionsMap(key = undefined) {
      if (key) {
        return _deepClone(
          this.$refs["filter"].OPTIONS[key] || this.$refs["filter"].OPTIONS
        );
      } else {
        return _deepClone(this.$refs["filter"].OPTIONS);
      }
    },
    setOptionsMap(key, value) {
      this.$refs["filter"].filterConfig.find(
        item => item.key === key
      ).options = value;
    },
    setReactiveFilter(key, value) {
      if (
        Object.prototype.hasOwnProperty.call(this.$refs["filter"].filter, key)
      ) {
        if (
          Object.prototype.toString.call(this.$refs["filter"].filter[key]) ===
          Object.prototype.toString.call(value)
        ) {
          this.$refs["filter"].filter[key] = value;
          this.$refs["filter"].justValidate(key);
        } else {
          console.error(
            `Rejetcd,target value type: ${Object.prototype.toString.call(
              value
            )},original value type:${Object.prototype.toString.call(
              this.$refs["filter"].filter[key]
            )}`
          );
        }
      } else {
        console.error(`Rejetcd, property: ${key}不存在,请检查是否正确！`);
      }
    },
    getReactiveFilter() {
      return this.$refs["filter"].filter;
    },
    getQueryParams() {
      return this.dataClear(
        this.$refs["filter"].filter,
        this.$refs["filter"].notNeedKey
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.amazing-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.start-date > div > span {
  background: #0bda99 !important;
}
.end-date > div > span {
  background: #ff3747 !important;
}
</style>
