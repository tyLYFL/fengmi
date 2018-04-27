//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
var page;
Page({
  data: {
    projects: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tomyCenter: function () {
    wx.navigateTo({
      url: '../myCenter/myCenter'
    })
  },
  todetail: function () {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  animationFn: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation;
    if (this.data.animationFlag) {
      animation.top(78 + 'rpx').step()
      this.setData({
        animationFlag: false
      })
    } else {
      animation.top(-120 + 'rpx').step()
      this.setData({
        animationFlag: true
      })
    }
    this.setData({
      animationData: animation.export()
    })
  },
  showChooseType: function () {
    this.animationFn();
  },
  hidechooseType: function (e) {//隐藏选择种类
    console.log(e);
    var type = e.currentTarget.dataset.type;
    this.animationFn();
    switch (type) {
      case '0':
        this.setData({
          status: '全部'
        })
        break;
      case '1':
        this.setData({
          status: '进行中'
        })
        break;
      case '2':
        this.setData({
          status: '已结束'
        })
        break;
    }
    reqIndexData(type)
  },
  onLoad: function () {
    page = this;
    reqIndexData(0);
    this.setData({
      dataForTabbar: app.globalData.dataForTabbar,//设置tabber数据
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  todetail: e => {
    var investId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + investId
    })
  },
  tomyCenter: function () {
    wx.navigateTo({
      url: '../myCenter/myCenter'
    })
  },
  test: function () {
    wx.navigateTo({
      url: '../test/test',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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

//请求 我的收藏的 数据
function reqIndexData(type) {
  wx.request({
    url: app.globalData.API[0] + 'invest/getInvestProjectCollect',
    data: {
      tokenId:app.globalData.token,
      queryType:1
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      const statsMsg = res.data.statsMsg.stats;
      if (statsMsg == 1) {
        var projects = res.data.investProject;
        if (projects != null) {
          for (var i = 0; i < projects.length; i++) {
            var Time = util.formatTime2(new Date(projects[i].createTime));
            var reserveFinishDeadline = util.dateCount(projects[i].reserveFinishTime)
            var holdRatios = projects[i].holdRatios * 100;

            holdRatios = holdRatios.toFixed(2);
            
            projects[i].createTime = Time;
            projects[i].reserveFinishDeadline = reserveFinishDeadline;
            projects[i].holdRatios = holdRatios;
          }
        }
        page.setData({
          projects: projects
        })
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}