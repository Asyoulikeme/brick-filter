<script>
import { _PROPS_MERGE } from "../util";
export default {
  name: "Input",
  props: {
    config: Object,
    vModel: [String, Number]
  },
  data() {
    return {
      localVal: undefined
    };
  },
  created() {
    this.localVal = this.vModel;
  },
  watch: {
    vModel(newval) {
      this.localVal = newval;
    },
    localVal(newval) {
      this.$emit("updatevModel", newval);
    }
  },
  render(h) {
    const that = this;

    const PRIVATE_DEFAULT_PROPS = {
      value: that.localVal
    };
    const PUBLIC_DEFAULT_PROPS = {
      clearable: true
    };
    const RESET_PLACEHOLDER = () => {
      const suffix = that.config.label.slice(-1);
      const has_suffix = [":", "："].includes(suffix);
      if (has_suffix) {
        return `请输入${that.config.label.slice(
          0,
          that.config.label.length - 1
        )}`;
      } else {
        return `请输入${that.config.label}`;
      }
    };
    return h("el-input", {
      props: {
        ..._PROPS_MERGE(
          that.config,
          PRIVATE_DEFAULT_PROPS,
          PUBLIC_DEFAULT_PROPS
        )
      },
      attrs: {
        placeholder: RESET_PLACEHOLDER(),
        ...that.config.attrs
      },
      on: {
        input: value => {
          /* render 函数中 表单双向绑定的真谛就是处理input事件
           * render 函数的 官方示例也是如此
           * 依赖的  element 官方也表示需要处理 input 事件
           * 此处的  input 事件并非原生事件，是经过 element 抛出后的事件
           * 入参写  value 是因为拿到的不是 InputEvent ，而是经过处理后的值
           */
          that.localVal = value.trim();
        }
      }
    });
  }
};
</script>
