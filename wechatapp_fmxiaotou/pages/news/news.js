const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    newsList: []
  },
  onLoad: function () {
    console.log(app.globalData.token)
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    this.setData({
      dataForTabbar: app.globalData.dataForTabbar,//设置tabber数据
    })
    var token = app.globalData.token;
    this.getNews(token)
  },
  //   获取消息列表
  getNews: function (token) {
    var that = this;
    wx.request({
      url: app.globalData.API[0] + '/message/messageList',
      data: {
        tokenId: token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)

        var newsList = res.data.notifies;
        for (var i = 0; i < newsList.length; i++) {
          newsList[i].createTime = that.getLocalTime(newsList[i].createTime);
        }
        console.log('改变后的news列表', newsList);
        that.setData({
          newsList: newsList
        })

          if(newsList.length<1){
          that.setData({
              nonews:'nonews'
          })
          }else {
              that.setData({
                  nonews:''
              })
          }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //跳转到学籍
  toroll:function(e){
    var skipType = e.currentTarget.dataset.skiptype

    if (skipType == 4) {
      wx.reLaunch({
        url: '/pages/roll/roll',
      })
    }
    
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
    this.readerMsg();
  },
  //告诉后台消息已读
  readerMsg:function(){
      var that = this;
      var newsList = that.data.newsList;
      for (var i = 0; i < newsList.length;i++){
        if (newsList[i].readFlag==0){
          var messageId = newsList[i].messageId;
          var type = newsList[i].type;
            //请求后端
            that.readerNews(type, messageId);
        }
      }
  },
  readerNews: function (type, messageId){
    var that = this;
    wx.request({
      url: app.globalData.API[0] + '/message/updateMessageReadFlag',
      method: "POST",
      dataType: "json",
      data: {
        type: type,//消息类型
        msgId: messageId//本消息来源id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res)
        var stats = res.data.statsMsg.stats;
        if(stats){
         console.log("消息已读");
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  //格式化时间
  getLocalTime: function (nS) {
    var nowYear = new Date().getFullYear();
    var getYear = new Date(nS).getFullYear()
    var nowTime = new Date().toLocaleDateString();
    console.log(nowTime)
    var getTime = new Date(parseInt(("/Date(" + nS + ")/").substr(6, 13))).toLocaleDateString();
    if (nowYear == getYear) {
      if (nowTime == getTime) {
        //当天
        var thisday = new Date(nS).toLocaleTimeString();
        
        return (new Date(nS).toLocaleTimeString()).substring(0, (new Date(nS).toLocaleTimeString()).length - 3);
      } else {
        //跨天
        var month = new Date(nS).getMonth();
        month += 1;
        var day = new Date(nS).getDate();
        return month + '月' + day + '日';
      }
    }
    else {
      //跨年
      console.log(new Date(nS).toLocaleTimeString())
      return getTime;
    }
  },
  //逻辑代码(底部nav)
  onTabItemTap: ev => {
    let key = ev.currentTarget.dataset.key;
    util.settabImg({ key });
    if (key == 0) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else if (key == 1) {
      wx.redirectTo({
        url: '../news/news',
      })
    } else if (key == 2) {
      wx.redirectTo({
        url: '../myCenter/myCenter',
      })
    }
  }
})