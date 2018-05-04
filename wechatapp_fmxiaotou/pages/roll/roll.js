const util = require("../../utils/util.js");
var app = getApp();
var promisify = util.promisify
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
    images2: {},
    userInfo: {},
    propPosterFlag:true,
    propPosterFlag2:true,
    animationFlag:true,
    animationData: {},
    contactMan:'',
    contactPhone:'',
    checked: false,
    imageWidth: 0,
    imageHeight: 0,
    // tab切换  
    currentTab: 0,
    bgImg:"",
    endTime:'',
    clickFlag: true,
    memberPhotos:{},
    bottomshow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      
      that.getInfomation(that);
      var endTime = util.dateCount(app.globalData.userInfo.endTime);
      this.setData({
        endTime: endTime
      })

      setTimeout(function () {
        that.buildPoster(that);
      }, 800)

      var isFmInvestorDIyi = app.globalData.userInfo.isFmInvestor;// 是否疯蜜学员：0否，1疯蜜终生学员，2疯蜜年度学员,3已交定金学员
      var one = wx.getStorageSync('one');
      
      var bottomshow = '';
      if (isFmInvestorDIyi==0)
      {
        bottomshow = true;
      }
      else if(isFmInvestorDIyi == 1 && one !=2){
          setTimeout(function () {
            that.openMask();
            wx.setStorageSync('one', 2)
          }, 800)
      }
      else{
        bottomshow = false;
      }
      this.setData({
        bottomshow: bottomshow
      })

  },

  /** 
    * 打开海报
    */

