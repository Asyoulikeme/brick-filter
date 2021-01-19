<script>
export default {
  name: "CustomFilterItem",
  props: {
    config: Object,
    vModel: {
      required: true
    }
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

    return h(that.config.component, {
      props: {
        vModel: that.localVal,
        ...that.config.props
      },
      attrs: {
        placeholder: that.config.label
      },
      on: {
        change: value => {
          that.localVal = value;
        }
      }
    });
  }
};
</script>
