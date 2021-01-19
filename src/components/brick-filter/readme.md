# 预览



大家好，我又来发东西接受 批斗 了！！！

批斗就是对不满意的人或事，经过大家的允许，共同把错误的地方指出来，然后摆在台面上大家一起对这个人或事进行批评。与批评不同的是，批评可以在没人的地方单独训话，但批斗一定要在显要的地方，而且一定要大多数的人知道。“批斗”是中国术语，这在中国文化大革命中很鲜明的显现出来，尔后就很少有人再用这词了！



预览：你可以狠狠的 [点击这里](http://118.89.138.33:8080/)-- [👈](https://www.yuque.com/backhand-index-pointing-left/)[👈](https://www.yuque.com/backhand-index-pointing-left/)[👈](https://www.yuque.com/backhand-index-pointing-left/)  本次预览没动态数据，是因为本次要开后台请求，我后台请求用node写的，服务器太卡连个node 都装了不爽，没用json 去做 fetch，因为不喜欢mock 。



在线编辑文档：http://medusa.xsyxsc.com/dev/tiance/0.5.0#/zed/business/BrickFilter

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1598088679319-558e1791-4d30-4c57-8b5a-820492841901.png?x-oss-process=image%2Fresize%2Cw_1500)



**大屏宽：**

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1603856418725-1c5d094f-7c00-47be-aab1-17d7b5c17ecd.png?x-oss-process=image%2Fresize%2Cw_1500)

**中屏宽：**

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1603856627588-54a6cfe6-9326-4158-88f5-10903a5e29fa.png)

**小屏宽：**

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1603856647382-9a043e4e-e93c-40f9-b7f4-3f602dc6c80a.png)



## 闲话

回顾前端发展 数据变视图 阶段：

1. Dom 法
2. 数组 join 法
3. ES6 反引号
4. 模板引擎 + 组件 ... 

我们处在第四最新阶段，但是还是免不了要写布局，写html标签 ，近年来的势头也有可视化搭建，将schema数据描述为一个视图，本组件也是受到启发而诞生。中后台表单查询页面还是挺多的，就负责弄了一个filter表单组件，通过配置数据的方式写逻辑。

## 特色

- Vue2 latest  + Element ui v2.14.1
- 样式约束、支持跨列对齐、表单常用属性约束
- 支持修改默认约束、属性透传
- 支持自定义组件传入
- 使用promise 方式管理 下拉框状态
- 对range类型的表单有丰富可用功能，解决默认值是[ ] 的业务痛点
- 使用 render函数利于扩展其它表单类型
- 支持对外扩展。

# Filter 组件

## 安装

```
cnpm i @xsyx/brick-filter -S
```

## 引入

全局使用：推荐在经常能用到此组件的时候使用

```
import BrickFilter from "@xsyx/brick-filter"

Vue.use(BrickFilter);
```

局部使用：

```
import { BrickFilter } from "@xsyx/brick-filter"
```

## 适用场景描述



本组件提供配置化的 Form 生成，无需再书写 template , 适用于表单查询区域的联动性不强的情况。



