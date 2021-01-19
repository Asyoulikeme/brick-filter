<!--
 * @Description:
 * @Version:
 * @Author: yuwei
 * @Date: 2020-10-05 11:39:56
 * @LastEditTime: 2020-10-06 15:26:17
-->
<script>
import {
  _PROPS_MERGE,
  _WAIT_PROMISE_FULFILLED,
  _DO_MAPPER_TRANSFER
} from "../util";
export default {
  name: "CheckboxGroup",
  props: {
    config: Object,
    vModel: [String, Number, Boolean, Array, Object],
    attrs: Object
  },
  data() {
    return {
      localVal: "",
      /* 用于保存 请求获取到的 select 的 options */
      remoteData: [],
      /* 在响应式的render函数中 确保只会请求一次 */
      singleFetchCount: 0
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

    const _SELECT_OPTIONS = source => {
      const data = Object.prototype.hasOwnProperty.call(that.config, "mapper")
        ? _DO_MAPPER_TRANSFER.call(that, source)
        : source;
      that.attrs.OPTIONS[that.config.key] = data;
      // that.$emit("update:attrs",that.attrs)
      const VNodeList = [];
      data.forEach((item, index) => {
        VNodeList.push(
          h("el-option", {
            props: {
              label: item.text,
              value: item.value
              // disabled: item.isDisabled ? item.isDisabled : false
            },
            key: index
          })
        );
      });
      return VNodeList;
    };

    const PRIVATE_DEFAULT_PROPS = {
      value: that.localVal
    };
    const PUBLIC_DEFAULT_PROPS = {
      clearable: true,
      filterable: that.remoteData.length > 7,
      multiple: that.config.multiple,
      "collapse-tags": true
    };
    const RESET_PLACEHOLDER = () => {
      const suffix = that.config.label.slice(-1);
      const has_suffix = [":", "："].includes(suffix);
      if (has_suffix) {
        return `请选择${that.config.label.slice(
          0,
          that.config.label.length - 1
        )}`;
      } else {
        return `请选择${that.config.label}`;
      }
    };
    return h(
      "el-select",
      {
        props: {
          ..._PROPS_MERGE(
            that.config,
            PRIVATE_DEFAULT_PROPS,
            PUBLIC_DEFAULT_PROPS
          )
        },
        attrs: {
          placeholder: RESET_PLACEHOLDER()
        },
        on: {
          input: value => {
            that.localVal = value;
          }
        }
      },
      [
        ...(Array.isArray(that.config.options)
          ? _SELECT_OPTIONS(that.config.options)
          : typeof that.config.options === "function"
          ? _WAIT_PROMISE_FULFILLED.call(
              that,
              that.config.options,
              _SELECT_OPTIONS
            )
          : [])
      ]
    );
  }
};
</script>
