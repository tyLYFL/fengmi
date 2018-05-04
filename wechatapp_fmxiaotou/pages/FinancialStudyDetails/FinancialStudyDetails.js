let wxparse = require("../../wxParse/wxParse.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FinanceData: [],
    Id: 0,
    state:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    this.setData(
      {
        Id: id
      }
    )
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    if (app.globalData.token) {
      wx.request({
        url: app.globalData.API[0] + 'finance/findProjectPraDetails',
        data: {
          projectId: this.data.Id,
          tokenId: app.globalData.token
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          wxparse.wxParse('projectDesc', 'html', res.data.practice.projectDesc, this, 0);
          wxparse.wxParse('projectRoadShow', 'html', res.data.practice.projectRoadShow, this, 0);
          that.setData({
          FinanceData: res.data.practice,
           state: res.data.practice.isCollect
        })
    },
    fail:function(err){
      console.log(err)
    }
      })
  }
    
    
  },

  getInfomation: function (that) {

    wx.request({
      url: app.globalData.API[0] + 'my/information',
      method: "POST",
      dataType: "json",
      data: {
        tokenId: app.globalData.token
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var userinfo = res.data.information;
        app.globalData.userInfo = userinfo;//存用户的信息
        // that.setData({
        //   userInfo: userinfo
        // })
      },
      fail: function () {
      }
    })
  },

  // 收藏
  ifliketap: function () {
  
    var that = this;
    console.log('1', that.data.state);
    if (that.data.state == 0) {
      that.data.state = 1;
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration: 2000
      });
      this.setData(
        {
          state: 1,
        })
      that.projectCollter(that.data.state)
    }
    else {
    
      that.data.state = 0
      console.log('2', that.data.state);
      this.setData(
        {
          state: 0,
        })
      wx.showToast({
        title: '取消关注',
        icon: 'none',
        duration: 2000
      });
      that.projectCollter(that.data.state)
    }
  },

  // 实战（课程、项目）收藏  
  projectCollter: function (state) {
    wx.request({
      url: app.globalData.API[0] + "finance/projectCollter",
      data: {
        projectId: this.data.Id,
        tokenId: app.globalData.token,
        type: 2,         //1财商课，2实战项目
        state: state,   //0取消收藏，1添加收藏
      },
      success: res => {
        console.log('成功');
      },
      fail: err => {
        console.log(err)
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