> 如果场景中有需要联动，请移步至 [联动介绍](#联动介绍)



```
<brick-filter :view-brick="filterView" />
```



## Attribute

| 属性名称   | 说明                         | 类型  | 默认值 |
| ---------- | ---------------------------- | ----- | ------ |
| view-brick | 表单项配置                   | Array | 无     |
| ref        | 通过ref 获取本组件的 methods |       |        |



- view-brick 的情况请跳转至 [View-Brick](#View-Brick) 查看



## Event

| 事件名称        | 说明                                                         | 回调参数            |
| --------------- | ------------------------------------------------------------ | ------------------- |
| change          | 任意响应式数据发生改变时触发                                 | ( context ) => {  } |
| query           | 点击 "查询" 按钮触发的回调                                   | ( data ) => {  }    |
| allDone         | Options的远程数据Promise状态为 rejected \| rulfilled，并且表单全部渲染完毕时触发，（积极的） | ( filter) => {  }   |
| negativeAllDone | Options的远程数据Promise状态为 fulfilled，并且表单全部渲染完毕时触发，（消极的） | ( filter) => {  }   |



## Methods

| 方法名称          | 说明                                                     | 参数                                  |
| ----------------- | -------------------------------------------------------- | ------------------------------------- |
| getOptionsMap     | 获取select、checkboxGroup、radioGroup的 options 数据     | Function(key?:string):array \| object |
| setOptionsMap     | 设置select、checkboxGroup、radioGroup的 options 数据     | Function(key?:string,value?:any):void |
| setReactiveFilter | 显式的给 filter 的属性赋值，注意是响应式，内部会收到更改 | Function(key?:string,value?:any):void |
| getReactiveFilter | 显式的获取 filter 对象，注意获取到的是响应式的filter     | Function():object                     |
| getQueryParams    | 显式的获取 filter 对象，内部的非响应式对象的拷贝         | Function():object                     |



## Filter 基本用法



查询数据，提供`query` 回调自行处理

```js
<template>
  <div id="app">
    <brick-filter
      ref="amaz-filter"
      :view-brick="filterView"
      @change="handleChange"
      @query="handleQuery"
      @allDone="handleAllDone"
      @negativeAllDone="negativeAllDone"
    >
    </brick-filter>
  </div>
</template>
<script>
import BrickFilter from "./components/brick-filter";
import viewConfig from "./viewConfig";
export default {
  name: "App",
  components: {
    BrickFilter
  },
  data() {
    return {
      filterView: viewConfig,
    };
  },
  methods: {
    handleChange({key, newval, oldval,filter}) {
      console.table([
        `当前变更的字段为${key}`,
        `当前值为 ${newval}`,
        `旧的值为 ${oldval}`
      ]);
    },
    handleQuery(data) {
      console.log(data);
    },
     handleAllDone(filter) {
       /* 积极的 all Done 事件，表单渲染完成，并且托管给表单的所以options的请求都 
       fulfilled 或 rejected 就会触发*/
      let maps = this.$refs["amaz-filter"].getOpionsMap()
      filter.vendorCity.push(maps.vendorCity[0].value) 
    },
    negativeAllDone(filter){
        // 消极的 all Done事件，表单渲染完成，并且非得所有的请求都是 fulfilled 才触发
    }
  }
};
</script>
```



## 联动介绍



若需表单值之间的联动，请走 change 事件,并拿到 emit 出来的值，入参提供一个 context ,解构出来的值分别是 key,newValue,oldValue,filter ，filter 是内部查询参数（非响应式）



```js
change({ key,newValue,oldValue,filter} ) { 
  if(key === "xxx"){
     // 配合提供的 methods 使用
  }
}
```



> 此处提供一个基础示例，
>
> 可以通过 ref 来调用该组件的方法，通过change提供的精确能力，可改动 filter 的值，亦可改变 select、checkboxGroup、radioGroup 组件的options 值，见 [推荐阅读](https://www.yuque.com/) 章节



# View-Brick 配置



视图砖块，会随传入的数组item的顺序来进行渲染。这点很重要，因为在视图砖块中你可以根据砖块的大小来合理安排砖块所在的位置（在数组中的位置）来决定最终渲染的布局，达到砖块的基本对齐。



![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1603856321393-2fd0420a-17de-4f98-9f41-10adbfbc8ea5.png?x-oss-process=image%2Fresize%2Cw_1500)



## 最简单的使用



只需提供 key 与 label ，可生成输入框

```js
{
  key: "vendorId",
  label: "供应商ID",
}
```



生成如下所示 input ：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1599182413556-9e9ec418-7dca-46ef-a851-e1cf3db002e0.png)



## 不完全配置概览



```js
/* eslint-disable*/
/* 加入表单校验器 */
import { phoneNumberValidator } from "./validator";

/* 自定义级别 组件 */
import custom from "./components/custom.vue"
import testRange from "./components/testRange.vue"

export default [
  {
    key: "vendorId",
    label: "供应商ID",
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
        value:"VEGETABLE"
      },
      {
        text:"常规供应商",
        value:"SIMPLE"
      }
    ],
    default:[],
    rules: [{ required: true, message:"类型必选", trigger: "change" }]
  },
  {
    key: "signInTime",
    label: "注册时间",
    component:"picker",
    type: "datetime",
    //default: "2020-07-08"
  },
  {
    key: "vendorXTimeStart",
    label: "供应商牛逼时间（起）",
    component:"picker",
    type: "datetime",
    default: "2020-07-12 00:00:00"
  },
  {
    key: "vendorXTimeEnd",
    label: "供应商牛逼时间（止）",
    component:"picker",
    type: "datetime",
    default: "2020-08-25 23:59:59"
  },
  {
    key: ["tmApplyStart","tmApplyEnd"],
    label: "供应商入驻申请时间",
    component:"picker",
    type: "datetimerange",
    default: ["2020-07-08 00:00:00","2020-07-08 00:00:00"],
    timeBetween:true,
    limit:3
  },
  {
    key:"search",
    label:"搜索用户",
    component:custom,
    default:"334"
  }
];
```



## input



用于生成 input 输入框，指定`component:"input"` 即可，不指定默认渲染为 input 类型

| 属性名称  | 说明                 | 类型             | 默认值  |
| --------- | -------------------- | ---------------- | ------- |
| key       | 字段名               | String           | 无      |
| label     | label名称            | String           | 无      |
| component | 最终渲染成什么       | String           | "input" |
| default   | 默认值               | String \| Number | 无      |
| rules     | 校验规则             | Array            | 无      |
| ttrs      | 原生属性请传入在这里 | Object           | 无      |



## select



用于生成 select 下拉框，支持远程数据源配置，传入后自动请求，返回体提供 `fit()` 方法，需要处理格式为 `return [{text:"",value:""}]`

| 属性名称  | 说明           | 类型              | 默认值   |
| --------- | -------------- | ----------------- | -------- |
| key       | 字段名         | String            | 无       |
| label     | label名称      | String            | 无       |
| component | 最终渲染成什么 | String            | "select" |
| default   | 默认值         | Array             | 无       |
| rules     | 校验规则       | Array             | 无       |
| options   | 下拉框可选值   | Array \| Function | [ ]      |



### options

类型支持：

- Array
- Function



### options  - Array

```
{
  options:[
    {
        text:"",
      value:""
    },
    {
        text:"",
      value:""
    },
  ]
}
```

### options - Function <Promise> 

```
{
    options:() => {
    const url = "/api/vendorCityEnumList"
    const params =  { enumType: "VENDOR_CITY" }
    /* 一定要返回一个promise */
    return new Promise(resolve => {
      axios.post(url, params).then(res => {
        /* 预先处理好 res ，res要符合格式，需是 [{text:"",value:""}] 的形式*/
        /* 一定要记得 resolve() 出去*/
        resolve(res.data.data)
      })
    })
  }
}
```

> 推荐使用这个用法，但有个问题，接口返回的数据一般是需要重新map 的，因此你可能需要 mapper 这个专门为options服务的特殊属性
>
> map 映射表的使用场景见  [常见问题](#常见问题)

## radioGroup

配置与select 一致，同样支持本地静态数据、自定义远程数据请求，限制为单选

额外的配置：isButton 设置 radio 是否为 button 样式 <Boolean>

## checkboxGroup

配置与select 一致，同样支持本地静态数据、自定义远程数据请求，限制为多选

额外的配置：isButton 设置 checkbox 是否为 button 样式 <Boolean>

## picker



用于生成 `["date","daterange","datetime","datetimerange"]` 类型的 picker，如需要其它类型的 picker 请走 `component`  配置

| 属性名称           | 说明                                                         | 类型                                   | 默认值   |
| ------------------ | ------------------------------------------------------------ | -------------------------------------- | -------- |
| key                | 字段名，range 类型时请使用 Array                             | String \| Array                        | 无       |
| label              | label名称                                                    | String                                 | 无       |
| component          | 最终渲染成什么                                               | String                                 | "picker" |
| default            | 默认值                                                       | String \| Array \|Date \| Number时间戳 | 无       |
| rules              | 校验规则                                                     | Array                                  | 无       |
| type               | date \| daterange \| datetime \| datetimerange \| year \| month | String                                 | 无       |
| timeBetween        | 类型为datetimerange 的时候 开始时间为 00:00:00，结束为 23:59:59 | Boolean                                | false    |
| limit              | range类型的时间 最多为多少 天（单位）                        | Number （int）                         | /        |
| sameDayTimeBetween | 类型为datetimerange 的时候选择同一天时自动应用timeBetween效果 | Boolean                                | false    |



## switch

switch 默认采用 el-checkbox 进行渲染，且无法改变，因此你看到的样式是固定为这样的：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1602580414004-83bd1c92-b82d-4475-bf91-84ed0e465fe3.png)





| 属性名称       | 说明           | 类型             | 默认值  |
| -------------- | -------------- | ---------------- | ------- |
| key            | 字段名         | String           | 无      |
| label          | label名称      | String           | 无      |
| component      | 最终渲染成什么 | String \| Object | "input" |
| default        | 默认值         | String \| Number | 无      |
| rules          | 校验规则       | Array            | 无      |
| allowableValue | 允许的值       | Array            |         |



> 不配置 allowableValue 时，默认勾选为 true ，不勾选为 false ，如需其它值请配置 allowableValue

```
{
    key:"isOpen",
    label:"仅显示差异数据",
    component:"switch",
    default:"牛逼",
    allowableValue:["牛逼","不牛逼"]
}
```

> allowableValue:[true,false]   -- 禁止这么做

## `component` `<Object>`



本组件默认没提供的表单类型 或 复杂的表单输入，你都可以通过 import 进来，然后传入，注意！ 新加入的表单无需附上 `el-form-item`

示例代码 :

```js
{
    key:"search",
    label:"搜索用户",
    component:CustomComponent, // import CustomComponent from "xxx"
    default:"334" // 默认值,
  	props:{} // 传值给你的自定义组件
}
```



## `component` `<Object>`自定义组件的双向数据流方式：



三要素:接收父级值、监听本地值、监听父级值

```javascript
<template>
      <el-input placeholder="请输入内容" v-model="lovalVal">
          <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
</template>
<script>
export default {
    name:"CustomComponent",
    props:{
        vModel:[String] //确定你的自定义组件使用的是什么数据类型，与 view-brick 的 default中指定默认值类一致
    },
    data(){
        return {
            lovalVal:""
        }
    },
    watch:{
        lovalVal(newval){
            /* 已在组件内部注入change方法，此组件只需emit，表单中就能接收到此自定义组件的值 */
            /* 自定义的组件，一定要有这一步，父子组件的通讯靠的就是 emit */
            this.$emit("change",newval) 
        },
        vModel:{
            immediate:true, // 接收默认值时必须使用 immediate
            handler:function (newval){
                this.lovalVal = newval
            }
        }
    }
}
</script>
```



> props 一定要接收 vModel
>
> vModel，提供默认值时必须使用watch 高级用法，设置立即执行，或者在 mounted 中手动赋值给本地变量，
>
> localval ，这个名字随便起，
>
> 需要响应式数据就必须 emit 注入的 change 事件



# 关于按钮



![image](https://cdn.nlark.com/yuque/0/2020/png/1185510/1598088762455-cf79e5a0-81fe-4bb1-87db-e08cf196145d.png)



- 重置 就是 default 给的是什么值，点了后就是什么值
- 清空就是所有的值都为原始形态 （已在新版本中弃用）
- 展开全部是因为 表单过大的情况下把有效数据区域都挡住了，这个按钮可以隐藏、显示悬浮框，（大于两条配置时 自动将内容渲染在 下方悬浮区域）(新版本中已改变样式)



# 注意事项

- **关于 key**

> 在配置"砖块"的key的时候,请不要重复，否则将被覆盖
>
> [ { key:"accountNumber" },{ key:"accountNumber" } ] ❌



- 约定date 的类型为 "yyyy-MM-dd" ,约定datetime 的类型为 "yyyy-MM-dd HH:mm:ss" ,
- 不要将range类型的picker作为自定义组件选项，否则清空按钮无法做到清空该砖块的"表面值"，（实际值已清空，但是element中的 displayValue 中还有值，可能是ele的bug）

> component: rangepicker   请不要这么干，内部已经有可用的配置  ❌
>
> { component:"date",type="daterange" }  推荐 ✅

- 给range 类型的picker 赋值默认值时你必须传入一个符合约定格式的字符串，否则初值会报错，如 ：

> Tue Sep 15 2020 10:59:23 GMT+0800 (中国标准时间)  你等着报错吧❌（新版本已修复）
>
> 2020-09-15 10:59:23   通过 ✅



- **关于属性的透传**

> 原则上不允许使用额外的配置，但开这个后门也是提高了本组件的覆盖场景，属性透传只适用于一层的透传，比如传配置给 el-select 无法透传到 el-option 上面，传配置给 el-checkbox-group 无法透传到 el-checkbox上，el-radio-group亦然。

- **关于动态修改 view-brick**

> 已实现可动态修改 view-brick ，代价是部分表单重新渲染（根据修改的不同可能造成brick-filter内部全部表单的重新渲染）。
>
> 重新渲染的若为动态远程数据的表单，则请求会如期执行，但无法触发请求完成后的 allDone 事件，allDone 时间只在初次载入表单后执行，相当于 mounted 后的另外一个事件
>
> 注意 ： 动态修改 view-brick 中的 某一元素（该元素是个对象）的某个属性，无法生效，因为 vue 对数组变化监听的原因，请手动使用 splice pop 等真正影响到数组 length 的方法来进行改动。你可以先将要改动的元素保存起来拷贝一份，将该元素从数组中删除后，进行修改，再进行插入（说白了就是想动态修改view-brick 并要取得作用就好好想想vue是如何处理数组的）



# 推荐阅读



### 将枚举状态交给brick-filter管理

你只需要牺牲看一遍如何使用promise的方式来管理枚举列表的时间，这样带来的好处：

- 只关心数据，专注
- 接口方面利于维护，比如这个枚举接口以后要下掉，我只需要去掉一个 view-brick的item就行
- 可准确的在整个表单都完成数据请求，并且渲染完成后触发 allDone 事件



### options - Function<Promise> 



![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1600914541321-61f9b2d3-0df6-49f0-8085-0f2bd91bdcea.png)

这种场景下的情况我只需要用到接口中的  areaId 和 areaName,衍生出来的 options的写法大概就是这样：

```js
options: () => {
  return new Promise( resolve => {
			Api.getAreaNameEnumList().then( res => {
      if(res && res.rspCode === "success"){
        let arr = res.data.map( item => {
          return {
            text:item.areaName,
            value:item.areaId
          }
        })
        resolve(arr)
      }
    })
  })
}
```

相当于我无意中又多了 6 - 8 行的丑陋的代码，加入一个映射表 mapper 来解决 ，最终的代码 示意图为下：



```js
{
  ...,
  options: () => {
    return new Promise( resolve => {
			Api.getAreaNameEnumList().then( res => {
        res && res.rspCode === "success" && resolve(res.data)
        reject()
      })
    })
  },
  mapper:{
    "areaName":"text",
    "areaId":"value"
  }
}
```

> 这样以来简单明了多了

```js
function fetch_city() {
  const url = "/api/vendorCityNbEnumList"
  const params =  { enumType: "VENDOR_CITY" }
  /* 一定要返回一个promise */
  return new Promise(resolve => {
    axios.post(url, params).then(res => {
      /* 预先处理好 res ，res要符合格式，需是 [{text:"",value:""}] 的形式*/
      /* 一定要记得 resolve() 出去*/
      resolve(res.data)
      
      /* 若不想在此处map增加代码，可以直接按照规则约定一个mapper ,
      则此时resolve出去的一定是一个可迭代的数组对象*/
      /**
       * mapper 中的 key - value 遵循以下规则：
       * @key 为接口返回的对象 ，<String>
       * @value 为需要映射成的 text or value ，<String>
       * */
    })
  })
}
```

###  

### @allDone 取代你的 mounted 中调用列表数据

情况如下图，需要在获取到区域的和状态的枚举再请求可以在状态交给view-brick管理后，监听allDone组件轻松实现：**前提是将你的枚举数据状态交给 view-brick 管理**



# ![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1601274391963-a1384232-1d9d-4b3a-bdfd-8482605297a2.png?x-oss-process=image%2Fresize%2Cw_1500)



代码示意：

```js
methods: {
    filterAllDone(filter){
      alert("这里是all done 函数的回调 666")
      this.queryParams = _.cloneDeep(filter)
      this.getList()
    },
    async getList() {
      const params = {
        ...this.queryParams,
        page: this.page.num,
        rows: this.page.size,
      };
      api.getPageList().then( () => {
                //      ...
      }).catch()
    }
}
```

### 关于积极/消极的 allDone 事件

这个需求场景的前置要求是你愿意将 select 、check/radio Group这些类型的 options promise状态交给组件管理，在 promise完成后触发调用的方法有所不同，分别使用 Promise.all / Promise.allSettled实现，下面详细说明下区别



- **allDone [积极的]** ，在表单渲染完成后，且所有获取options数据的请求（Promise）都达到 ed状态（fulfilled，rejected）就会被触发
- **negativeAllDone [消极的]**，在表单渲染完成后，且所有获取options数据的请求（Promise）都达到 fulfilled 状态，才会被触发



### 关于 options 的 setter 与  getter



有时你想要点击某个下拉框，该下拉框触发change 事件后改变另外一个 下拉框的options（即渲染的值），找不到正恼火的时候怎么办，别担心，有对应的ref 事件可以调用



- getOpionsMap
- setOpionsMap



使用示例：当key 为 vendorCity 的值改变时 ，修改 vendorArea 的即将渲染的值。

```js
<template>
  <brick-filter
      ref="amaz-filter"
      :view-brick="filterView"
      @change="handleChange"
    />
</template>
<script>
export default {
  
  methods:{
    handleChange({ key, newVal, oldVal, filter }) {
      if (key === 'vendorCity') {
        this.$refs["amaz-filter"].setOptionsMap("vendorArea",[{
          text:"牛逼",
          value:"nb"
        }])
      }
    }
  }
}
</script>
 this.$refs["amaz-filter"].getOptionsMap() // 这个方法返回所有的options
 this.$refs["amaz-filter"].getOptionsMap("areaId") // 这个方法只返回areaId的list数据
```

> 注意！此时获取到的 options 已经去除响应式绑定，如此设计是源于面向对象编程中的 get 的特性



### select类型表单取第一项为默认值

关键函数 setReactiveFilter

```js
handleAllDone(){
    this.setupDefaultForSelect()
},
setupDefaultForSelect(){
    const map = this.$refs['amaz-filter'].getOptionsMap('vendorCity')
    this.$refs["amaz-filter"].setReactiveFilter("vendorCity",[map[0].value ])
},
```



> 保险起见调用setReactiveFilter函数时 确保在allDone 事件中进行,这样确保能拿到远程接口的值，这个示例中展示了给 vendorCity 属性赋值的方法（示例中的 vendorCity 是多选项，即一个数组类型），setReactiveFilter 内部已开启参数类型校验，必须参数类型一致才允许赋值
>
> ⚠️ 在使用allDone 时间的时候区分是积极的还是消极的，以免使用setReactiveFilter发生意外



### 关于布局对齐

视图砖块，会随传入的数组item的顺序来进行渲染。这点很重要，因为在视图砖块中你可以根据砖块的大小来合理安排砖块所在的位置（在数组中的位置）来决定最终渲染的布局，达到砖块的基本对齐。效果如下：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1603856321393-2fd0420a-17de-4f98-9f41-10adbfbc8ea5.png?x-oss-process=image%2Fresize%2Cw_1500)

如果你是一个强迫症患者，要对齐就彻底地对齐：使用 col:2 即可跨列加宽

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1185510/1607594588555-ef994f10-43ae-4bdb-a52a-38e6f14e9a29.png?x-oss-process=image%2Fresize%2Cw_1500)



```js
  {
    key: "vendorCitys",
    label: "供应商所在城市s",
    component: "checkboxGroup",
    options: fetch_city,
    isButton:true,
    col: 2,
    mapper:{
      "areaName":"text",
      "areaId":"value",
    }
  },
```

> range类型的表单已默认跨2列 ，并且 col 属性可为浮点型！！！

### 没有你想要的配置？

作为一个后门，当然留了一手，那就是属性的 透传与merge ，本组件的宗旨是【 约定大于配置】，但是也存在需要将属性进行稍许修改的情况。通过下面这个示例来了解，你可以传入符合 element-ui filter组件的所有配置。



- 比如：禁用表单

```js
{
    key: "vendorId",
    label: "供应商ID",
    default:"123456",
    disabled:true,
}
```

- 比如：查询时间需要必选

```js
{
    key: ["tmApplyStart","tmApplyEnd"],
    label: "供应商入驻申请时间",
    component:"picker",
    type: "datetimerange",
    clearable: false, // 此时只需要设置这个就行，因为内部组件约束为 true
    timeBetween:true,
    limit:3
},
```

... etc 