const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowV:'',
    time:'2017-02-03'
  },
  toauthInvestPeople:function(){
    wx.navigateTo({
      url: '../authInvestPeople/authInvestPeople',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isShowV = options.isShowV;
    var time = util.formatTime3(new Date())
    this.setData({
      isShowV: isShowV,
      time:time
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
  
  }
})