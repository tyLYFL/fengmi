App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              var token = wx.getStorageSync('token');
              this.globalData.token = token;
              getInfomation(that, token);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  wxLogin: function (encryptedData, iv, from, investId,code) {
    let that = this;
   
    if (!code) {
      return false;
    }
    wx.request({
      url: that.globalData.API[0] + 'user/xiaoChengXunAuthorization',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { code: code },
      success: function (res) {
        
        console.log(res)
        let sessionKey = res.data.wxSessionkey;

        wx.setStorageSync('sessionKey', sessionKey)
     
        that.wxLoginV2(encryptedData, iv, sessionKey, from, investId)
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  wxLoginV2: function (encryptedData, iv, sessionKey, from, investId) {
    let that = this;
    if (!encryptedData){
        return false;
    }
   
    wx.request({
      url: that.globalData.API[0] + 'user/xiaoChengXunAuthorizationV2',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { encryptedData: encryptedData, iv: iv, sessionKey:sessionKey },
      success: function (res) {
        //4.解密成功后 获取自己服务器返回的结果
        console.log(res)
        var stats = res.data.statsMsg.stats
        var msg = res.data.statsMsg.msg
        console.log(stats)
        if (stats == 1) {
          console.log("openId:"+ res.data.openId)
          that.globalData.token = res.data.token;
          wx.setStorageSync('token', res.data.token);

          that.globalData.openId = res.data.openId;
          wx.setStorageSync('openId', res.data.openId);
          
          that.globalData.userInfo.isFmInvestor = res.data.isFmInvestor;
          that.globalData.userInfo.endTime = res.data.endTime;
          wx.hideLoading();
          if (from =='wechatDetail'){
            wx.redirectTo({
              url: '/pages/detail/detail?id=' + investId,
            })
          }else{
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        } else if (stats == '-2'){
          console.log(stats)
          wx.login({
            success: res => {
              var code = res.code
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  console.log(res)
                  that.globalData.userInfo = res.userInfo

                  let encryptedData = res.encryptedData;

                  let iv = res.iv;
                  that.wxLogin(encryptedData, iv, from, investId, code)
                }
              })
            }
          })
          
        }else{
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }

      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  globalData: {
    userInfo: null,
    isFmInvestor:'',
    token:'',
    openId:'',
    API: ['https://fmb.fmsecret.cn/investment-app-api/', 'https://fmb.fmsecret.cn/','http://kzf.tunnel.qydev.com/investment-app-api/',
      'https://fmb.fmsecret.cn/investment-app-api/', 'https://t.fmsecret.cn/investment-app-api/'],
    dataForTabbar: [
      {
        iCount: 0, //未读数目
        sIconUrl: Img("tabbar_invest_icon_s@2x"), //按钮图标
        sTitle: "跟投", //按钮名称
        currentTab:0,
      },
      {
        iCount: 0, //未读数目
        sIconUrl: Img("tabbar_news_icon_n@2x"), //按钮图标
        sTitle: "消息", //按钮名称
        currentTab: 1,
      },
      {
        iCount: 0, //未读数目
        sIconUrl: Img("tabbar_mine_icon_n@2x"), //按钮图标
        sTitle: "我的", //按钮名称
        currentTab: 2,
      },
    ]
  }
})
// 生成img文件的目录
function Img(filename, state) {
  //定义img文件所在的文件夹
  const IMG_FILES_FOLDER = "../../images/tabBar/";
  //定义img文件的后缀
  const SUBFIX = ".png";
  //数组转换字符串
  if (state === undefined) {

    return [
      IMG_FILES_FOLDER,
      filename,
      SUBFIX
    ].join("");

  }
  //数组转换字符串并用-做分割
  else {
    return [
      IMG_FILES_FOLDER,
      filename,
      "-",
      state,
      SUBFIX
    ].join("");
  }
}

function getInfomation(that, token) {
  wx.request({
    url: that.globalData.API[0] + 'my/information',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: token
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      var userinfo = res.data.information;
      that.globalData.userInfo = userinfo;//存用户的信息
    },
    fail: function () {
    }
  })
}