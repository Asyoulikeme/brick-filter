/*
 * @Description: all in filter， by yuwei
 * @Version:
 * @Author: yuwei
 * @Date: 2020-09-29 17:18:47
 * @LastEditTime: 2020-10-05 10:31:03
 */

export function _deepClone(target) {
  let result;
  if (typeof target === "object") {
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(_deepClone(target[i]));
      }
    } else if (target === null) {
      result = null;
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      result = {};
      for (const i in target) {
        result[i] = _deepClone(target[i]);
      }
    }
  } else {
    result = target;
  }
  return result;
}

export function toFormData(params) {
  const formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });
  return formData;
}

export function toImitateFormData(params) {
  return new URLSearchParams(params).toString();
}
/**
 * @description 两字符串中找前置公共串
 * @param {string}
 * @return {index,undefined}
 */

export function foundDiffIndex(a, b) {
  const arr1 = a.split("");
  const arr2 = b.split("");

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return undefined;
}

/**
 * @data 需要转换的数据
 */
export function _DO_MAPPER_TRANSFER(data) {
  /**
   * @this 请在调用该方法的时候改变一下this的指向
   * mapper 中的 key - value 遵循以下规则：
   * @key 为接口返回的对象 ，<String>
   * @value 为需要映射成的 text or value ，<String>
   * */
  const newArr = [];
  data.forEach(item => {
    const newObj = {};
    for (const key in this.config.mapper) {
      Object.assign(newObj, { [this.config.mapper[key]]: item[key] });
    }
    newArr.push(newObj);
  });
  return newArr;
}

/**
 * 查找实例，传递给 options
 * @description 解决 options 中无法获取 this 问题
 */
function findComponentUpward(context) {
  let parent = context.$parent;
  let name = parent.$options.name;
  const filterName = "BrickFilter";
  const blendPageName = "ZBlendPage";

  // 找到 BrickFilter 实例
  while (parent && (!name || name !== filterName)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  // 父级为 ZBlendPage 实例
  if (parent.$parent.$options.name === blendPageName) {
    parent = parent.$parent;
  }
  // 返回父级实例
  parent = parent.$parent;
  return parent;
}

/**
 * @executor 回调执行函数
 * @next 下一步操作
 */
export function _WAIT_PROMISE_FULFILLED(executor, next) {
  /**
   *  约定外部传来的 executor 是一个函数
   *  executor 执行后返回一个promise
   * */
  if (this.remoteData.length !== 0) {
    /* 有值，直接去构造 options */
    return next(this.remoteData);
  } else if (this.singleFetchCount === 0) {
    /* 累加器 最大为 1 */
    this.singleFetchCount += 1;
    Object.freeze(this.singleFetchCount);
    /* options 传递实例参数 */
    const vm = findComponentUpward(this);
    /* 无值，去fetch 远程 options */
    const promise = executor(vm);
    if (promise instanceof Promise) {
      window.asyncQueue
        ? window.asyncQueue.push(promise)
        : (window.asyncQueue = []),
        window.asyncQueue.push(promise);
      promise.then(res => {
        this.remoteData = res;
      });
    } else {
      this.remoteData = promise;
    }
  }
  return next(this.remoteData);
}

/**
 * @ALL 所有的配置
 * @PRIVATE 内部定义的私有配置，禁止改动的配置
 * @PUBLIC  内部定义的私有配置，可进一步覆写的配置
 */
export function _PROPS_MERGE(ALL, PRIVATE, PUBLIC) {
  const PRIVATE_KEYS = Object.keys(PRIVATE);
  /* 私有化所有内部属性，禁止改动 */
  PRIVATE_KEYS.forEach(key => {
    Object.defineProperty(PRIVATE, key, {
      writable: false
    });
  });
  /* 覆写内部属性，允许改动 */
  const TEMP = {
    ...PUBLIC,
    ...ALL
  };
  try {
    const FINAL_OBJECT = Object.assign(PRIVATE, TEMP);
    return FINAL_OBJECT;
  } catch (e) {
    console.error(e);
    console.error("不许将私有属性重新修改，该component 类型的私有属性为： ");
    console.error(PRIVATE_KEYS);
    return {
      ...PUBLIC,
      ...PRIVATE
    };
  }
}

export function allSettledPolyfill(promiseList) {
  return new Promise(function(resolve, reject) {
    if (Object.prototype.toString.call(promiseList) !== "[object Array]") {
      return reject(
        new TypeError(
          typeof promiseList +
            " " +
            promiseList +
            " " +
            " is not iterable(cannot read property Symbol(Symbol.iterator))"
        )
      );
    }
    let args = Array.prototype.slice.call(promiseList);
    if (args.length === 0) return resolve([]);
    let arrCount = args.length;

    function resolvePromise(index, promise) {
      if (typeof promise === "object") {
        /**
         * 拿到循环当前的promise实例上原始的then方法
         * 此时该promise可能有自己的then，此处的then 并不会覆盖自己的then
         * 原因是由于 then 可以使用多次，
         * 该polyfill中then的入参会在其本身的then执行后执行
         * 并在其中调用polyfill promise的 resolve方法
         * */
        let then = promise.then;
        if (typeof then === "function") {
          then.call(
            promise,
            function(val) {
              args[index] = { status: "fulfilled", value: val };
              if (--arrCount === 0) {
                resolve(args);
              }
            },
            function(e) {
              args[index] = { status: "rejected", reason: e };
              if (--arrCount === 0) {
                resolve(args);
              }
            }
          );
        }
      }
    }
    for (let i = 0; i < args.length; i++) {
      resolvePromise(i, args[i]);
    }
  });
}
