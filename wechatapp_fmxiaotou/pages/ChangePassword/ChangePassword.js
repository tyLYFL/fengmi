var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disfalse1: true,
    Icon1: '../../images/invisible_icon.png',
    disfalse2: true,
    Icon2: '../../images/invisible_icon.png',
  },
  judgeContact: function (oldpassword){
    if (oldpassword == '') {
      wx.showToast({
        title: '原密码不能为空',
        icon: 'none'
      })
      return false;
    }
    if (!(/^(\w){6,16}$/.test(oldpassword))) {
      wx.showToast({
        title: '只能输入6-16个字母、数字、下划线',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  },
  judgeContact1: function (newpassword) {
    if (newpassword == '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none'
      })
      return false;
    }
    if (!(/^(\w){6,16}$/.test(newpassword))) {
      wx.showToast({
        title: '只能输入6-16个字母、数字、下划线',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  },
  formSubmit:function(e){
    var that = this;
    var oldpassword = e.detail.value.oldpassword;
    var newpassword = e.detail.value.newpassword;
    console.log('old', oldpassword)
    console.log('new', newpassword)
    if (that.judgeContact(oldpassword) == true && that.judgeContact1(newpassword) == true){
      wx.request({
        url: app.globalData.API[4] + 'my/modifyPassword',
        method: 'post',
        data: {
          tokenId: app.globalData.token,
          oldPassword: oldpassword,
          newPassword: newpassword
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        success: function (res) {
          console.log('密码',res)
        }
      })
    }
  },
  // 是否显示旧密码
  changeIco1: function () {
    let that = this;
    if (that.data.disfalse1 == false) {
      that.setData({
        Icon1: '../../images/invisible_icon.png',
        disfalse1: true,
      })
    }
    else {
      {
        that.setData({
          Icon1: '../../images/invisible_icon2.png',
          disfalse1: false,
        })
      }
    }
  },
  // 是否显示新密码
  changeIco2: function () {
    let that = this;
    if (that.data.disfalse2 == false) {
      that.setData({
        Icon2: '../../images/invisible_icon.png',
        disfalse2: true,
      })
    }
    else {
      {
        that.setData({
          Icon2: '../../images/invisible_icon2.png',
          disfalse2: false,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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