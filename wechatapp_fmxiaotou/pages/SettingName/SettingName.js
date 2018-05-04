var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Name:'',
    clearstate:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getName:function(e){

     var val = e.detail.value;
     this.setData({
       Name: val,
       clearstate: 1
     })
  },
  clearval:function(){
    this.setData({
      Name:'',
    })
  },
  
  hideclear:function(){

    this.setData({
      clearstate: 0
    })
  },
  addUInvestPreference:function(){
    let that = this;
    console.log('111', that.data.Name)
    wx.request({
      url: app.globalData.API[4] + 'user/nicknameHeavy',
      method: 'post',
      data: {
        nickName: that.data.Name
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {

          wx.request({
            url: app.globalData.API[4] + 'my/personalUpdate',
            method: 'post',
            data: {
              tokenId: app.globalData.token,
              nickname: that.data.Name
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            success: function (res) {
              wx.showToast({
                title: res.data.statsMsg.msg,
                icon: 'none',
                duration: 1000
              });
              setTimeout(
                function () {
                  wx.redirectTo({
                         url: '../Setting/Setting',
                       })
                }, 2000
              )
            }
 
          })
        
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