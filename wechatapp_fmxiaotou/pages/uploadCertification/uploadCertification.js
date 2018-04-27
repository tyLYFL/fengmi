
const qiniuUploader = require("../../utils/qiniuUploader");
var app = getApp();
let investPeopleJson;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageArry: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var investPeopleJsonTO = JSON.parse(options.investPeopleJsonStr)
    investPeopleJson = investPeopleJsonTO;
  },
  didPressChooesImage: function () {//上传
    var that = this;
    didPressChooesImage(that);
  },
  delImg:function(e){//删除
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
  preViewImg:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var imageArry=that.data.imageArry;
    wx.previewImage({
      current: imageArry[index] , // 当前显示图片的http链接
      urls: imageArry  // 需要预览的图片http链接列表
    })
  },
  authenticationV2:function(){
    var that = this;
    authenticationV2(that);
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
          'imageArry': ImgArry
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

function authenticationV2(that) {
  var investProjectSum = investPeopleJson.investTotalNum;
  var historyInvestSum = investPeopleJson.historyTotalNum;
  var exitProjectSum = investPeopleJson.OutTotalNum;
  var caseProjectName = investPeopleJson.investName;
  var caseIndustryName = investPeopleJson.investWay;
  var caseProjectTime = investPeopleJson.investDate;
  var caseInvestMoney = investPeopleJson.investMoney;

  switch (investPeopleJson.investMoneyType){
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
  if (assetsPhotos.length==0){
    wx.showToast({
      title: '请上传资产证明图片',
      icon:'none'
    })
    return false;
  }
  wx.request({
    url: app.globalData.API[0] + 'invest/authenticationV2',
    method: "POST",
    dataType: "json",
    data:{
      tokenId: app.globalData.token,
      auditstate:1,
      investProjectSum: investProjectSum,
      historyInvestSum:historyInvestSum,
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
          icon:'none'
        })

        wx.redirectTo({
          url: '../authInvestPeopleEnd/authInvestPeopleEnd?isUploadTo=1',
        })
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}