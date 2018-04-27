const app = getApp();
const util = require('../../utils/util.js');
var page;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    projects:[],
    animationData: {},
    animationFlag:true,
    status:"全部"
  },
  //事件处理函数
  showFn:function () {
    wx.navigateTo({
      url: '../news/news'
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  torule:function(){
    wx.navigateTo({
      url: '../rule/rule'
    })
  },
  animationFn:function(){
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
  showChooseType:function(){
    this.animationFn();
  },
  hidechooseType:function(e){//隐藏选择种类
    var type = e.currentTarget.dataset.type;
    this.animationFn();
    switch(type){
      case '0':
      this.setData({
        status:'全部'
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
  //逻辑代码(底部nav)
  // onTabItemTap: ev => {
  //   let key = ev.currentTarget.dataset.key;
  //   util.settabImg({ key });
  //   if (key == 0) {
  //     wx.redirectTo({
  //       url: '../index/index',
  //     })
  //   } else if (key == 1) {
  //     if (!app.globalData.token) {
  //       wx.redirectTo({//如果没有登陆过则重定向到登录页面
  //         url: '/pages/login/login?key=1'
  //       })
  //       return false;
  //     } 
  //     wx.redirectTo({
  //       url: '../news/news',
  //     })
  //   } else if (key == 2) {
  //     if (!app.globalData.token) {
  //       wx.redirectTo({//如果没有登陆过则重定向到登录页面
  //         url: '/pages/login/login?key=2'
  //       })
  //       return false;
  //     } 
  //     wx.redirectTo({
  //       url: '../myCenter/myCenter',
  //     })
  //   }
  // },
  onLoad: function () {
    page = this;
    reqIndexData(0);
    // this.setData({
    //   dataForTabbar: app.globalData.dataForTabbar,//设置tabber数据
    // })
    getNews(page);
  },
  onShow:function(){
    getNews(page);
  }
})

//请求 首页数据
function reqIndexData(type){
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.globalData.API[0]+'invest/investList', 
    data: {
      isFirst: 0,//是否显示到首页：0否，1是
      investProjectState: type //	0全部 1进行中 2已经结束
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      const statsMsg = res.data.statsMsg.stats;
      if (statsMsg==1){
        var projects = res.data.projects;
        if (projects!=null){
          for (var i = 0; i < projects.length; i++) {
            var Time = util.formatTime2(new Date(projects[i].createTime));
            var reserveFinishDeadline = util.dateCount(projects[i].reserveFinishTime)
            var holdRatios = projects[i].holdRatios*100;
            
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
    wx.hideLoading();
    },
    fail:function(er){
      console.log(er);
    }
  })
}


//  获取未读消息数
function getNews(that) {
  if (!app.globalData.token){
    
    that.setData({
      msgCount: 0
    })

  }else{

    wx.request({
      url: app.globalData.API[0] + '/message/messageCount',
      data: {
        tokenId: app.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var  msgCount = res.data.msgCount;
        that.setData({
          msgCount: msgCount
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
}