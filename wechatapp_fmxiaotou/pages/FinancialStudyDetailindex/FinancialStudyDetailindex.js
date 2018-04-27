var app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:'',
    imageHeight: 0,
    FinanceData: [],
    FinanceData1: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    if (app.globalData.token) {
      this.reqFinanData(0);
      this.reqFinanData1(0);
    }
    this.setData(
      {
        currentTab: options.current,
      }
    )
  },
  SwitchNav: function (e) {
    var key = e.target.dataset.key;
    this.setData(
      {
        currentTab: key,
      }
    )
  },

  imageLoad: function (e) {
    var imgheight = e.detail.height;
    this.setData({
      imageHeight: imgheight//图片宽度   
    })
  },

  // 圆形进度条圆周计算
  Overbook: function (count, sum) {
    var that = this;
    var paizhi = (count / sum) * 360;
    if (paizhi > 360) {
      paizhi = 360;
    }
    return paizhi;
  },

  //  进入详情页
  tapList: function (e) {
    var investId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/FinancialStudyGoList/FinancialStudyGoList?id=' + investId,
    })
  },

  tapStruts: function (e) {
    var investId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/FinancialStudyDetails/FinancialStudyDetails?id=' + investId,
    })
  },

  reqFinanData: function (type) {
    var that = this;
    //  请求财商课
    wx.request({
      url: app.globalData.API[4] + '/finance/findFinanceList',
      data: {
        tokenId: app.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.fmFinances.length; i++) {
          var financeStartTime = util.dateCount3(res.data.fmFinances[i].financeStartTime, true)
          var financeEndTime = util.dateCount3(res.data.fmFinances[i].financeEndTime, false)
          var appiontments = that.Overbook(res.data.fmFinances[i].appiontments, res.data.fmFinances[i].financeOverbook);
          res.data.fmFinances[i].financeStartTime = financeStartTime;
          res.data.fmFinances[i].financeEndTime = financeEndTime;
          res.data.fmFinances[i].appiontments = appiontments;
        }
        that.setData({
          FinanceData: res.data.fmFinances
        })
      },
      fail: function (err) {
        console.log('err')
      }
    })

  },

  // 请求实战项目
  reqFinanData1: function (type) {
    var that = this;
    wx.request({
      url: app.globalData.API[4] + '/finance/findProjectPra',
      data: {
        tokenId: app.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          FinanceData1: res.data.practices
        })
      },
      fail: function (err) {
        console.log('err')
      }
    })
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