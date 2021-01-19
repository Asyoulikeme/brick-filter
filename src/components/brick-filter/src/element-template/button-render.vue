<template>
  <el-form-item
    label=" "
    label-width="10px"
    class="mixin-button"
    style="padding-left: 60px;"
  >
    <el-button type="primary" @click="handleQueryAction">查询</el-button>
    <el-button @click="handleResetForm">重置</el-button>
    <el-button @click="handleClearForm" v-if="false">清空</el-button>
    <span v-if="len > baseHas" @click="handleCollapseStatus" class="expand-btn">
      <i
        class="el-icon-arrow-right"
        :class="{
          'arrow-direction-down': isShowExtFilter,
          'arrow-direction': true
        }"
      ></i>
    </span>
  </el-form-item>
</template>

<script>
export default {
  name: "FilterButton",
  props: {
    isShowExtFilter: {
      required: true,
      type: Boolean
    },
    len: {
      required: true,
      type: Number
    },
    baseHas: {
      required: true,
      type: Number
    }
  },
  data() {
    return {};
  },
  methods: {
    handleQueryAction() {
      this.$emit("query");
    },
    handleResetForm() {
      this.$emit("reset");
    },
    handleClearForm() {
      this.$emit("clear");
    },
    handleCollapseStatus() {
      this.$emit("expand");
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .el-form-item__content {
  display: flex !important;
  flex-wrap: no-wrap;
  justify-content: center;
  align-items: center;
}
.arrow-direction {
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
}
.arrow-direction-down {
  transform: rotate(90deg);
}
.expand-btn {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;

  margin-left: 20px;
  color: #03a9f4;
}

.mixin-button {
  ::v-deep .el-form-item__label {
    display: none;
  }
  ::v-deep .el-form-item__content {
    justify-content: left;
  }
}
</style>
