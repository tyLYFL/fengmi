var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authenticationInfo:{},
    isUploadTo:0,
    userLabelLVFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    authentication(that);
    if (app.globalData.userInfo.userLabelLV == 0 || app.globalData.userInfo.userLabelLV==null)    {
      this.setData({
        userLabelLVFlag: false
      }) 
    }
    if (options.isUploadTo==1){
      this.setData({
        isUploadTo: 1
      })
    }
  },
  lookAuthentication:function(e){
    wx.redirectTo({
        url: '../lookAuthentication/lookAuthentication?isdisable=0',//可编辑
      })
  },
  lookAuthentication2: function (e) {
    wx.redirectTo({
      url: '../lookAuthentication/lookAuthentication?',
    })
  },
  toInvestHobby:function(){
    wx.redirectTo({
      url: '../investHobby/investHobby',
    })
  },
  //取消更新
  closeUpdateAuthen:function(e){
      var assetsId = e.currentTarget.dataset.assetsid
      wx.request({
        url: app.globalData.API[0] + 'my/authenticationDeleteV2',
        method: "POST",
        dataType: "json",
        data: {
          assetsId: assetsId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          console.log(res.data)
          const statsMsg = res.data.statsMsg.stats;
          if (statsMsg == 1) {

            wx.redirectTo({
              url: '../authInvestPeopleEnd/authInvestPeopleEnd',
            })

          }
        },
        fail: function (er) {
          console.log(er);
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  }
})
function authentication(that) {
  wx.request({
    url: app.globalData.API[0] + 'invest/authenticationV2',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: app.globalData.token
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log(res.data)
      const statsMsg = res.data.statsMsg.stats;
      if (statsMsg == 1) {
        var assets = res.data.assets;
        var createtime = util.formatTime3(new Date(assets.createtime));
        var audittime = util.formatTime3(new Date(assets.audittime));
        assets.createtime = createtime;
        assets.audittime = audittime;
        that.setData({
          authenticationInfo: assets
        })
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}