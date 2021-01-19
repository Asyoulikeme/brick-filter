<template>
  <el-checkbox-group v-model="localVal.success">
    <el-checkbox label="A"></el-checkbox>
    <el-checkbox label="B"></el-checkbox>
    <el-checkbox label="C"></el-checkbox>
    <el-checkbox label="禁用" disabled></el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  name: "Cus",
  props: {
    vModel: {
      type: Object
    },
    age: [String, Number]
  },
  data() {
    return {
      localVal: {
        success: []
      }
    };
  },
  watch: {
    localVal(newval) {
      /* 已在组件内部注入change方法，此组件只需emit，表单中就能接收到此自定义组件的值 */
      /* 自定义的组件，一定要有这一步，父子组件的通讯靠的就是 emit */
      this.$emit("change", newval);
    },
    vModel: {
      immediate: true,
      handler: function(newval) {
        this.localVal = newval || [];
      }
    }
  },
  mounted() {
    console.log(this.age);
  },
  methods: {
    fs(val) {}
  }
};
</script>
