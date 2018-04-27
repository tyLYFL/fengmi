var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName:'',
    identityCard:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     getUserCredited(that);//获取用户实名认证信息
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
  
  }
})

//  获取用户实名认证信息
function getUserCredited(that) {
  wx.request({
    url: app.globalData.API[0] + 'my/findUserCreditPropertyRecord',
    data: {
      tokenId: app.globalData.token
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log('获取用户实名认证信息', res);
      var stats = res.data.statsMsg.stats;
      if (stats==1){
        var record = res.data.record;
        var realName = record.realName;
        var identityCard  = record.identityCard;
         
        var identityCardC = /^(.{2})(.*)(.{2})$/.exec(identityCard);
        identityCardC[2]= '************'
        identityCardC[0]= ''

        var len = realName.length - 1;
        var realNameC = '*' + realName.substr(-len);
       
        var  carid =  identityCardC.join("");

        that.setData({
          realName: realNameC,
          identityCard: carid
        })
      }
    },
    fail: function (res) {
      console.log(res)
    }
  })
}