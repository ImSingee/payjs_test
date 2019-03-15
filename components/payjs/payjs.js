// componenets/payjs/payjs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: { // 支付订单参数
      type: Object,
      value: null
    },
    envVersion: {
      type: String,
      value: "release"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPayModal: false,
    paying: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setPaying(newPayingData) {
      this.setData({
        paying: newPayingData
      })
      this.triggerEvent('dataChange', { paying: newPayingData })
    },
    onTapCancel () {
      // 用户点击了支付组件外的地方（灰色地方）
      console.log('[PAYJS] 跳转到 PAYJS 小程序失败 - 用户点击了提醒窗体以外的地方')
      this.triggerEvent('fail', { navigateSuccess: false })
      this.triggerEvent('complete')
    },
    navigateSuccess () {
      console.log('[PAYJS] 跳转到 PAYJS 小程序成功')
      // 成功跳转：标记支付中状态
      this.setPaying(true)
    },
    navigateFail (e) {
      // 跳转失败
      console.log('[PAYJS] 跳转到 PAYJS 小程序失败 - 失败回调', e)
      this.triggerEvent('fail', { navigateSuccess: false, info: e })
      this.triggerEvent('complete')
    }
  },

  /** 
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.setPaying(false)
      if (!this.data.params) {
        console.error('[PAYJS] 跳转到 PAYJS 小程序失败 - 错误：没有传递跳转参数', r)
        this.triggerEvent('fail', { error: true, navigateSuccess: false })
        this.triggerEvent('complete')
      }

      // 监听 app.onShow 事件
      wx.onAppShow(appOptions => {
        if (!this.data.paying) return;

        // 恢复支付前状态
        this.setPaying(false)
        
        if (appOptions.scene === 1038 && appOptions.referrerInfo.appId === 'wx959c8c1fb2d877b5') {
          // 来源于 PAYJS 小程序返回
          console.log('[PAYJS] 确认来源于 PAYJS 回调返回')
          let extraData = appOptions.referrerInfo.extraData
          if (extraData.success) {
            this.triggerEvent('success', extraData)
            this.triggerEvent('complete')
          } else {
            this.triggerEvent('fail', { navigateSuccess: true, info: extraData })
            this.triggerEvent('complete')
          }
        }
      })

      // 尝试直接跳转到 PAYJS 发起小程序支付
      wx.navigateToMiniProgram({
        appId: 'wx959c8c1fb2d877b5',
        path: 'pages/pay',
        extraData: this.data.params,
        envVersion: this.data.envVersion,
        success: r => {
          console.log('[PAYJS] 跳转到 PAYJS 小程序成功', r)
          // 成功跳转：标记支付中状态
          this.setPaying(true)
        },
        fail: e => {
          // 跳转失败：弹出提示组件引导用户跳转
          console.log('[PAYJS] 跳转到 PAYJS 小程序失败 - 准备弹窗提醒跳转', e)
          this.setData({
            showPayModal: true
          })
        }
      })
    }
  }
})
