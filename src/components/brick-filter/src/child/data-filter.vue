<template>
  <div class="amazing-filter-wrapper">
    <el-form
      ref="amazing-filter"
      size="mini"
      inline
      :model="filter"
      :class="{
        'not-need-bottom-border': isShowExtFilter && config.length > 3
      }"
      :show-message="false"
      :rules="rules"
      :label-width="`${labelWidth}px`"
    >
      <div class="base-filter-wrapper">
        <el-form-item
          v-for="vnodeConfig in filterConfig.filter(
            (item, index) => index < baseIndex
          )"
          :key="
            Array.isArray(vnodeConfig.key)
              ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
              : vnodeConfig.key
          "
          :prop="
            Array.isArray(vnodeConfig.key)
              ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
              : vnodeConfig.key
          "
          :label="`${vnodeConfig.label}`"
          :style="{
            width: `${(vnodeConfig.col || getCol(vnodeConfig)) * extWidthNum}px`
          }"
        >
          <component
            :OPTIONS="OPTIONS"
            :is="VNodeGenerator"
            :config="vnodeConfig"
            :vModel.sync="
              filter[
                Array.isArray(vnodeConfig.key)
                  ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
                  : vnodeConfig.key
              ]
            "
          ></component>
        </el-form-item>
        <filter-button
          :isShowExtFilter="isShowExtFilter"
          :len="config.length"
          :baseHas="baseIndex"
          @query="handleQueryAction"
          @reset="handleResetForm"
          @clear="handleClearForm"
          @expand="handleCollapseStatus"
        />
      </div>
      <!-- ext-filter-wrapper 元素中的代码与 上述一致，只是为了做区分-->
      <div
        class="ext-filter-wrapper"
        v-show="isShowExtFilter && config.length > baseIndex"
      >
        <el-form-item
          v-for="vnodeConfig in filterConfig.filter(
            (item, index) => index >= baseIndex
          )"
          :key="
            Array.isArray(vnodeConfig.key)
              ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
              : vnodeConfig.key
          "
          :prop="
            Array.isArray(vnodeConfig.key)
              ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
              : vnodeConfig.key
          "
          :label="`${vnodeConfig.label}`"
          :style="{
            width: `${(vnodeConfig.col || getCol(vnodeConfig)) * extWidthNum}px`
          }"
        >
          <component
            :OPTIONS="OPTIONS"
            :is="VNodeGenerator"
            :config="vnodeConfig"
            :vModel.sync="
              filter[
                Array.isArray(vnodeConfig.key)
                  ? renameKey(vnodeConfig.key[0], vnodeConfig.key[1])
                  : vnodeConfig.key
              ]
            "
          ></component>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
