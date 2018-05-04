const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    sex: ['男', '女'],
    animationData: {},
    animationFlag: true,
    animationData1: {},
    animationFlag1: true,
    tempFilePaths: '',
    personal:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('信息', app.globalData.userInfo)

    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    // 获取微信信息
    var userInfo = app.globalData.userInfo;
    that.setData({
      userInfo: userInfo
    })
    that.setpersonal();
  },


  //  获取个人详情
  setpersonal:function(){
    let that = this;
    wx.request({
      url: app.globalData.API[2] + 'my/personal',
      data: {
        tokenId: app.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        var personal = res.data.information;
        console.log('dsd', personal)
        that.setData({
          personal: personal
        })
      }
      })
  },

  // 关闭预约详情表
  closeProp: function () {
    if (this.data.animationFlag1 == true) {
      this.animationFn()
    }
    if (this.data.animationFlag == true && this.data.animationFlag1 == false) {
      this.animationFn1()
    }
    if (this.data.animationFlag == false && this.data.animationFlag1 == false) {
      this.animationFn()
      this.animationFn1()
    }
  },

  //  上传图片头像
  uploadfile: function () {
    this.animationFn1();
  },
  // 拍照选项
  camera: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        console.log('tupian', res)
        that.closeProp();
      }
    })
  },
  //  相册选择上传
  picture: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        that.closeProp();
      }
    })
  },


  // 性别修改
  bindsexChange: function (e) {
    this.animationFn();
  },
  //  年龄修改
  bindAgeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    wx.request({
      url: app.globalData.API[2] + 'my/personalUpdate',
      data: {
        tokenId: app.globalData.token,
        birthYears: e.detail.value
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
      }
    })
    // var d = new Date()
    // let newyear = d.getFullYear()
    // let oldyear = e.detail.value.substring(0, 4);
    // let age = newyear - oldyear
  },

  // 昵称修改
  namerdiao: function () {
    wx.navigateTo({
      url: '/pages/SettingName/SettingName'
    })
  },

  // 性别选择按钮
  sexradio: function (e) {
    var key = e.target.dataset.key;
    console.log('性别', key)
    wx.request({
      url: app.globalData.API[2] + 'my/personalUpdate',
      method: 'post',
      data: {
        tokenId: app.globalData.token,
        sex: key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        console.log(res)
      }
    })
    this.closeProp();
  },

  // 性别弹出页取消按钮
  sexfalse: function () {
    this.closeProp();
  },

  animationFn: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation;
    if (this.data.animationFlag) {

      animation.bottom(0 + 'rpx').step()
      this.setData({
        animationFlag: false,
      })
    } else {
      animation.bottom(-654 + 'rpx').step()
      setTimeout(() => {
        this.setData({
          animationFlag: true,
        })
      }, 180)
    }
    this.setData({
      animationData: animation.export()
    })
  },

  animationFn1: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation;
    if (this.data.animationFlag1) {

      animation.bottom(0 + 'rpx').step()
      this.setData({
        animationFlag1: false,
      })
    } else {
      animation.bottom(-654 + 'rpx').step()
      setTimeout(() => {
        this.setData({
          animationFlag1: true,
        })
      }, 180)
    }
    this.setData({
      animationData1: animation.export()
    })
  },

  mobile: function () {
    wx.navigateTo({
      url: '/pages/security/security'
    })
  },
  changepassword: function () {
    wx.navigateTo({
      url: '/pages/ChangePassword/ChangePassword'
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
    this.setpersonal();
    console.log("token2", app.globalData.token)
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