openMask:function(){
  var that = this;
  this.setData({
    propPosterFlag: false,
    propPosterFlag2:false
  })
  that.buildPoster(that);
},
  /** 
    * 关闭海报
    */
  closeMask:function(){
      this.setData({
        propPosterFlag:true,
        propPosterFlag2:true
      })
  },
  //生成海报
  buildPoster:function(that){

    var nickName = app.globalData.userInfo.nickname || app.globalData.userInfo.nickName
    var avatarUrl = app.globalData.userInfo.headpic || app.globalData.userInfo.avatarUrl || "https://oixnydddk.qnssl.com/312612727989663389.png"
    console.log(1222)
    console.log(avatarUrl)
    avatarUrl = avatarUrl.replace(/7xoor9.com1.z0.glb.clouddn.com/, "oixnydddk.qnssl.com");
    console.log(1223)
    console.log(avatarUrl)
    avatarUrl = avatarUrl.replace(/^http/, "https");
    console.log(1224)
    console.log(avatarUrl)
    avatarUrl = avatarUrl.replace(/^httpss/, "https");
    console.log(1225)
    console.log(avatarUrl)

    console.log(avatarUrl)
    var isFmInvestor = app.globalData.userInfo.isFmInvestor;// 是否疯蜜学员：0否，1疯蜜终生学员，2疯蜜年度学员,3已交定金学员
    // if (isFmInvestor==1){

    //   var poster = 'https://oixnydddk.qnssl.com/chengweizhongsengxuewyuanbg.png';

    // } else if (isFmInvestor == 2){
      
    //   var poster = 'https://oixnydddk.qnssl.com/nianduxueyuanposter.png';

    // } else if (isFmInvestor == 3){
    //   var poster = 'https://oixnydddk.qnssl.com/yuyuezhyongxueyuanbg.png';

    // }else{

    //   var poster = '';

    // }

    var poster = 'https://oixnydddk.qnssl.com/tongyiyizhnag.jpg';

    let winWidth2;
    let winHeight2;

    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        winWidth2 = res.windowWidth*0.7
        winHeight2 = res.windowHeight
      }
    })
    var $width = 750/2;    //获取图片真实宽度
    var $height = 1334/2;
    var ratio = $width / $height;    //图片的真实宽高比例
    var winWidth = winWidth2;          //设置图片显示宽度，左右留有16rpx边距
    var winHeight = winWidth2 / ratio;    //计算的高度值
      
    that.setData({
      winHeight: winHeight
    })

    getPosterImg(that);
    const wxGetImageInfo = promisify(wx.getImageInfo)

    Promise.all([
      wxGetImageInfo({
        src: poster
      }),
      wxGetImageInfo({
        src: avatarUrl
      })
    ]).then(res => {
      const ctx = wx.createCanvasContext('shareCanvas')

      // 底图
      ctx.drawImage(res[0].path, 0, 0, winWidth, winHeight)

      //绘制文字
      ctx.setTextAlign('center')    // 文字居中

     

      // if (isFmInvestor == 2){
      //   ctx.setFillStyle('#000000')  // 文字颜色：黑色
      // }else{
      //   ctx.setFillStyle('#EECC9C')  // 文字颜色
      // }
      ctx.setFillStyle('#000000')  // 文字颜色：黑色
      console.log(ctx.measureText(nickName))
      var mtx1 = ctx.measureText(nickName).width;  
      ctx.setFontSize(10)         // 文字字号：22px
     
      var len = (winWidth / 2) + (mtx1/2+20)
     
      ctx.fillText(nickName, len, 66)

      // 头像
      const qrImgSize = 31
      ctx.save(); // 保存当前ctx的状态
      ctx.arc((winWidth - qrImgSize) / 2 + 15.5, winHeight/8.4 , 15.5, 0, 2 * Math.PI); //画出圆
      ctx.clip(); //裁剪上面的圆形
      ctx.drawImage(res[1].path, (winWidth - qrImgSize) / 2, winHeight/8.4-15.5, qrImgSize, qrImgSize)
      ctx.restore(); // 还原状态
      //ctx.stroke()
      ctx.draw()
    })    
  },
  //保存海报
  saveImg: function (e) {

    const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)

    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '已保存到相册'
      })
      this.setData({
        propPosterFlag: true,
        propPosterFlag2: true
      })
      }).catch(err => {
        console.log("保存相册失败", err)
        if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny'){
            wx.authorize({
              scope: 'scope.writePhotoAlbum',
              success(successdata){

                console.log('授权成功')

              },
              fail(faildata){

                console.log('授权失败')

                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting.scope.writePhotosAlbum) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
                
              }
            })
        }
      })
  },
  //
  topayAgreement:function(){
      wx.navigateTo({
        url: '/pages/payAgreement/payAgreement',
      })
  },
  //获取联系人
  getContactMan:function(e){
    
    var val = e.detail.value;
    this.setData({
      contactMan:val
    })

  },
  //获取手机号
  getContactPhone:function(e){
    var val = e.detail.value;
    this.setData({
      contactPhone: val
    })
  },
  //是否勾选协议
  checkboxChange:function(e){
   this.setData({
     checked:!this.data.checked
   })
   console.log(this.data.checked)
  },
  imageLoad: function (e) {
    console.log(e)
    var imgwidth = e.detail.width,
        imgheight =e.detail.height; 
    this.setData({
      imageWidth: imgwidth,//图片宽度   
      imageHeight: imgheight//图片宽度   
    })
  },
  //微信支付
  wxpayFMinvestor:function(e){
    var that = this;
    var clickFlag = this.data.clickFlag;
      
    that.setData({
      clickFlag: false
    })

    if (!clickFlag) {
      return false;
    }

    setTimeout(function () {

      that.setData({
        clickFlag: true
      })

    }, 1500)
    

      var contactMan = this.data.contactMan;
      var contactPhone = this.data.contactPhone;
      var checked = this.data.checked;
      var currentTab = this.data.currentTab;

      var openId = app.globalData.openId || wx.getStorageSync('openId');

      var loginWay = wx.getStorageSync('loginWay')

      if (loginWay =='phone'){
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
      }else{

        openId = app.globalData.openId || wx.getStorageSync('openId');

      }

      console.log("openid:" + openId)    
      let param;  
      if (currentTab==0){
        if (contactMan == '') {
          wx.showToast({
            title: '请填写联系人',
            icon: 'none'
          })
          return false;
        }

        if (contactMan.length < 2 ) {
          wx.showToast({
            title: '请填写正确的联系人',
            icon: 'none'
          })
          return false;
        }

        if (contactPhone == '') {
          wx.showToast({
            title: '请填写联系电话',
            icon: 'none'
          })
          return false;
        }


        if (!(/^1[3|4|5||6|7|8|9]\d{9}$/.test(contactPhone))) {
          wx.showToast({
            title: '请填写正确的联系电话',
            icon: 'none'
          })
          return false;
        }
      
        setTimeout(()=>{
          param = {
            tokenId: app.globalData.token,
            openid: openId,
            body: '疯蜜学员支付',
            totalFee: 20000*100,
            clientType: 3,
            orderType: 3,
            payType: 2,
            shareType: 1,//1为终身 2为学度
            investPeople: contactMan,
            contactWay: contactPhone
          }
        },1000)

      }else{

      setTimeout(()=>{
         param = {
          tokenId: app.globalData.token,
          openid: openId,
          body: '疯蜜学员支付',
          totalFee: 20000*100,
          clientType: 3,
          orderType: 3,
          shareType: 2,//1为终身 2为学度
          payType: 2
        }
      },1000)
      }

      if (!checked) {
        wx.showToast({
          title: '请阅读并同意协议',
          icon: 'none'
        })
        return false;
      }

    setTimeout(()=>{
      wx.request({
        url: app.globalData.API[0] + 'invest/saveUserInvestProjectFollowH5',
        method: "POST",
        dataType: "json",
        data: param,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          console.log('添加订单', res);
          var stats = res.data.statsMsg.stats;
          if (stats == "1") {
            var appid = res.data.js.appid;
            var timeStamp = (res.data.js.timeStamp).toString();
            var nonceStr = res.data.js.nonceStr;
            var prepayId = res.data.js.prepayId;
            var paySign = res.data.js.paySign;
            // console.log(timeStamp)
            // console.log(nonceStr)
            // console.log(prepayId)
            // console.log(paySign)
            // console.log(typeof timeStamp)
            // console.log(typeof nonceStr)
            // console.log(typeof prepayId)
            // console.log(typeof paySign)
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

                that.getInfomation(that);
                that.closeProp();
                setTimeout(function () {
                  that.buildPoster(that);
                }, 800)
                setTimeout(function () {
                  that.openMask();
                }, 800)

              },
              'fail': function (res) {
                console.log(res);
                wx.showToast({
                  title: '支付失败',
                })
               
              },
              'complete': function (res) {
                console.log(res)
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
          }
        },
        fail: function (res) {
          console.log(res.data);
        }
      })
    }, 1200)
  },
  /** 
    * 滑动切换tab 
    */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    console.log(e)
    if (this.data.currentTab === e.target.dataset.current) {
     
      return false;
    } else {
  
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  } ,
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
      setTimeout(()=>{
        this.setData({
          animationFlag: true,
          propPosterFlag2: true
        })
      },180)
    }
    this.setData({
      animationData: animation.export()
    })
  },
  rollprop:function(){
    this.animationFn()
  },
  closeProp:function(){
    this.animationFn()
  },
  topayAgreement:function(){
    wx.navigateTo({
      url: '/pages/payAgreement/payAgreement',
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!app.globalData.token) {
      console.log('不存在token')
      wx.redirectTo({//如果没有登陆过则重定向到登录页面
        url: '/pages/login/login'
      })
    } else {

      
      if (app.globalData.userInfo.isFmInvestor == 1 || app.globalData.userInfo.isFmInvestor == 3){

          this.setData({
            bgImg:"https://oixnydddk.qnssl.com/zhongshengxueyuan.png"
          })

      } else if (app.globalData.userInfo.isFmInvestor == 2){
       
        this.setData({
          bgImg: " https://oixnydddk.qnssl.com/nianduxueryuan.png"
        })

      }
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  
    var endTime = util.dateCount2(app.globalData.userInfo.endTime);
    this.setData({
      endTime: endTime
    })

    that.getInfomation(that);
    setTimeout(function(){
      that.buildPoster(that);
    },800)

    var isFmInvestorDIyi = app.globalData.userInfo.isFmInvestor;// 是否疯蜜学员：0否，1疯蜜终生学员，2疯蜜年度学员,3已交定金学员
    this.setData({
      isFmInvestorDIyi: isFmInvestorDIyi
    })
    var one = wx.getStorageSync('one');
    if (isFmInvestorDIyi == 1 && one != 2) {
      setTimeout(function () {
        that.openMask();
        wx.setStorageSync('one', 2)
      }, 800)
    }
   
  },
  getInfomation:function(that){
    
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
        var userinfo = res.data.information;
        app.globalData.userInfo = userinfo;//存用户的信息
        // that.setData({
        //   userInfo: userinfo
        // })
      },
      fail: function () { 
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  imageLoad: function (e) { 
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 718 / ratio;    //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image,
      imageHeight: viewHeight
    })
  },
  imageLoad2: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 718 / ratio;    //计算的高度值
    var image2 = this.data.images2;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image2[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images2: image2
    })
  },

  // 底部按钮切换
  bootomItem: function (e) {
    var current = e.currentTarget.dataset.current;
        if (this.data.currentTab === e.target.dataset.current) {
          this.animationFn()
      return false;
    } else {
  
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
    this.animationFn()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  }
})

function getPosterImg(that){
  var wxRequest = promisify(wx.request)
  wxRequest({
    url: app.globalData.API[0] + 'my/findUserMemberPhotos',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: app.globalData.token
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  }).then(function (res) {
    console.log("请求海报图集成功");
    console.log(res)
    var memberPhotos = res.data.memberPhotos;
    that.setData({
      memberPhotos: memberPhotos
    })
  }).catch(function () {
    console.error("请求海报图集失败");
  })
}



