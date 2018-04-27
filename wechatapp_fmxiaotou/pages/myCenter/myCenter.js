const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    istouziren: true,
    logouting: false,
    logoutTime: 3,
    sex: '',
    rollStatus:'',
    userIconSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    this.getInfomation();
    // setTimeout(function () {
    //   that.setData({
    //     dataForTabbar: app.globalData.dataForTabbar,//设置tabber数据
    //   })
    // }, 500)
  },
  //进入实名认证
  torealName: function () {
    if (app.globalData.userInfo.isTruenameAuthen) {
      wx.navigateTo({
        url: '../Certified/Certified?isShowV=0',
      })
    } else {
      wx.navigateTo({
        url: '../realname/realname?',
      })
    }
  },
  //进入认证投资人
  toauthInvestPeople: function () {
    if (!app.globalData.userInfo.isTruenameAuthen) {
      wx.showModal({
        content: '请完成实名认证后再进行投资人认证',
        confirmText: '去认证',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../realname/realname?',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    if (!app.globalData.userInfo.auditstate) {
      wx.navigateTo({
        url: '../authInvestPeople/authInvestPeople?',
      })
    } else {
      wx.navigateTo({
        url: '../authInvestPeopleEnd/authInvestPeopleEnd?',
      })
    }
  },

  //进入投资偏好
  toInvestHobby: function () {
    wx.navigateTo({
      url: '../investHobby/investHobby?',
    })
  },
  //进入想跟投的项目
  wantFollow: function () {
    wx.navigateTo({
      url: '../InvestProjectfollow/InvestProjectfollow?queryType=1',
    })
  },
  //进入跟投成功的项目
  wantSuccess: function () {
    wx.navigateTo({
      url: '../InvestProjectfollow/InvestProjectfollow?queryType=2',
    })
  },
  //进入收藏项目
  goShoucang: function () {
    wx.navigateTo({
      url: '../InvestProjectCollect/InvestProjectCollect',
    })
  },
  getInfomation: function () {
    var that = this;
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
        console.log('想跟投的项目', userinfo.investprojectcount)
        console.log("token", app.globalData.token)
        that.setData({
          userInfo: userinfo
        })

        if (userinfo.isFmInvestor == 1 || userinfo.isFmInvestor == 3) {// 是否疯蜜学员：0否，1疯蜜终生学员，2疯蜜年度学员,3已交定金学员
          that.setData({
            istouziren: true,
            shatouzi: 'http://7xoor9.com1.z0.glb.clouddn.com/zhongsheng.png',
            userIconSrc: 'http://7xoor9.com1.z0.glb.clouddn.com/zhongshengIcon.png',
            rollStatus:'终身学员'
          })
        } else if (userinfo.isFmInvestor == 2) {
          that.setData({
            istouziren: true,
            shatouzi: 'http://7xoor9.com1.z0.glb.clouddn.com/naindu.png',
            userIconSrc: 'http://7xoor9.com1.z0.glb.clouddn.com/touxiangIcon.png',
            rollStatus:'年度学员'
          })
        }
        // else if (userinfo.isFmInvestor == 3) {
        //   that.setData({
        //     istouziren: true,
        //     shatouzi: '疯蜜终生学员'
        //   })
        // } 
        else {
          that.setData({
            istouziren: false,
            rollStatus:'立即开通'
          })
        }
        if (userinfo.sex == 1) {//0为女 1为男
          that.setData({
            sex: '../../images/sexMan.png'
          })

        } else if (userinfo.sex == 0) {
          that.setData({
            sex: '../../images/sexWomen.png'
          })
        } else {
          that.setData({
            sex: ''
          })
        }
        //实名认证
        if (userinfo.isTruenameAuthen) {
          that.setData({
            trueName: '已认证'
          })
        } else {
          that.setData({
            trueName: '去认证'
          })
        }
        //认证投资人
        switch (userinfo.auditstate) {
          case 0:
            that.setData({
              investauthen: '去认证'
            })
            break;
          case null:
            that.setData({
              investauthen: '去认证'
            })
            break;
          case 1:
            that.setData({
              investauthen: '审核中'
            })

            break;
          case 2:
            that.setData({
              investauthen: '已认证'
            })
            break;
          case 3:
            that.setData({
              investauthen: '审核不通过'
            })
            break;
        }
      },
      fail: function () {
        console.log(app.globalData.token)
        console.log("向后台调用“我的”接口失败")
      }
    })
  },
  //  点击退出登录
  register: function () {
    var that = this;
    that.setData({
      logouting: true
    })

    var logoutTime = that.data.logoutTime;
    countDown(that, logoutTime)
    wx.removeStorageSync('token')
  },

  rollName: function () {
    var that = this;
    wx.navigateTo({
      url: '../roll/roll?',
    })
  },

  //  点击想跟投的项目
  login: function () {
    wx.redirectTo({
      url: '../login/login'
    })
  },
  //  点击去到消息页面
  goNews: function () {
    wx.navigateTo({
      url: '../news/news'
    })
  },
  //  点击去到用户协议页面
  goUserAgreement: function () {
    wx.navigateTo({
      url: '/pages/userAgreement/userAgreement'
    })
  },
  //  点击去到关于我们页面
  goAboutUs: function () {
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs'
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
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    this.getInfomation();
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

  }
})
//  退出倒计时
function countDown(that, logoutTime) {
  if (logoutTime == 0) {
    app.globalData.token = null;
    that.setData({
      logouting: false
    })
    wx.reLaunch({
      url: '/pages/index/index'
    })
    return;
  }
  that.setData({
    logoutTime: logoutTime
  })
  setTimeout(function () {
    logoutTime--;
    countDown(that, logoutTime);
  }, 1000);
}