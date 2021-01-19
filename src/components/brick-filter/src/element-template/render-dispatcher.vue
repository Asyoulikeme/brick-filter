<!--
 * @Description:
 * @Version:
 * @Author: yuwei
 * @Date: 2020-09-29 17:18:47
 * @LastEditTime: 2020-10-05 11:27:02
-->
<script>
import Input from "./input-render";
import Select from "./select-render";
import Picker from "./picker-render";
import Switch from "./switch-render";
import RadioGroup from "./radioGroup-render";
import CheckBoxGroup from "./checkboxGroup-render.vue";
import CustomFilterItem from "./custom-filter-item-render";

export default {
  name: "RenderDispatcherFactory",
  props: {
    config: Object,
    vModel: [Object, String, Number, Array, Boolean]
  },
  render(h) {
    const that = this;
    const COMMON_PROPS = {
      config: that.config,
      vModel: that.vModel,
      attrs: that.$attrs
    };
    const COMMON_UPDATE_METHOD = {
      updatevModel: newval => {
        this.$emit("update:vModel", newval);
      }
    };

    const ACTIONS = {
      input: () => {
        // console.log("%c input","background:red;border-radius:2px; padding-right:12px;color:#ffffff"); console.count("input")
        return h(Input, { props: COMMON_PROPS, on: COMMON_UPDATE_METHOD });
      },
      select: () => {
        // console.log("%c select","background:#03a9f4;border-radius:2px;padding-right:12px; color:#ffffff"); console.count("select")
        return h(Select, {
          props: COMMON_PROPS,
          on: { ...COMMON_UPDATE_METHOD }
        });
      },
      checkboxGroup: () => {
        return h(CheckBoxGroup, {
          props: COMMON_PROPS,
          on: { ...COMMON_UPDATE_METHOD }
        });
      },
      radioGroup: () => {
        return h(RadioGroup, {
          props: COMMON_PROPS,
          on: { ...COMMON_UPDATE_METHOD }
        });
      },
      picker: () => {
        // console.log("%c picker","background:#999999;border-radius:2px; padding-right:12px;color:#ffffff"); console.count("picker")
        return h(Picker, { props: COMMON_PROPS, on: COMMON_UPDATE_METHOD });
      },
      switch: () => {
        return h(Switch, {
          props: COMMON_PROPS,
          on: { ...COMMON_UPDATE_METHOD }
        });
      },
      object: () => {
        /**
         *  如果是组件过来，那么则是作为子组件
         *  组件的直接渲染，响应式绑定不是通过处理input事件，而是处理自定义事件
         *  所以自定义 change 事件传入子组件，
         *  一定要在子组件内部 emit 此注入的 change事件，此处的 render factory 才能代理将值 dispatch 到父级表单
         * */
        return h(CustomFilterItem, {
          props: COMMON_PROPS,
          on: COMMON_UPDATE_METHOD
        });
      }
    };
    const TYPES =
      typeof that.config.component === "object"
        ? "object"
        : that.config.component;

    return ACTIONS[TYPES || "input"]();
  }
};
</script>
