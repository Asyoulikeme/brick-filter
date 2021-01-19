/* eslint-disable*/

export default [
  {
    key: "areaId",
    label: "区域：",
    component: "select",
    clearable: false,
    default: '',
    rules:[
      { required: true, message: "请选择区域", trigger: "change" }
    ],
    options: []
  },
  {
    key: "initialPlaceNo",
    label: "仓库：",
    component: "select",
    clearable: false,
    default: "",
    rules:[
      { required: true, message: "请选择仓库", trigger: "change" }
    ],
    options: [],
  },
  {
    key: [ "tradeStartDate", "tradeEndDate" ],
    label: "配送日期：",
    component: "picker",
    type: "daterange",
    col: 2,
    timeBetween: true,
    limit: 90
  },
  {
    key: [ "tradeStartDate", "tradeEndDate" ],
    label: "高速费记账日期：",
    component: "picker",
    type: "daterange",
    col: 2,
    timeBetween: true,
    limit: 90,
  
  },
  {
    key: "deliveryNo",
    label: "配送编号：",
    default: "",
  },
  {
    key: "deliveryNo",
    label: "司机：",
    default: "",
  },
  {
    key: "deliveryNo",
    label: "车牌：",
    default: "",
  },
  {
    key: "deliveryNo",
    label: "目的地：",
    default: "",
  },
  {
    key: "matchStatus",
    label: "高速票类型：",
    component: "select",
    clearable: false,
    default: "",
    options: [],
  },
  {
    key: "matchStatus",
    label: "高速费超标：",
    component: "select",
    clearable: false,
    default: "",
    options: [],
  },

  
];
