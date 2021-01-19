<script>
import dayjs from "dayjs";
import { _PROPS_MERGE } from "../util";
export default {
  name: "Picker",
  props: {
    config: Object,
    vModel: [String, Array]
  },
  data() {
    return {
      localVal: "",
      "onPickMark-maxDate": undefined,
      "onPickMark-minDate": undefined,
      /* 用于帮助picker记录当前的选点时间 */
      fakerLocalVal: "",
      limitPickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this["onPickMark-maxDate"] = maxDate;
          this["onPickMark-minDate"] = minDate;
          if (!maxDate) {
            this.fakerLocalVal = minDate;
          }
        },
        disabledDate: time => {
          /* 魔法2：有最大值和最小值时证明是已经选择了两个点 需要放开所有禁用 */
          if (this["onPickMark-maxDate"] && this["onPickMark-minDate"]) {
            return false;
          }
          /* 魔法1：禁掉 limit区间外的时间可选区域 */
          const targetTime = this.fakerLocalVal;
          const d_value = this.config.timeBetween ? 1 : 0;
          if (targetTime) {
            const minTime = dayjs(targetTime).subtract(
              this.config.limit - d_value,
              "day"
            );
            const maxTime = dayjs(targetTime).add(
              this.config.limit - d_value,
              "day"
            );
            return (
              dayjs(time).isBefore(minTime) || dayjs(time).isAfter(maxTime)
            );
          } else {
            return false;
          }
        }
      }
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
      /* timeBetween 处理 */
      if (
        this.config.type === "datetimerange" &&
        this.config.timeBetween &&
        newval &&
        newval.length === 2
      ) {
        newval[0] = dayjs(newval[0]).format("YYYY-MM-DD 00:00:00");
        newval[1] = dayjs(newval[1]).format("YYYY-MM-DD 23:59:59");
      }

      /**
       * 数组range类型 数据填充处理
       * !当range类型的新值为null时，不能赋值新的数组给 localVal，否则响应式变量会变质
       * @解决方案 使用 Array.splice(0,length - 1),此处还是用到了 [] 新的引用，但是没引起变质
       * */
      if (
        this.config.component === "picker" &&
        ["daterange", "datetimerange"].includes(this.config.type) &&
        !newval
      ) {
        this.localVal = [];
        this.$emit("updatevModel", this.localVal);
        return;
      }
      /* 魔法3：如果选择的日期是同一天 且有属性 sameDayTimeBetween 那么自动 timeBetween */
      /* dayjs(xx).date() 此处不能使用这个函数来判断天是否相同，因为这样的话用户就不能手动更改表盘上面的时间了 */
      if (
        this.config.type === "datetimerange" &&
        this.config.sameDayTimeBetween &&
        newval &&
        newval.length === 2 &&
        dayjs(newval[0]).valueOf() === dayjs(newval[1]).valueOf()
      ) {
        newval[0] = dayjs(newval[0]).format("YYYY-MM-DD 00:00:00");
        newval[1] = dayjs(newval[1]).format("YYYY-MM-DD 23:59:59");
      }
      /* 新值无问题时直接 emit 更新 */
      this.$emit("updatevModel", newval);
    }
  },
  render(h) {
    const that = this;
    const _DATE_FORMAT = () => {
      const { type } = that.config;
      switch (type) {
        case "date":
          return "yyyy-MM-dd";
        case "daterange":
          return "yyyy-MM-dd";
        case "datetime":
          return "yyyy-MM-dd HH:mm:ss";
        case "datetimerange":
          return "yyyy-MM-dd HH:mm:ss";
        case "year":
          return "yyyy";
        case "month":
          return "yyyy-MM";
        default:
          return "yyyy-MM-dd HH:mm:ss";
      }
    };

    const PRIVATE_DEFAULT_PROPS = {
      value: that.localVal
    };
    const PUBLIC_DEFAULT_PROPS = {
      type: that.config.type,
      clearable: true,
      "start-placeholder": "开始时间",
      "end-placeholder": "结束时间",
      format: _DATE_FORMAT(),
      "value-format": _DATE_FORMAT(),
      "picker-options": that.config.limit ? that.limitPickerOptions : {}
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
    return h("el-date-picker", {
      props: {
        ..._PROPS_MERGE(
          that.config,
          PRIVATE_DEFAULT_PROPS,
          PUBLIC_DEFAULT_PROPS
        )
      },
      class: {
        "shorter-datetime-picker": that.config.type === "datetime",
        "same-width-for-date": ["date", "year", "month", "week"].includes(
          that.config.type
        )
      },
      attrs: {
        placeholder: RESET_PLACEHOLDER()
      },
      on: {
        input: value => {
          that.localVal = value;
        },
        blur: vm => {
          /* 触发 limit禁用 放开 */
          this["onPickMark-maxDate"] = true;
          this["onPickMark-minDate"] = true;
        }
      }
    });
  }
};
</script>
