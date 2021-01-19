<!--
 * @Description:
 * @Version:
 * @Author: yuwei
 * @Date: 2020-10-04 14:39:35
 * @LastEditTime: 2020-10-05 10:52:41
-->
<script>
import {
  _PROPS_MERGE,
  _WAIT_PROMISE_FULFILLED,
  _DO_MAPPER_TRANSFER
} from "../util";
export default {
  name: "RadioGroup",
  props: {
    config: Object,
    vModel: [String, Number, Boolean],
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
    const _ITEM = source => {
      const data = Object.prototype.hasOwnProperty.call(that.config, "mapper")
        ? _DO_MAPPER_TRANSFER.call(that, source)
        : source;
      that.attrs.OPTIONS[that.config.key] = data;
      // that.$emit("update:attrs",that.attrs)
      const VNodeList = [];
      data.forEach((item, index) => {
        VNodeList.push(
          h(
            that.config.isButton ? "el-radio-button" : "el-radio",
            {
              props: {
                label: item.value
              }
            },
            [item.text]
          )
        );
      });
      return VNodeList;
    };
    const PRIVATE_DEFAULT_PROPS = {
      value: that.localVal
    };
    const PUBLIC_DEFAULT_PROPS = {};

    return h(
      "el-radio-group",
      {
        props: {
          ..._PROPS_MERGE(
            that.config,
            PRIVATE_DEFAULT_PROPS,
            PUBLIC_DEFAULT_PROPS
          )
        },
        on: {
          change: (newVal, ev) => {
            /* 处理 radio group的数据的操作不应该像官方说的那样在 change 事件中，源码中是走到了 input事件 */
          },
          input: newVal => {
            /* 此处才是正确处理数据之处 */
            that.localVal = newVal;
          }
        }
      },
      [
        ...(Array.isArray(that.config.options)
          ? _ITEM(that.config.options)
          : typeof that.config.options === "function"
          ? _WAIT_PROMISE_FULFILLED.call(that, that.config.options, _ITEM)
          : [])
      ]
    );
  }
};
</script>
