const app = getApp()
const utils = require('../../utils/util.js')

Page({
  data: {
    mchId: '1511214851',
    totalFee: 1,
    outTradeNo: '',
    body: 'PAYJS小程序支付测试',
    notifyUrl: null,
    attach: null,
    nonce: null,
    paying: false,
    version: '',
    jump: false,
    resultCode: '',
    msg: '',
    payjsOrderId: ''
  },
  bindPay: function() {
    var extraData = {
      mchId: this.data.mchId,
      totalFee: this.data.totalFee,
      outTradeNo: this.data.outTradeNo,
      body: this.data.body,
      notifyUrl: this.data.notifyUrl,
      attach: this.data.attach,
      nonce: this.data.nonce,
      sign: null // 签名
    }

    console.log(extraData)

    wx.navigateToMiniProgram({
      appId: 'wx959c8c1fb2d877b5',
      path: 'pages/pay',
      extraData: extraData,
      // envVersion: 'trial', //体验版
      success: r => {
        console.log(r)
        console.log('等待返回')
        this.setData({
          paying: true
        })
      },
      fail: function (e) {
        console.error(e)
        wx.showModal({
          title: '支付失败',
          content: e.errMsg
        })
      },
      complete: () => {
        this.setData({
          jump: true
        })
      }
    })
  },
  onLoad: function () {
    
    var info = wx.getSystemInfoSync()
    this.setData({
      version: info.SDKVersion
    })
  },
  onShow: function (options) {
    console.log(options)
    // 从跳转后状态取值
    var timeStamp = new Date().valueOf()
    this.setData({
      outTradeNo: 'TEST-WXA-' + timeStamp + '-' + Math.floor(Math.random() * 9000 + 1000),
      resultCode: app.globalData.resultCode,
      msg: app.globalData.msg,
      payjsOrderId: app.globalData.payjsOrderId,
      nonce: utils.generateRandom(100000, 999999)
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
