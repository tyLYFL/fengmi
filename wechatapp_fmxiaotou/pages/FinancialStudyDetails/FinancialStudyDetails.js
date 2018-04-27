let wxparse = require("../../wxParse/wxParse.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FinanceData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    if (app.globalData.token) {
      wx.request({
        url: app.globalData.API[4] + '/finance/findProjectPraDetails',
        data: {
          projectId: id,
          tokenId: app.globalData.token
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          wxparse.wxParse('projectDesc', 'html', res.data.practice.projectDesc, this, 0);
          wxparse.wxParse('projectRoadShow', 'html', res.data.practice.projectRoadShow, this, 0);
          that.setData({
          FinanceData: res.data.practice
        })
    },
    fail:function(err){
      console.log(err)
    }
      })
  }
     
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})