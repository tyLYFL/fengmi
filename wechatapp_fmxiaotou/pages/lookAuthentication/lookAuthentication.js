var app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader");
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    way: '',
    date: '',
    type: '种子轮',
    money: 'RMB￥',
    wayArry: ['电商', '社交'],
    moneyArry: ['RMB￥', 'US$'],
    investTypeArry: ['种子轮', '天使轮'],
    investProjectSum:'',
    historyInvestSum:'',
    exitProjectSum:'',
    caseIndustryName:'',
    caseInvestMoneyUnit:'',
    TypePickerChange:'',
    imageArry:[],
    isdisableFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isdisable = options.isdisable;
    if (isdisable==0){
      that.setData({
        isdisableFlag:false
      })
    }
    authentication(that);
  },
  //picker选择器发生变化处理
  wayPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;
    var wayArry = this.data.wayArry[index];
    var caseIndustryName = this.data.caseIndustryName;
    caseIndustryName = wayArry;
    this.setData({
      way: wayArry,
      caseIndustryName: caseIndustryName
    })
  },
  datePickerChange: function (e) {
    var date = e.detail.value;
    this.setData({
      date: date
    })
  },
  moneyTypePickerChange: function (e) {
    var index = e.detail.value;
    var moneyArry = this.data.moneyArry[index];
    var caseInvestMoneyUnit = this.data.caseInvestMoneyUnit;
    if (index==0){
      this.setData({
        caseInvestMoneyUnit:1
      })
    }else{
      this.setData({
        caseInvestMoneyUnit: 2
      })
    }
    
    this.setData({
      money: moneyArry,
    })
  },
  TypePickerChange: function (e) {
    var index = e.detail.value;
    var investTypeArry = this.data.investTypeArry[index];
    var caseFinancingState = this.data.caseFinancingState;
    caseFinancingState = investTypeArry;
    this.setData({
      type: investTypeArry,
      caseFinancingState: caseFinancingState
    })
  },
  didPressChooesImage: function () {//上传
    var that = this;
    didPressChooesImage(that);
  },
  delImg: function (e) {//删除
    console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '删除',
      content: '你确定要删除图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var uloadImgArry = that.data.imageArry;
          uloadImgArry.splice(index, 1);
          that.setData({
            imageArry: uloadImgArry
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //预览tupain
  preViewImg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var imageArry = that.data.imageArry;
    wx.previewImage({
      current: imageArry[index], // 当前显示图片的http链接
      urls: imageArry  // 需要预览的图片http链接列表
    })
  },
  authenticationV2: function (e) {
    var that = this;
    console.log(e);
    var investTotalNum = e.detail.value.investTotalNum;
    var historyTotalNum = e.detail.value.historyTotalNum;
    var OutTotalNum = e.detail.value.OutTotalNum;
    var investName = e.detail.value.investName;
    var investWay = e.detail.value.investWay;
    var investDate = e.detail.value.investDate;//时间
    investDate = investDate.replace(/-|年|月/g, '/');
    var investMoney = e.detail.value.investMoney;
    var investMoneyType = e.detail.value.investMoneyType;

    var id = e.detail.target.dataset.id;
    var investType = e.detail.value.investType;
    var investReturn = e.detail.value.investReturn;

    var investPeopleJson = {
      id:id,
      investTotalNum: investTotalNum,
      historyTotalNum: historyTotalNum,
      OutTotalNum: OutTotalNum,
      investName: investName,
      investWay: investWay,
      investDate: investDate,
      investMoney: investMoney,
      investMoneyType: investMoneyType,
      investType: investType,
      investReturn: investReturn
    }


    authenticationV2(that,investPeopleJson);
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
  
  }
})


// 初始化相关参数
function initQiniu() {
  wx.request({
    url: app.globalData.API[0] + 'token/',
    method: 'POST',
    success: function (res) {
      console.log(res.data)
      var token = res.data.token;
      var options = {
        region: 'ECN',
        uptokenURL: 'https://up.qbox.me/uptoken',
        uptoken: token,
        domain: 'https://oixnydddk.qnssl.com/',
        shouldUseQiniuFileName: false
      };
      qiniuUploader.init(options);
    }
  })

}

