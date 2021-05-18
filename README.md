### 简体中文  

### 全局捕获错误并保存日志(仅适用于express)  
  
> npm install handle-err  
> yarn add handle-err  
  
  

1. 在app.js里，引入express之前引入`handle-err`  
2. 同时不再需要写`try/catch`了，直接抛出错误(`throw new Error()`)就可以了   
3. 所有页面的错误，都在`app.js`的错误捕获中间件里进行统一处理    
  
   
示例代码  

```js
export const ERROR_TYPE = {
  400: 'Bad Request',           
  401: 'Unauthorized',          
  403: 'Forbidden',             
  404: 'Not Found',             

  500: 'Internal Server Error', 
  503: 'Service Unavailable',   
  
  622: 'Some Custom'
}

// -->
export const THROW_ERROR = (status, info='') => {
  throw new Error(`${status}-->${ERROR_TYPE[status]}-->${info}`)
}
```

```js
const express = require('express')
require('handle-err')

const app = express()

app.use(async (req, res) => {
  const user = await getUser()
  if (!user) THROW_ERROR(401)   //THROW_ERROR(401, 'some info')
})
 

// 所有页面的错误，都在这里捕获
app.use((err, req, res, next) => {
  if(err.message === 'jwt expired'){
    res.status(401).send('用户登录过期，请重新登录')
  }
  if(err.message === ERROR_TYPE[401]) {
    res.status(401).send('用户未登录，请先登录')
  }
  next(err)
})
```
  
### 保存    
`900`错误码为系统内部发生的错误，非用户定义的。   
会将日志保存在根目录的`logs/`目录下   
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8229348d5600484ab22387c4c9cf3d81~tplv-k3u1fbpfcp-watermark.image)




### English  

### Handle global errors and save logs (express only)   
  
> npm install handle-err  
> yarn add handle-err  
    
  
1. In app.js before introducing express, introduce `save error` immediately   
2. At the same time, you don't need to write `try / catch`, just throw a new error by (`throw new error()`)  
3. All page errors are in `app.js ` In the error capture middleware  
   

  
  
code  
  
```js
export const ERROR_TYPE = {
  400: 'Bad Request',           
  401: 'Unauthorized',          
  403: 'Forbidden',             
  404: 'Not Found',             

  500: 'Internal Server Error', 
  503: 'Service Unavailable',   
  
  622: 'Some Custom'
}

// -->
export const THROW_ERROR = (status, info='') => {
  throw new Error(`${status}-->${ERROR_TYPE[status]}-->${info}`)
}
```  
  
```js
const express = require('express')
require('handle-err')

const app = express()

app.use(async (req, res) => {
  const user = await getUser()
  if (!user) THROW_ERROR(401)   //THROW_ERROR(401, 'some info')
})
 

// All page errors are captured here
app.use((err, req, res, next) => {
    if(err.message === 'jwt expired'){
    res.status(401).send('User login expired, please login again')
  }
  if(err.message === ERROR_TYPE[401]) {
    res.status(401).send('User not logged in, please log in first')
  }
  next(err)
})

```
  
### Saved    
`The 900` error code is an internal error of the system, which is not user-defined.   
The log will be saved in the `logs/` directory of the root directory   
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8229348d5600484ab22387c4c9cf3d81~tplv-k3u1fbpfcp-watermark.image)
  