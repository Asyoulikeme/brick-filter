/* eslint-disable*/
/* 加入表单校验器 */
import { phoneNumberValidator } from "./validator";
import axios  from "axios"
/* 自定义级别 组件 */
import custom from "./custom.vue"
import dayjs from "dayjs"
export default [
  {
    key: "vendorId",
    label: "供应商ID",
    //default:"123456",
    disabled:true,
    attrs:{
      placeholder:"fafa",
      maxlength: 5,
      readonly:"readonly"
    }
  },
  {
    key:"vendorCode",
    label:"供应商编号",
    component:"input",
    default:20200819
  },
  {
    key:"vendorPhoneNumber",
    label:"供应商手机号",
    component:"input",
    rules: [{ validator: phoneNumberValidator, trigger: "blur" }],
    default:"13973140494"
  },
  {
    key:"vendorType",
    label:"供应商类型",
    component:"select",
    multiple: true,
  
    options:[
      {
        text:"蔬菜供应商",
        value:0
      },
      {
        text:"常规供应商",
        value:1
      }
    ],
    rules: [{ required: true, message:"类型必选", trigger: "change" }]
  },
  {
    key:"vendorCity",
    label:"供应商所在城市",
    component:"select",
    multiple: false,
    default: 101,
    options:FETCH_ALL_CITY,
    mapper:{
      "areaName":"text",
      "areaId":"value",
    }
  },
  
  {
    key: "signInTime",
    label: "注册时间：",
    component:"picker",
    type: "year",
    //default: "2020-07-08"
  },
  {
    key: "vendorXTimeStart",
    label: "供应商牛逼时间牛",
    component:"picker",
    type: "date",
    default:'2020-10-12',
    format:"yyyy年MM月dd日",
    "value-format":"yyyy-MM-dd",
    rules: [{ required: true, message:"类型必选", trigger: "change" }]
  },
  {
    key: "vendorXTimeEnd",
    label: "供(止)",
    component:"picker",
    type: "datetime",
    //default: "2020-08-25 23:59:59"
    default:new Date(),
  },
  {
    key: ["tmApplyStart","tmApplyEnd"],
    label: "供应商申请时间",
    component:"picker",
    type: "datetimerange",
    clearable: true,
    limit:10,
    // default: [
    //   dayjs(new Date()).format("YYYY-MM-DD 00:00:00"),
    //   dayjs(new Date()).format("YYYY-MM-DD 23:59:59")
    // ],
    default:[
      Date.now(),
      dayjs(new Date()).format("YYYY-MM-DD 23:59:59")
    ],
    rules: [{ required: true, message:"类型必选", trigger: "change" }]
  },
  {
    key:["deployBeginTime","deployEndTime"],
    label:"bug复现",
    component:"picker",
    type: "daterange",
    default:[
      '2020-11-17',
      '2020-12-17'
    ]
  },
  {
    key:"search",
    label:"搜索用户类型",
    component:custom,
    col:2,
    props:{
      age:19
    },
    default:{
      success:["B"]
    }
  },
  {
    key:"isOpen",
    label:"仅显示差异数据",
    component:"switch",
    default:"牛逼",
    allowableValue:["牛逼","不牛逼"]
  },
  {
    key: "vendorCitys",
    label: "供应商所在城市",
    component: "checkboxGroup",
    options: [
      {
        text:"长沙",
        value:"长沙"
      },
      {
        text:"浏阳的大帅比伍宇威",
        value:"浏阳"
      },
      {
        text:"张家界",
        value:"张家界"
      },
      {
        text:"常德",
        value:"常德"
      },
    ],
    isButton:true,
    col:2,
    mapper:{
      "areaName":"text",
      "areaId":"value",
    }
  },
  {
    key:"fss",
    label:"fsfsf",
    component:"select",
    options:[
      {
        text:"1",
        value:"1"
      },
      {
        text:"12",
        value:"12"
      },
      {
        text:"123",
        value:"123"
      },
    ]
  }
];
const CancelToken = axios.CancelToken
let cancel
function fetch_city() {
  const url = "/api/vendorCityNbEnumList"
  const params =  { enumType: "VENDOR_CITY" }
  /* 一定要返回一个promise */
  return new Promise((resolve,reject) => {
    let p = axios.post(url, params,{
      cancelToken:new CancelToken(function executor(c) {
        // executor 函数接收一个 cancel 函数作为参数
        cancel = c;
      })
    }).then(res => {
      /* 预先处理好 res ，res要符合格式，需是 [{text:"",value:""}] 的形式*/
      /* 一定要记得 resolve() 出去*/
      //reject(res.data)  用于测试消极/积极 all done
       resolve(res.data)

      /* 若不想在此处map增加代码，可以直接按照规则约定一个mapper */
      /**
       * mapper 中的 key - value 遵循以下规则：
       * @key 为接口返回的对象 ，<String>
       * @value 为需要映射成的 text or value ，<String>
       * */
    })
  
  })
}

function FETCH_ALL_CITY() {
  const url = "/api/vendorCityNbEnumList"
  const params =  { enumType: "VENDOR_CITY" }
  /* 一定要返回一个promise */
  return new Promise((resolve,reject) => {
    axios.post(url, params).then(res => {
      /* 预先处理好 res ，res要符合格式，需是 [{text:"",value:""}] 的形式*/
      /* 一定要记得 resolve() 出去*/
      //reject(res.data)  用于测试消极/积极 all done
       resolve(res.data)

      /* 若不想在此处map增加代码，可以直接按照规则约定一个mapper */
      /**
       * mapper 中的 key - value 遵循以下规则：
       * @key 为接口返回的对象 ，<String>
       * @value 为需要映射成的 text or value ，<String>
       * */
    })
  })
}