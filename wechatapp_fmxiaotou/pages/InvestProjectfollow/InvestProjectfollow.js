//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
var page;
Page({
  data: {
    selected: true,
    selected1: false,
    projects: [],
    animationData: {},
    animationFlag: true,
    status: "全部",
    queryType:1
  },
  //我的预约
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
    var status = this.data.status;
    switch (status) {
      case '全部':
        reqFollowData(1, 0)
        break;
      case '进行中':
        reqFollowData(1, 1)
        break;
      case '已结束':
        reqFollowData(1, 2)
        break;
    }

  },
  //跟投成功
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })

    var status = this.data.status;
    switch (status) {
      case '全部':
        reqFollowData(2, 0)
        break;
      case '进行中':
        reqFollowData(2, 1)
        break;
      case '已结束':
        reqFollowData(2, 2)
        break;
    }
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
    reqFollowData(this.data.queryType, type);
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
  onLoad: function (options) {
    console.log(options)
    console.log(options.queryType)
    page = this;
    this.setData({
      queryType:options.queryType
    })
    reqFollowData(options.queryType, 0)
  }
})
//请求 我的跟投 数据
function reqFollowData(queryType,type) {
  wx.request({
    url: app.globalData.API[0] + 'invest/getInvestProjectFollow',
    data: {
      tokenId: app.globalData.token,
      queryType:queryType,
      investProjectState: type //	1进行中，2已结束 0全部
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
            var Time = util.formatTime2(new Date(projects[i].investProject.createTime));
            var reserveFinishDeadline = util.dateCount(projects[i].investProject.reserveFinishTime)
            var holdRatios = projects[i].investProject.holdRatios * 100;

            holdRatios = holdRatios.toFixed(2);

            projects[i].investProject.createTime = Time;
            projects[i].investProject.reserveFinishDeadline = reserveFinishDeadline;
            projects[i].investProject.holdRatios = holdRatios;
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