function didPressChooesImage(that) {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      wx.showToast({
        title: '上传中',
        icon: 'loading'
      })
      var filePath = res.tempFilePaths[0];
      qiniuUploader.upload(filePath, (res) => {
        var ImgArry = that.data.imageArry;
        ImgArry.push(res.imageURL)
        that.setData({
          imageArry: ImgArry
        });
        wx.hideToast();
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      }, {
          // key: 'testKeyNameLSAKDKASJDHKAS'
          // shouldUseQiniuFileName: true
        });
    }
  }
    // , {
    //   region: 'ECN',
    //   domain: 'balxqjka.btk.clouddn.com',
    //   uptokenURL: 'myServer.cpm/api/uptoken'
    // }
  )
}

//获取认证的信息
function authentication(that) {
  wx.request({
    url: app.globalData.API[0] + 'invest/authenticationV2',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: app.globalData.token ,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log(res.data)
      const statsMsg = res.data.statsMsg.stats;
      if (statsMsg == 1) {
        var assets = res.data.assets;
        var imageArry = assets.assetsPhotos.split(",");
        var date = assets.caseProjectTime;
        var id = assets.id;
        var investProjectSum = assets.investProjectSum;
        var historyInvestSum = assets.historyInvestSum;//历史投资金额
        var exitProjectSum = assets.exitProjectSum;
        var caseProjectName = assets.caseProjectName;
        var caseIndustryName = assets.caseIndustryName;
        var caseInvestMoney = assets.caseInvestMoney;
        var caseInvestMoneyUnit = assets.caseInvestMoneyUnit;
        var caseFinancingState = assets.caseFinancingState;
        var caseInvestReward = assets.caseInvestReward;

        that.setData({
          id:id,
          investProjectSum: investProjectSum,
          historyInvestSum: historyInvestSum,
          exitProjectSum: exitProjectSum,
          caseProjectName: caseProjectName,
          caseIndustryName: caseIndustryName,
          caseInvestMoney: caseInvestMoney,
          caseInvestMoneyUnit: caseInvestMoneyUnit,
          caseFinancingState: caseFinancingState,
          caseInvestReward: caseInvestReward,
          date:date,
          imageArry:imageArry
        })

      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}

//重新认证提交
function authenticationV2(that,investPeopleJson) {

  var id = investPeopleJson.id;
  var investProjectSum = investPeopleJson.investTotalNum;
  var historyInvestSum = investPeopleJson.historyTotalNum;
  var exitProjectSum = investPeopleJson.OutTotalNum;
  var caseProjectName = investPeopleJson.investName;
  var caseIndustryName = investPeopleJson.investWay;
  var caseProjectTime = investPeopleJson.investDate;
  var caseInvestMoney = investPeopleJson.investMoney;

  switch (investPeopleJson.investMoneyType) {
    case "RMB￥":
      var caseInvestMoneyUnit = 1;
      break;
    case "US$":
      var caseInvestMoneyUnit = 2;
      break;
  }

  var caseFinancingState = investPeopleJson.investType;
  var caseInvestReward = investPeopleJson.investReturn;
  var assetsPhotos = that.data.imageArry.join(",");//接受个人资产证明图片集
  if (assetsPhotos.length == 0) {
    wx.showToast({
      title: '请上传资产证明图片',
      icon: 'none'
    })
    return false;
  }
  wx.request({
    url: app.globalData.API[0] + 'invest/authenticationV2',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: app.globalData.token,
      auditstate: 1,
      id:id,
      investProjectSum: investProjectSum,
      historyInvestSum: historyInvestSum,
      exitProjectSum: exitProjectSum,
      caseProjectName: caseProjectName,
      caseIndustryName: caseIndustryName,
      caseProjectTime: caseProjectTime,
      caseInvestMoney: caseInvestMoney,
      caseInvestMoneyUnit: caseInvestMoneyUnit, //1为RMB 2为$
      caseFinancingState: caseFinancingState,
      caseInvestReward: caseInvestReward,
      assetsPhotos: assetsPhotos.toString()
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log(res.data)
      const statsMsg = res.data.statsMsg.stats;
      if (statsMsg == 1) {
        wx.setStorageSync('isAuthenFlag', 1);
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })

        wx.redirectTo({
          url: '../authInvestPeopleEnd/authInvestPeopleEnd',
        })
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}