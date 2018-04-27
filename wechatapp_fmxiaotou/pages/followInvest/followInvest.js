var investId;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectRewards:[],
    riskFlag:0,
    isFollow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    investId = options.id;
    var reserveFinishTime = options.reserveFinishTime;
    if (reserveFinishTime=='已结束'){
      that.setData({
        isFollow:true
      })
    }
    getInvestReardInfo(that);
    var token = app.globalData.token || wx.getStorageSync('token');
    getInfomation(token, that)
  },
   /**
   * 弹出风险提示
   */
  showRiskTip:function(){
    this.setData({
      riskFlag:1
    })
  },
  closeRisk: function () {
    this.setData({
      riskFlag: 0
    })
  },
   /**
   * 调到预约份额
   */
  towxpay:function(e){
    console.log(e)
    var that = this;
    var isFminvestor = app.globalData.userInfo.isFmInvestor
    if (isFminvestor==0){
      wx.showModal({
        title: '跟投提示',
        content: '项目仅针对付费学员开放',
        cancelText:'放弃',
        cancelColor:'#333333',
        confirmText:'立即报名',
        confirmColor:'#e6ad14',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.reLaunch({
              url: '/pages/roll/roll',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    } else if (isFminvestor==3){
        
      wx.showModal({
        title: '跟投提示',
        content: '您已预定终身学员，请等待客服联系支付余款，支付余款后即可认购',
        cancelText: '关闭',
        cancelColor: '#333333',
        confirmText: '查看详情',
        confirmColor: '#e6ad14',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.reLaunch({
              url: '/pages/roll/roll',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return  false;

    }

    var equityShareType = e.currentTarget.dataset.equitysharetype;
    var shareTitle = e.currentTarget.dataset.sharetitle;
    var id = e.currentTarget.dataset.id;
    var reserveAmount = e.currentTarget.dataset.reserveamount;
    var reservePeopleNum = e.currentTarget.dataset.reservepeoplenum;
    var copies = e.currentTarget.dataset.copies;
    var yetReservePropleNum = e.currentTarget.dataset.yetreserveproplenum;
   
    var  json  = {
      id:id,
      investId: investId,
      equityShareType: equityShareType,
      shareTitle: shareTitle,
      totalFee:reserveAmount,
      reservePeopleNum: reservePeopleNum,
      copies: copies,
      yetReservePropleNum: yetReservePropleNum
    }
    var jsonStr = JSON.stringify(json);
    wx:wx.navigateTo({
      url: '../wxpay/wxpay?json=' + jsonStr,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
})

function getInvestReardInfo(that){
  wx.request({
    url: app.globalData.API[0] + 'invest/findInvestProjectReardInfo',
    method: "POST",
    dataType: "json",
    data: {
      investId: investId,
      tokenId: app.globalData.token,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log(res.data)
      const statsMsg = res.data.statsMsg.stats;
      if (statsMsg == 1) {
        var projectRewards = res.data.projectRewards;
       
        that.setData({
          projectRewards: projectRewards
        })
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}
//获取用户信息
function getInfomation(token, that) {
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