/* utils */
import renderFactory from "../element-template/render-dispatcher.vue";
import dayjs from "dayjs";
import { allSettledPolyfill } from "../util";
/* components */
import filterButton from "../element-template/button-render.vue";
export default {
  name: "AmazingFilter",
  props: {
    config: {
      required: true,
      type: Array
    }
  },
  components: {
    filterButton
  },
  data() {
    return {
      /* v-model 双向绑定数据 */
      filter: {},
      /* clone 出来的配置 */
      filterConfig: {},
      /* base 行换行标记 */
      baseIndex: 3,
      /* 用于数组类型的key值 */
      mappingList: {},
      /* 表单查询不需要用到的中间key值 */
      notNeedKey: [],
      /* label宽度 */
      maxLabelWidth: "",
      /* 扩展按钮区域是否显示 */
      isShowExtFilter: true,
      /* 表单校验规则 */
      rules: {},
      /* 所有的options，select，checkboxGroup ，radioGroup */
      OPTIONS: {},
      /* 实体 input select picker ...etc 构造器 */
      VNodeGenerator: renderFactory
    };
  },
  watch: {
    config: {
      handler: function(newVal) {
        this.clear();
        this.init();
        newVal &&
          Array.isArray(newVal) &&
          newVal.length !== 0 &&
          this.asyncQueueActions();
      }
    }
  },
  computed: {
    extWidthNum() {
      /* 展开的筛选条件默认宽度的基数 */
      return this.labelWidth + 190;
    },
    labelWidth() {
      /* 默认的labelwidth，不直接使用是因为 el-form-item 已被extWidthNum定宽，需要动态计算最终的 useLabelWidth */
      return (this.maxLabelWidth.length + 1) * 15;
    }
  },
  methods: {
    clear() {
      this.filter = {};
      // this.filterConfig = {}
      this.mappingList = {};
      this.notNeedKey = [];
      this.maxLabelWidth = "";
      this.rules = {};
    },
    init() {
      // this.filterConfig = _deepClone(this.config);
      this.initFilterConfig();
      this.initAssignResponsiveData();
      this.initReAssignForPicker();
      this.initAssignRules();
      this.ininCalcLabelWidth();
      this.initCollectOptions();
      /* 没有采用统一的监听 filter {deep:true} 是因为无法方便的拿到key */
      this.initWatchFilter();
    },
    // 获取组件所占列数
    getCol(item) {
      return item.type === "datetimerange" ? 2 : 1;
    },
    /**
     * 筛选条件处理
     * @description 支持设置 col 列数
     */
    initFilterConfig() {
      /* main task */
      this.filterConfig = this.config;
      /* sub task ,决定base行放几个 filter */
      let colSum = 0;
      for (let index = 0; index < this.filterConfig.length; index++) {
        const item = this.filterConfig[index];
        const col = item.col || this.getCol(item);
        colSum += col;
        if (colSum === 3) {
          /* 2+1 = 3 || 1 + 1 + 1 = 3  || 3 = 3*/
          this.baseIndex = index === 0 ? 1 : (3 % index) + 2;
          return;
        } else if (colSum > 3) {
          /* 2 + 2 || 1 + 1 + 2 || 1 + 3 */
          this.baseIndex = (3 % index) + 2;
          return;
        }
      }
    },
    initAssignResponsiveData() {
      const that = this;
      this.filterConfig.forEach(item => {
        /* config有默认值 且key为数组 */
        if (
          Object.prototype.hasOwnProperty.call(item, "default") &&
          Array.isArray(item.key)
        ) {
          const NOT_NEED_KEY = item.key[0] + item.key[1];
          this.notNeedKey.push(NOT_NEED_KEY);
          that.$set(that.filter, NOT_NEED_KEY, item.default);
          that.$set(that.filter, item.key[0], item.default[0]);
          that.$set(that.filter, item.key[1], item.default[1]);
          /* 解铃还需系铃人 */
          this.mappingList[NOT_NEED_KEY] = [item.key[0], item.key[1]];
        }
        /* config 没有默认值 且key为数组 */
        if (
          !Object.prototype.hasOwnProperty.call(item, "default") &&
          Array.isArray(item.key)
        ) {
          const NOT_NEED_KEY = item.key[0] + item.key[1];
          this.notNeedKey.push(NOT_NEED_KEY);
          that.$set(that.filter, NOT_NEED_KEY, []);
          that.$set(that.filter, item.key[0], "");
          that.$set(that.filter, item.key[1], "");
          this.mappingList[NOT_NEED_KEY] = [item.key[0], item.key[1]];
        }
        /* config有默认值 且key不是数组 */
        if (
          Object.prototype.hasOwnProperty.call(item, "default") &&
          !Array.isArray(item.key)
        ) {
          that.$set(that.filter, item.key, item.default);
        }
        /* config有默认值 且为多选类型 */
        if (
          Object.prototype.hasOwnProperty.call(item, "default") &&
          item.multiple
        ) {
          that.$set(that.filter, item.key, item.default);
        }
        /* config没有默认值 且为多选类型 */
        if (
          !Object.prototype.hasOwnProperty.call(item, "default") &&
          item.multiple
        ) {
          that.$set(that.filter, item.key, []);
        }
        /* config item 啥也不是 */
        if (
          !Object.prototype.hasOwnProperty.call(item, "default") &&
          !item.multiple &&
          !Array.isArray(item.key) &&
          item.component !== "checkboxGroup"
        ) {
          that.$set(that.filter, item.key, "");
        }
        /* config item 啥也不是,但却是 checkboxGroup */
        if (
          !Object.prototype.hasOwnProperty.call(item, "default") &&
          !item.multiple &&
          !Array.isArray(item.key) &&
          item.component === "checkboxGroup"
        ) {
          that.$set(that.filter, item.key, []);
        }
      });
    },
    initReAssignForPicker() {
      /**
       * 该函数的作用是为 picker 类型的表单初始化值
       * 对于其它类型的表单来说，default值就是函数initAssignResponsiveData最终初始化的值
       * 对于 picker 来说，允许默认值传一个 时间戳 Date.now() 或者是一个对象 new Date(),
       * 此时本组件 this 实例中的值是 Date.now() 或 Date object 的时候，
       * 交给下游分发组件渲染 picker的时候，picker-render 内部会对传入的值做处理，并将传入的Date.now() 或 Date object进行格式化
       * 因此必定会触发watch，此时内部无论如何change都不会触发本组件的watch，因为执行到这里时还没调用 initWatchFilter,
       * 因此initWatchFilter必须放到最后执行，否则初始化就会触发change事件
       * 等initWatchFilter 执行完了，建立了监测，picker-render中的 watch会 emit到此处，拿 picker-render中的值与本函数赋值后的值比较
       * 比较发现两个值是一样的（这个函数将 时间戳、对象等值变成了最终 picker要format的string），最终达到初始化 watch 不会触发
       * */
      this.filterConfig.forEach(item => {
        if (
          Object.prototype.hasOwnProperty.call(item, "component") &&
          item.component === "picker" &&
          Object.prototype.hasOwnProperty.call(item, "default")
        ) {
          const FORMAT = this.dateFormat(item.type);
          if (Array.isArray(item.default)) {
            const value1 = dayjs(item.default[0]).format(FORMAT);
            const value2 = dayjs(item.default[1]).format(FORMAT);
            /* 给依赖数组赋值 */
            this.filter[item.key[0] + item.key[1]] = [value1, value2];
            /* 给业务最终值分别赋值 */
            this.filter[item.key[0]] = value1;
            this.filter[item.key[1]] = value2;
          } else {
            this.filter[item.key] = dayjs(item.default).format(FORMAT);
          }
        }
      });
    },
    ininCalcLabelWidth() {
      this.filterConfig.forEach(item => {
        this.maxLabelWidth =
          item.label.length > this.maxLabelWidth.length
            ? item.label
            : this.maxLabelWidth;
      });
    },
    initAssignRules() {
      this.filterConfig.forEach(item => {
        if (Array.isArray(item.key)) {
          item.rules
            ? (this.rules[this.renameKey(item.key[0], item.key[1])] =
                item.rules)
            : undefined;
        } else {
          item.rules ? (this.rules[item.key] = item.rules) : undefined;
        }
      });
    },
    initCollectOptions() {
      /* 往后在修改此 OPTIONS时不需要 emit  update + sync，因为数组是一个引用*/
      const TYPE = ["select", "checkboxGroup", "radioGroup"];
      this.filterConfig.forEach(item => {
        if (TYPE.includes(item.component)) {
          this.OPTIONS[item.key] = [];
        }
      });
    },
    justValidate(key) {
      return this.$refs["amazing-filter"].validateField(key);
    },
    handleQueryAction() {
      this.$refs["amazing-filter"].validate(valid => {
        if (valid) {
          this.$emit("query", this.filter, this.notNeedKey);
        } else {
          this.isShowExtFilter = true;
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleResetForm() {
      this.$refs["amazing-filter"].resetFields();
    },
    handleClearForm() {
      this.$refs["amazing-filter"].clearValidate();
      /* eslint-disable */
        const ACTIONS = {
          "[object Number]":(target,key) =>  target[key] = undefined,
          "[object Undefined]":(target,key) =>  target[key] = undefined,
          "[object String]":(target,key) =>  target[key] = "" ,
          "[object Object]":(target,key) =>  target[key] = {} ,
          "[object Array]":(target,key) =>  this.mappingList[key] ? target[key] = ["",""] : target[key].length = 0,
        }
        for(const key in this.filter){
          ACTIONS[Object.prototype.toString.call(this.filter[key])](this.filter,key)
        }

      },
      handleCollapseStatus() {
        this.isShowExtFilter = !this.isShowExtFilter;
      },
      initWatchFilter(){
        Object.keys(this.filter).map( (key,index) => {
          this.$watch(`filter.${key}`,(newVal,oldVal) => {
            /* 如果是 range 类型的数组变化  */
            if(Object.hasOwnProperty.call(this.mappingList,key)){
              let linkKeyArr = this.mappingList[key]
              this.filter[linkKeyArr[0]] = this.filter[key][0]
              this.filter[linkKeyArr[1]] = this.filter[key][1]
            }
            /* 过滤掉生成的key，不暴露给用户 */
            if(this.notNeedKey.includes(key)){
              return
            }
            /* 最后不管怎样都 emit */
            this.$emit("change",key,newVal,oldVal,this.filter)
          })
        })
      },
      renameKey(a,b){
        const NOT_NEED_KEY = a + b
        return NOT_NEED_KEY
      },
      /* element ui 的显示以小写为准，此处额外独立出一份 */
      dateFormat(type) {
        switch (type) {
          case 'date':
            return 'YYYY-MM-DD'
          case 'daterange':
            return 'YYYY-MM-DD'
          case 'datetime':
            return 'YYYY-MM-DD HH:mm:ss'
          case 'datetimerange':
            return 'YYYY-MM-DD HH:mm:ss'
          case 'year':
            return 'YYYY'
          case 'month':
            return 'YYYY-MM'
          default :
            return 'YYYY-MM-DD HH:mm:ss'
        }
      },
      asyncQueueActions(){
        if (window.asyncQueue && window.asyncQueue.length !== 0){
          /* 消极 all done ，必须所有请求都ok */
          Promise.all(window.asyncQueue).then( () => {
            window.asyncQueue.length = 0
            this.$emit("negativeAllDone",{filter:this.filter,notNeedKey:this.notNeedKey})
          })
          /* 积极 all done ，所有请求都 ed (结束)就能触发 */
          if(Promise.allSettled){
            Promise.allSettled(window.asyncQueue).then( () => {
              window.asyncQueue.length = 0
              this.$emit("allDone",{filter:this.filter,notNeedKey:this.notNeedKey})
            })
          } else {
            allSettledPolyfill(window.asyncQueue).then( () => {
              window.asyncQueue.length = 0
              this.$emit("allDone",{filter:this.filter,notNeedKey:this.notNeedKey})
            })
          }
           
          /* 以上两个 allDone方法，最终都会触发 allSettled 的 allDone 这个方法 */
        } else {
          this.$emit("allDone",{filter:this.filter,notNeedKey:this.notNeedKey})
        }
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.$refs["amazing-filter"].$el.addEventListener("keyup",(event) => {
        event.keyCode === 13 && this.handleQueryAction()
      })
      this.config && Array.isArray(this.config) && this.config.length !== 0 && this.asyncQueueActions()
    },
    beforeDestroy() {
      delete window.asyncQueue
    }
  };
</script>
<style lang="scss" scoped>
  @import "./data-filter";
</style>