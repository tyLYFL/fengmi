var app=getApp()
var util = require("../../utils/util.js");
var promisify = util.promisify;
let from = '';
let investId = 25;
Page({
  data: {
     clickFlag:true,
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad:function (options) {
      from = options.from;
      investId = options.investId
      //判断之前是否已经授权
      if (app.globalData.userInfo) {//已授权
        this.setData({
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              hasUserInfo: true
            })
          }
        })
      }
    },
    //使用微信登录
    getUserInfo: function (e) {
      var that = this;
       
      var clickFlag = this.data.clickFlag;

      that.setData({
        clickFlag: false
      })

      if (!clickFlag){
          return false;
      }

      setTimeout(function(){

        that.setData({
          clickFlag:true
        })

      },1500)

      wx.showLoading({
        title: '正在登陆中...',
      })

      app.globalData.userInfo = e.detail.userInfo

      let encryptedData = e.detail.encryptedData;

      let iv = e.detail.iv;

      const wxlogin = promisify(wx.login);
      const wxcheckSession = promisify(wx.checkSession);
      
      var sessionKey = wx.getStorageSync('sessionKey');

        wxcheckSession().then(res=>{
       
          app.wxLoginV2(encryptedData, iv, sessionKey, from, investId)

        }).catch(res=>{

        wxlogin().then(function (res) {
       
          let code = res.code
          app.wxLogin(encryptedData, iv, from, investId,  code)

        }).catch(function () {
          console.error("获取code失败");
        })

      })
      this.setData({
        hasUserInfo: true
      })
    },
    //获取疯蜜小投账号
    getappUser:function (e) {
        this.setData({
            appUser:e.detail.value
        })
        if((this.data.appPassword.length>=6 && this.data.appPassword.length<=16) && (this.data.appUser.length==11) ){
            this.setData({
                isyellow:'yellow'
            })
        }else {
            this.setData({
                isyellow:''
            })
        }
    },
    //获取疯蜜小投密码
    getappPassword:function (e) {
        this.setData({
            appPassword:e.detail.value
        })
        if((this.data.appPassword.length>=6 && this.data.appPassword.length<=16) && (this.data.appUser.length==11) ){
            this.setData({
                isyellow:'yellow'
            })
        }else {
            this.setData({
                isyellow:''
            })
        }
    },
    //使用APP账号登录
    loginByapp:function () {
        var that = this;
        var appUser = trim(this.data.appUser);
        var appPassword = trim(this.data.appPassword);
        if(!appUser){
            wx.showToast({
                title: '请正确的输入账号',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if(!appPassword){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration: 2000
            })
            return
        }

        if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(appUser))){
            wx.showToast({
                title: '手机号码格式错误',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        wx.request({
            url: app.globalData.API[0]+ 'user/login',
            method: "POST",
            dataType: "json",
            data: {
                account:appUser,
                passWord:appPassword
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success:function (res) {
                console.log(res);
                if(res.data.token){
                    app.globalData.token=res.data.token;//登录成功的标识是返回token
                    app.globalData.openId = res.data.openId;
                    wx.setStorageSync('token', res.data.token);
                    wx.setStorageSync('openId', res.data.openId);
                    wx.setStorageSync('loginWay','phone');
                    
                    getInfomation(res.data.token, that);

                    if (from == 'wechatDetail') {
                      wx.redirectTo({
                        url: '/pages/detail/detail?id=' + investId,
                      })
                    } else {
                      wx.reLaunch({
                        url: '/pages/index/index'
                      })
                    }
                    return;

                }
                if(res.data.statsMsg.msg=='账号或密码不正确'){
                    wx.showToast({
                        title: '密码错误',
                        icon: 'none',
                        duration: 2000
                    })
                }
                if(res.data.statsMsg.msg=='账号未注册'){
                    wx.showToast({
                        title: res.data.statsMsg.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail:function () {
                console.log('手机登录接口出错');
            }
        })
    },
})
//    处理用户拒绝授权

function trim(str) {
  return str.replace(/s/g,"");
}

function getInfomation(token,that) {
  console.log(app.globalData.token)
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
      console.log('获取用户的个人信息', res);
      var userinfo = res.data.information;
      app.globalData.userInfo = userinfo;//存用户的信息
    },
    fail: function () {
      console.log(app.globalData.token)
    }
  })
}