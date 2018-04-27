let wxparse = require("../../wxParse/wxParse.js");
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  Id:0,
  currentTab: 0,       
  animationData:{},
  animationFlag:true,
  animationData2: {},
  animationFlag2: true,
  FinanceData1: [],
  weixincode:[],
  currentstate: '',
  state:'',
  Endstate:true,   //课程是否结束
  contactMan:'',   //预约联系人姓名
  contactPhone:'', //预约联系人电话
  PayMan: '',   //预约联系人姓名
  PayPhone: '', //预约联系人电话
  checked: false,  //付费服务协议
  newDate:'',     //现在时间
  haveweixinCode:'',
  RecordByUserData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this;
    var id = options.id;

    this.setData(
      {
        Id: id
      }
    )
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    }
    
    if (app.globalData.token) {
      wx.request({
        url: app.globalData.API[4] + '/finance/findFinanceDetails',
        data:{
          financeId:id,
          tokenId: app.globalData.token
        },
        header: {
          'content-type': 'application/json'
        },
        success:res=>{
          // 判断课程是否结束
          var Endstate = false;
          var newDate = Date.parse(new Date());
          if (newDate > res.data.fmFinance.financeEndTime){
            Endstate = false;
          }
          var financeStartTime = util.dateCount3(res.data.fmFinance.financeStartTime,                         true)
          var financeEndTime = util.dateCount3(res.data.fmFinance.financeEndTime, false)
          var appiontments = that.Overbook(res.data.fmFinance.appiontments, res.data.fmFinance.financeOverbook);
          res.data.fmFinance.financeStartTime = financeStartTime;
          res.data.fmFinance.financeEndTime = financeEndTime;
          res.data.fmFinance.appiontments = appiontments;
          
          wxparse.wxParse('oratorDesc', 'html', res.data.fmFinance.oratorDesc, this, 0);
          wxparse.wxParse('financeDesc', 'html', res.data.fmFinance.financeDesc, this, 0);
          this.setData(
            {
              FinanceData1: res.data.fmFinance,
              Endstate: Endstate,
              state: res.data.fmFinance.isCollect
            } 
          )
        },
        fail:err=>{
          console.log(err)
        }
      })



      //  获取学员预约听课信息
      wx.request({
        url: app.globalData.API[4] + '/finance/findFinanceReservationRecordByUserId',
        data: {
          tokenId: app.globalData.token,
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          var RecordByUserData = res.data.fmFinance
          RecordByUserData.createTime = that.OnewDate(res.data.fmFinance.createTime)
          this.setData(
            {
              RecordByUserData: RecordByUserData
            }
          )
        },
        fail: err => {
          console.log(err)
        }
      })
    }
    
  },


  // 圆形进度条圆周计算
  Overbook: function (count, sum) {
    var that = this;
    var paizhi = (count / sum) * 360;
    if (paizhi > 360) {
      paizhi = 360;
    }
    return paizhi;
  },

  // 获取底部按钮key值
  getBotProp:function(e){
  var butkey = e.target.dataset.key;
  this.animationFn();
  this.setData(
    {
      
      currentTab:butkey,
    }
  )
  },
  // 弹出预约详情表
  animationFn: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation;
    if (this.data.animationFlag) {

      animation.bottom(0 + 'rpx').step()
      this.setData({
        animationFlag: false,
        propPosterFlag2: false
      })
    } else {
      animation.bottom(-654 + 'rpx').step()
      setTimeout(() => {
        this.setData({
          animationFlag: true,
          propPosterFlag2: true
        })
      }, 180)
    }
    this.setData({
      animationData: animation.export()
    })
  },
  animationFn2: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation;
    if (this.data.animationFlag2) {

      animation.bottom(0 + 'rpx').step()
      this.setData({
        animationFlag2: false,
        propPosterFlag2: false
      })
    } else {
      animation.bottom(-654 + 'rpx').step()
      setTimeout(() => {
        this.setData({
          animationFlag2: true,
          propPosterFlag2: true
        })
      }, 180)
    }
    this.setData({
      animationData2: animation.export()
    })
  },


  // 关闭预约详情表
  closeProp:function(){
    if (this.data.animationFlag2== true)
    {
      this.animationFn()
    }
    if (this.data.animationFlag == true&&this.data.animationFlag2 == false) {
      this.animationFn2()
    }
    if (this.data.animationFlag == false && this.data.animationFlag2 == false) {
      this.animationFn()
      this.animationFn2()
    }    

  },
  
  // 收藏
  ifliketap:function(){
    var that =this;
    if (that.data.state==0){
      that.data.state = 1
      this.setData(
        {
          state: 1,
        })
      that.projectCollter(that.data.state)
    }
    else{
      that.data.state = 0
      this.setData(
        {
          state: 0,
        })
      that.projectCollter(that.data.state)
    }
  },

  // 学员免费听判断
  OpenFinance:function(){
    var that =this;
    that.setData(
      {

        currentTab: 0,
      }
    )
    var isFmInvestorDIyi = app.globalData.userInfo.isFmInvestor;// 是否疯蜜学员：0否，1疯蜜终生学员，2疯蜜年度学员,3已交定金学员
    if (isFmInvestorDIyi==0)
    {
        //  弹出未开通学籍提示
      wx.showModal({
        title: '提示',
        content: '1、您还未开通学籍，开通后有权限使用\r\n2、如您已是学员，请联系客服修改权限', 
        confirmText:'立即开通',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../roll/roll',
            })
          }
          else {
            console.log('用户点击取消')
          }
        }
      })
    }
    else
    {
      //  弹出课程已结束
      if (that.data.Endstate) {
        wx.showModal({
          title: '课程已结束',
          showCancel:false,
        });
        return false
      }
      if (this.data.FinanceData1.isOrder==1)
      {
        this.animationFn2();
      }
      else{
        this.animationFn();
      }
      
    }
  },

  // 单次体验
  Oneexperien:function(){
    var that =this;

    //  弹出课程已结束
    if (that.data.Endstate) {
      wx.showModal({
        title: '课程已结束',
        showCancel: false,
      });
      return false
    }

    var isFmInvestorDIyi = app.globalData.userInfo.isFmInvestor;// 是否疯蜜学员：0否，1疯蜜终生学员，2疯蜜年度学员,3已交定金学员


    if (isFmInvestorDIyi == 0) {
      that.setData(
        {

          currentTab: 1,
        }
      )
      this.animationFn();
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您已是疯蜜财商学院付费学员，可预约免费听课',
        confirmText: '免费听课',
        success: function (res) {
          if (res.confirm) {
          if (that.data.FinanceData1.isOrder == 1)
          {
            that.setData(
              {

                currentTab:1,
              }
            )
            that.animationFn2();
          }
          else{
            that.setData(
              {

                currentTab: 0,
              }
            )
            that.animationFn();
          }
          }
          else{
            console.log('取消')
          }
         
        },
      });
      return false
    }
  },

  //打开付费学员服务协议
  topayAgreement: function () {
    wx.navigateTo({
      url: '/pages/payAgreement/payAgreement',
    })
  },

  //获取预约联系人
  getContactMan: function (e) {

    var val = e.detail.value;
    this.setData({
      contactMan: val
    })

  },
  //获取预约手机号
  getContactPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      contactPhone: val
    })
  },

  //获取付费联系人
  getPayMan: function (e) {

    var val = e.detail.value;
    this.setData({
      PayMan: val
    })

  },
  //获取付费手机号
  getPayPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      PayPhone: val
    })
  },
 
  judgeContact:function(Name,Phone){
    if (Name == '') {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none'
      })
      return false;
    }

    if (Name.length < 2) {
      wx.showToast({
        title: '请填写正确的联系人',
        icon: 'none'
      })
      return false;
    }

    if (Phone == '') {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
      return false;
    }


    if (!(/^1[3|4|5||6|7|8|9]\d{9}$/.test(Phone))) {
      wx.showToast({
        title: '请填写正确的联系电话',
        icon: 'none'
      })
      return false;
    }
    else{
      return true;
    }
  },

  //是否勾选协议
  checkboxChange: function (e) {
    this.setData({
      checked: !this.data.checked
    })
    console.log(this.data.checked)
  },

  // 获取当前时间
  OnewDate:function(time){
    var newDate = new Date();
    newDate.setTime(time);
    var date1 = newDate.toLocaleString();
    return date1 
  },

  // 复制微信号
  copyweixin:function(){
    wx.setClipboardData({
      data: this.data.RecordByUserData.weixinNum,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  // 预约听课完成
  getbotChild:function(){
    var that = this;
    if (that.judgeContact(that.data.contactMan, that.data.contactPhone)==true){
      wx.request({
        url:  app.globalData.API[4] + '/finance/addFinanceReservationRecord',
        data: {
          projectId: that.data.Id,
          tokenId: app.globalData.token,
          contacts: that.data.contactMan,
          contactNumber: that.data.contactPhone
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log('success')
          that.animationFn2();
        },
        fail:err=>{
          console.log('fail')
        }
      })
     
    }
  },

  // 微信支付
  wecahtPays:function(){
    var that = this;
    var openId = app.globalData.openId || wx.getStorageSync('openId');
    var newDate = this.OnewDate();
    if (this.judgeContact(this.data.PayMan, this.data.PayPhone) == true) {
      if (this.data.checked==false) {
        wx.showToast({
          title: '请阅读并同意协议',
          icon: 'none'
        })
        return false;
      }
      this.setData({
        newDate: newDate
      })
      var openId = app.globalData.openId || wx.getStorageSync('openId');
      var loginWay = wx.getStorageSync('loginWay')

      //  授权
      if (loginWay == 'phone') {
        wx.login({
          success: res => {
            var code = res.code;
            wx.request({
              url: app.globalData.API[0] + '/user/weiXinMiniAuthorization',
              method: "POST",
              dataType: "json",
              data: {
                code: code
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function (res) {
                console.log('获取openId', res);
                var stats = res.data.statsMsg.stats;
                if (stats == "1") {
                  openId = res.data.openId
                  console.log(openId)
                }
              },
              'fail': function (res) {
                console.log(res);
              }
            })
          }
        })
      } else {

        openId = app.globalData.openId || wx.getStorageSync('openId');

      }
      console.log(this.data.PayMan)
      console.log(this.data.PayPhone)
      var param = {
        tokenId: app.globalData.token,
        openid: openId,
        body: '疯蜜学员支付',
        totalFee: 1 * 100,
        clientType: 3,
        orderType: 4,
        shareType: '',//1为终身 2为学度
        payType: 2,
        investId: this.data.Id,
        investPeople: this.data.PayMan,
        contactWay: this.data.PayPhone,
      }
      wx.request({
        url: app.globalData.API[4] + 'invest/saveUserInvestProjectFollowH5',
        method: "POST",
        dataType: "json",
        data: param,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        }, 
        success: function (res) {
          console.log('添加订单', res);
          var stats = res.data.statsMsg.stats;
          console.log('ssss', stats)
          if (stats == "1") {
            var appid = res.data.js.appid;
            var timeStamp = (res.data.js.timeStamp).toString();
            var nonceStr = res.data.js.nonceStr;
            var prepayId = res.data.js.prepayId;
            var paySign = res.data.js.paySign;
            wx.requestPayment({
              'appId': appid,
              'nonceStr': nonceStr,
              'package': 'prepay_id=' + prepayId,
              'signType': 'MD5',
              'timeStamp': timeStamp,
              'paySign': paySign,
              'success': function (res) {
                console.log("调起支付成功");
                wx.showToast({
                  title: '支付成功',
                })
                that.animationFn2();
              },
              'fail': function (res) {
                console.log('22', res)
                wx.showToast({
                  title: '支付失败',
                })
                that.closeProp();
              },
              'complete': function (res) {
                console.log('1',res)
                if (res.errMsg == "requestPayment:cancel") {
                  wx.showToast({
                    title: '支付失败',
                  })
                }
                
              }
            })
          } else {
            wx.showToast({
              title: '提交订单失败',
            })
            that.closeProp();
          }
        },
        fail:function(){
          console.log('失败')
          that.closeProp();
        }
        })
      
      }

  },
   
  // 财商（课程、项目）收藏  
  projectCollter:function(state){
    
   wx.request({
     url: app.globalData.API[4] + "/finance/projectCollter",
     data:{
       projectId: this.data.Id,
       tokenId: app.globalData.token,
       type:1,         //1财商课，2实战项目
       state: state,   //0取消收藏，1添加收藏
     },
     success:res=>{
       console.log('成功');
     },
     fail:err=>{
       console.log(err)
     }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})