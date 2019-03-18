# PAYJS 小程序支付框架与示例

本示例采用了框架 + 示例调用的形式，用于使用 [PAYJS](https://payjs.cn/ref/WDQGQD) 的小程序支付


注：根据微信规范，iOS 系统上不能使用虚拟支付

注：最低基础库为 2.4.0，请注意修改小程序后台设置中的最低基础库版本和开发者工具中的调试基础库版本

## 测试
克隆本仓库后使用微信开发者工具加载本项目源码，注意在创建项目时将 appid 修改为自己的

在 utils/util.js 中

```js
// 在下面设置商户号
const mchid = ''

// 在下面设置密钥
// 特别注意：此项设置应该仅供测试，生产环境下请在后端完成签名，切忌在小程序内暴露商户密钥
const secret = ''
```

这两个部分分别设置为自己的商户号和密钥（不设置的话你测试用的钱结算到我这里我不还）

## 生产环境

### Step 1

在 app.json 文件中加入

```json
  "navigateToMiniProgramAppIdList": [
    "wx959c8c1fb2d877b5"
  ]
```

### Step 2

将 `components/payjs/*` 整个文件夹复制到你的项目中的相同结构文件夹

### Step 3

在需要用到支付功能的页面的 `.json` 文件中加入

```json
  "usingComponents": {
    "payjs": "/components/payjs/payjs"
  }
```

### Step 4

在需要用到支付功能的页面的 `.wxml` 文件**最底端**加入

```xml
<payjs wx:if="{{ preparePay }}" params="{{ orderParams }}" bindsuccess="bindPaySuccess" bindfail="bindPayFail" bindcomplete="bindPayComplete" bind:dataChange="bindDataChange"/>
```

### Step 5

在需要用到支付功能的页面的 `.js` 文件中的 `data` 数据内加入以下三个数据

```js
{
  orderParams: {}, // 支付发起参数
  preparePay: false, // 控制 payjs 组件的创建与销毁
  paying: false, // 可选：如需知晓用户是否「已经跳转到了 PAYJS 小程序还未返回」的状态则可通过事件处理函数监听事件内的 paying 数据
}
```

数据名称可以更改，但是更改时请注意保证和上面的 `.wxml` 文件内数据绑定及下面的事件处理函数中保持一致


orderParams 用于放置发起支付的参数（必填）

preparePay 用于控制 payjs 支付组件的创建与销毁


在此页面加入四个事件处理函数

```js
/**
  * 支付成功的事件处理函数
  * 
  * res.detail 为 PAYJS 小程序返回的订单信息
  * 
  * 可通过 res.detail.payjsOrderId 拿到 PAYJS 订单号
  * 可通过 res.detail.responseData 拿到详细支付信息
  */
bindPaySuccess (res) {
  console.log('success', res)
  console.log('[支付成功] PAYJS 订单号：', res.detail.payjsOrderId)
  this.setData({
    orderResults: res.detail,
    needRefreshOrderParams: true
  })
  wx.showModal({
    title: '支付成功',
    content: 'PAYJS 订单号：' + res.detail.payjsOrderId,
    showCancel: false
  })
},
/**
  * 支付失败的事件处理函数
  * 
  * res.detail.error 为 true 代表传入小组件的参数存在问题
  * res.detail.navigateSuccess 代表了是否成功跳转到 PAYJS 小程序
  * res.detail.info 可能存有失败的原因
  * 
  * 如果下单成功但是用户取消支付则可在 res.detail.info.payjsOrderId 拿到 payjs 订单号
  */
bindPayFail (res) {
  console.log('fail', res)
  if (res.detail.error) {
    console.error('发起支付失败', res.detail.info)
  } else if (res.detail.navigateSuccess) {
    console.log('[取消支付] PAYJS 订单号：', res.detail.info.payjsOrderId)
  }
},
/**
  * 支付完毕的事件处理函数
  * 
  * 无论支付成功或失败均会执行
  * 应当在此销毁 payjs 组件
  */
bindPayComplete () {
  console.log('complete')
  this.setData({
    preparePay: false, // 销毁 payjs 组件
  })
},
/**
  * 【可选】组件内部数据被修改时的事件
  * 
  * 当前仅用于监听 paying 数据
  * 当用户跳转到 PAYJS 小程序并等待返回的过程中 paying 值为 true
  */
bindDataChange (res) {
  if (res.detail.paying) {
    this.setData({
      paying: res.detail.paying
    })
  }
}

```

### Step 6

为支付页面的支付按钮绑定以下事件

```xml
<button bindtap="onTapPay">发起支付</button>
```

```js
onTapPay: function() {
  // 事件处理函数 - 点击支付按钮
  this.setData({ 
    preparePay: true,
    orderParams: {
      // 这里传入【后端返回并签名完毕】的支付发起参数
    }
  })
},
```

## 写在最后 & 免责声明

1. 订单信息的生成、签名与订单支付状态的判断都应该在后端返回和判断，小程序的返回值仅应作为参考使用，应以为准
2. 如在使用过程中有问题，请阅读代码，如仍有问题，请发 Issue
3. 本人不保证此框架可一直可用也不为此框架所产生的任何问题负责
