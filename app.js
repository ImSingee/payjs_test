//app.js
App({
  onShow: function (options) {
    if (options.scene === 1038) { // 来源于小程序跳转
      // 还应判断来源小程序 appid、请求路径
      let referrerInfo = options.referrerInfo
      let extraData = referrerInfo.extraData
      this.globalData.resultCode = extraData.resultCode
      this.globalData.msg = extraData.msg
      this.globalData.payjsOrderId = extraData.payjsOrderId
    }
  },
  globalData: {
    resultCode: 'WAITING',
    msg: '等待支付',
    payjsOrderId: ''
  }
})