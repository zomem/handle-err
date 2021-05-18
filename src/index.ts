const Layer = require('express/lib/router/layer');
const Router = require('express/lib/router');
import saveError from './utils/save'
import {getTime} from './utils/utils'


const last = (arr = []) => arr[arr.length - 1];
const noop = Function.prototype;

function copyFnProps(oldFn, newFn) {
  Object.keys(oldFn).forEach((key) => {
    newFn[key] = oldFn[key];
  });
  return newFn;
}

function wrap(fn) {
  const newFn = function newFn(...args) {
    const ret = fn.apply(this, args);
    const next = (args.length === 5 ? args[2] : last(args)) || noop;
    if (ret && ret.catch){ 
      ret.catch(err => {
        let nowTime = getTime('date_time')
        if(err.message){
          let errArr = ['', '', '']
          let tempE = err.message.split('-->')
          if(tempE.length > 1){
            errArr[0] = tempE[0]
            errArr[1] = tempE[1].replace(/(^\s*)|(\s*$)/g, '')
            errArr[2] = tempE[2] ? tempE[2].replace(/(^\s*)|(\s*$)/g, '') : ''
          }else{
            errArr[0] = '900'
            errArr[1] = tempE[0].replace(/(^\s*)|(\s*$)/g, '')
          }
          let tempErr = {
            type: parseInt(errArr[0]),
            time: nowTime,
            url: args[0].originalUrl,
            method: args[0].method,
            message: errArr[1],
            info: errArr[2] ? errArr[2] : null,
            host: args[0].headers.host,
            params: args[0].params,
            body: args[0].body,
            statusCode: args[0].statusCode,
          }
          err.message = errArr[1]
          saveError(args[0].originalUrl.split('/')[1], JSON.stringify(tempErr), nowTime)
        }else{
          let tempErr = {
            type: 902,
            time: nowTime,
            url: args[0].originalUrl,
            method: args[0].method,
            message: JSON.stringify(err),
            info: null,
            host: args[0].headers.host,
            params: args[0].params,
            body: args[0].body,
            statusCode: args[0].statusCode,
          }
          saveError(args[0].originalUrl.split('/')[1], JSON.stringify(tempErr), nowTime)
        }
        next(err)
      })
    }
    return ret;
  };
  Object.defineProperty(newFn, 'length', {
    value: fn.length,
    writable: false,
  });
  return copyFnProps(fn, newFn);
}

function patchRouterParam() {
  const originalParam = Router.prototype.constructor.param;
  Router.prototype.constructor.param = function param(name, fn) {
    fn = wrap(fn);
    return originalParam.call(this, name, fn);
  };
}

Object.defineProperty(Layer.prototype, 'handle', {
  enumerable: true,
  get() {
    return this.__handle;
  },
  set(fn) {
    fn = wrap(fn);
    this.__handle = fn;
  },
});

patchRouterParam();
