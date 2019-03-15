const utils = require('../../utils/util.js')

Page({
  data: {
    orderParams: {}, // 支付发起参数
    orderResults: {}, // 支付结果
    preparePay: false, // 用户点击了支付按钮（订单信息交由 payjs 组件）
    paying: false, // 标记用户是否已经点击了「支付」并成功跳转到 PAYJS 小程序，该参数由 payjs 组件维护，用户可监听以在 onShow 生命周期函数中判断
    needRefreshOrderParams: false // 需要刷新订单信息，在此示例中，为了测试方便，允许支付一个订单号再进行一次新的支付行为；在生产环境下判断支付成功后直接跳转到订单页面即可
  },
  onTapPay: function() {
    // 事件处理函数 - 点击支付按钮
    this.setData({ preparePay: true })
  },
  onTapRefresh: function() {
    let orderParams = utils.getOrderParams()
    this.setData({
      orderParams,
      needRefreshOrderParams: false
    })
  },
  onLoad: function () {
  },
  onShow: function () {
    // 若处于支付中状态则交由 payjs 支付组件处理
    if (this.data.paying) return;
    
    // 尚未支付
    // 获取、设置支付参数
    let orderParams = utils.getOrderParams()
    this.setData({ orderParams })
  },

  /**
   * 支付成功的事件处理函数
   * 
   * res.detail 为 payjs 小程序返回的订单信息
   * 
   * 可通过 res.detail.payjsOrderId 拿到 payjs 订单号
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
      preparePay: false, // 销毁 PAYJS 组件
    })
  },
  /**
   * 组件内部数据被修改时的事件
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
})
