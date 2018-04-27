//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    VcodeFlag:true,
    VcodeTime:60,
    telephone:""
  },
  gettelePhone:function(e){
    var phone = e.detail.value;
      this.setData({
        telephone:phone
      })
  },
  //发送验证码
  sendVcode:function(){
    var that = this;
    var telephone = this.data.telephone;
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(telephone))) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        duration: 2000
      })


      return false;
    }
    wx.request({
      url: app.globalData.API[0] + 'sentObtain',
      method: "POST",
      dataType: "json",
      data: {
        telephoneint: telephone,
        type:5 //5为实名认证
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var count = that.data.VcodeTime
        const statsMsg = res.data
        if (statsMsg == 1) {
          countDown(that, count)
        }
      },
      fail: function (er) {
        console.log(er);
      }
    })
  },
  meadiacertification:function(e){
    console.log(e);
    var that = this;
    var realName = e.detail.value.realName;//开户名
    var cartId = e.detail.value.cartdId;//省份证
    var cardNo = e.detail.value.cardNo //银行卡号 
    var phoneNo = e.detail.value.phoneNo  //手机号 
    var Vcode = e.detail.value.Vcode //验证码
    if ('' == realName) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
      })
      return false;
    }
    if ('' == cartId) {
      wx.showToast({
        title: '身份证不能为空',
        icon:'none'
      })
      return false;
    }
   
    if (cartId.length<12) {
      wx.showToast({
        title: '身份证号不对',
        icon:'none'
      })
      return false;
    }
    if (!/^\d{17}(\d|x)$/i.test(cartId)){
      wx.showToast({
        title: '你输入的身份证长度或格式错误',
        icon: 'none'
      })
      return false;
    }
    if (cardNo.length < 16 || cardNo.length > 19) {
      wx.showToast({
        title: '银行卡号有误',
        icon: 'none'
      })
      return false;
    }
    var num = /^\d*$/; //全数字
    if (!num.exec(cardNo)) {
      wx.showToast({
        title: '银行卡号必须全为数字',
        icon: 'none'
      })
      return false;
    }
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(cardNo.substring(0, 2)) == -1) {
      wx.showToast({
        title: '银行卡号开头6位不符合规范',
        icon: 'none'
      })
      return false;
    }
    if ('' == cardNo) {
      wx.showToast({
        title: '银行卡号不能为空',
        icon:'none'
      })
      return false;
    }

    if ('' == phoneNo) {
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return false;
    }
   
    if ('' == Vcode) {
      wx.showToast({
        title: '验证码不能为空',
        icon:'none'
      })
      return false;
    }
    //校验验证码
    wx.request({
      url: app.globalData.API[0] + 'smsCheck',
      method: "POST",
      dataType: "json",
      data: {
        telephoneint: that.data.telephone,
        code: Vcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data)
        const statsMsg = res.data
        if (statsMsg == 1) {
          reqAuth(that, cardNo, cartId, realName, phoneNo);
        } else {
          wx.showToast({
            title: statsMsg,
            icon: "none"
          })
        }
      },
      fail: function (er) {
        console.log(er);
      }
    })
  },
  /**
  *调到认证投资人页面
  */
  toauthInvestPeople: function () {
    wx.navigateTo({
      url: '../authInvestPeople/authInvestPeople',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  }

})
//立即认证
function reqAuth(that, cardNo, cartId, realName, phoneNo){
  wx.showLoading({
    title: '加载中',
    mask:true,
  })
  wx.request({
    url: app.globalData.API[0] + 'my/carbankAuthenticate',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: app.globalData.token,
      cardNo: cardNo,
      idNo: cartId,
      name: realName,
      phoneNo: phoneNo
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log(res.data)
      wx.hideLoading();
      const statsMsg = res.data.statsMsg.stats;
      const msg = res.data.msg;
      
      if (statsMsg == 1) {

        wx.redirectTo({
          url: '../AuthEnd/AuthEnd?isShowV=1'
        })

      }else{
        wx.showToast({
          title: msg,
          icon:"none"
        })
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}


//倒计时
function countDown(that, count) {
  if (count == 0) {
    that.setData({
      VcodeFlag: true,
      VcodeTime:60
    })
    return;
  }
  that.setData({
    VcodeFlag: false,
    VcodeTime: count,
  })
  setTimeout(function () {
    count--;
    countDown(that, count);
  }, 1000);
}