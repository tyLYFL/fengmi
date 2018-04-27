var app = getApp();
var newarry = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'RMB￥',
    MoneyUnitArry:['RMB￥', 'US$'],
    preference:{},
    infoBebans1:{},
    infoBebans2:{}
  },
  //选中人民币的类型
  moneyTypePickerChange: function (e) {
    var index = e.detail.value;
    var MoneyUnitArry = this.data.MoneyUnitArry[index];
    this.setData({
      money: MoneyUnitArry
    })
  },
  //关注领域点击
  tapItemUniverse:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var isSelect = e.currentTarget.dataset.isselect;
    console.log(isSelect);
    console.log(typeof isSelect)
    var infoBebans1Copy = that.data.infoBebans1;
    var num = 0;
    for (var i = 0; i < infoBebans1Copy.length; i++) {
      if (infoBebans1Copy[i].isSelect) {
        num = num + 1;
        console.log(num)
        if (num >=5) {
          if (!isSelect){
            wx.showToast({
              title: '最多只能选择5个',
              icon: 'none'
            })
          }
        }
      }
    }

    for (var i = 0; i < infoBebans1Copy.length; i++) {

      if (infoBebans1Copy[i].id == id && num < 5) {
        infoBebans1Copy[i].isSelect = !infoBebans1Copy[i].isSelect;
        that.setData({
          infoBebans1: infoBebans1Copy
        })
      }
      if (infoBebans1Copy[i].id == id && num >=5 ){
        if (infoBebans1Copy[i].isSelect){
          infoBebans1Copy[i].isSelect = !infoBebans1Copy[i].isSelect;
          that.setData({
            infoBebans1: infoBebans1Copy
          })
        }
      }
    }
  },
  //关注轮次点击
  tapItemRound:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var infoBebans2Copy = that.data.infoBebans2;

    for (var i = 0; i < infoBebans2Copy.length; i++) {
      if (infoBebans2Copy[i].id == id){
        infoBebans2Copy[i].isSelect = !infoBebans2Copy[i].isSelect
      }
    }
    that.setData({
      infoBebans2: infoBebans2Copy
    })

  },
  //点击回报方式
  returnWayFn:function(e){
    var key = e.currentTarget.dataset.key
    var preference = this.data.preference
    preference.returnWay = key;
    this.setData({
      preference: preference
    })
  },
  //是否是机构投资人
  isFamousInvestorFn: function (e) {
    var key = e.currentTarget.dataset.key
    var preference = this.data.preference
    preference.isFamousInvestor = key;
    this.setData({
      preference: preference
    })
  },
  //添加用户投资偏好
  addUInvestPreference:function(e){
     var that = this;
     var id = that.data.preference.id;
     var investSumMin = e.detail.value.investSumMin;
     var investSumMax = e.detail.value.investSumMax;
     var returnWay =that.data.preference.returnWay;
     var isFamousInvestor = that.data.preference.isFamousInvestor

     var industryIds =[]//关注领域
     var raundIds = [];//关注轮次
     console.log(industryIds)
     var infoBebans1Copy = that.data.infoBebans1;
     for (var i = 0; i < infoBebans1Copy.length; i++) {
       if (infoBebans1Copy[i].isSelect) {
         industryIds.push(infoBebans1Copy[i].id);
       }
     }

     var infoBebans2Copy = that.data.infoBebans2;
     for (var i = 0; i < infoBebans2Copy.length; i++) {
       if (infoBebans2Copy[i].isSelect) {
         raundIds.push(infoBebans2Copy[i].id);
       }
     }
     console.log(industryIds)
     console.log(raundIds)
      for (var i = industryIds.length - 1; i >= 0; i--) {
        if (industryIds[i] == undefined || industryIds[i] == " ") {
            industryIds.splice(i, 1);
        }
      }
    
      for (var i = raundIds.length - 1; i >= 0; i--) {
        if (raundIds[i] == undefined || raundIds[i]==" ") {
          raundIds.splice(i, 1);
        }
      }
     if (industryIds.length <= 0) {
       wx.showToast({
         title: '关注领域还没有选择',
         icon: 'none'
       })
       return false;
     }
     if (raundIds.length <= 0) {
       wx.showToast({
         title: '关注轮次还没有选择',
         icon: 'none'
       })
       return false;
     }

     if ('' == investSumMin || '' == investSumMax){
          wx.showToast({
            title: '请填写单笔投资额度',
            icon:'none'
          })
          return false;
     }
     console.log(investSumMin);
     console.log(investSumMax)
     if ( investSumMin*1 >= investSumMax*1) {
       wx.showToast({
         title: '投资额度最大值不能小于最小值',
         icon: 'none'
       })
       return false;
     }
     switch (that.data.money) {
       case "RMB￥":
         var InvestMoneyUnit = 1;
         break;
       case "US$":
         var InvestMoneyUnit = 2;
         break;
     }

     var param = {
       tokenId: app.globalData.token,
       investSumMin: investSumMin,
       investSumMax: investSumMax,
       investMoneyUnit: InvestMoneyUnit,
       returnWay: returnWay,//回报方式：1定期分红，2股权增值
       isFamousInvestor: isFamousInvestor,//	是否知名投资机构/人：0否，1是
       industryIds: industryIds.join(','),//	关注行业领域结果集:1,2,3,4
       raundIds: raundIds.join(',')  //	关注投资轮次结果集：2,3,4,5,6
     }
     if (id) {//有id为编辑
       param.id = id
     }

     console.log(param);
     addUserInvestPreferenceInfo(that, param);
     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      findBasicInfo(that, 1);
      findBasicInfo(that, 2);
      setTimeout(function(){
        findUserInvestPreferenceInfo(that);
      },800)
  }
})


//获取用户投资偏好
function findUserInvestPreferenceInfo(that) {
  wx.request({
    url: app.globalData.API[0] + 'my/findUserInvestPreferenceInfo',
    method: "POST",
    dataType: "json",
    data: {
      tokenId: app.globalData.token
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log("获取用户投资偏好")
      console.log(res.data)
      var stats = res.data.statsMsg.stats;
      if(stats==1){
          var preference = res.data.preference;

        if(preference){
            var industryIds = preference.industryIds;
            if (industryIds){
              var industryIdsCopy = industryIds.split(",");
              preference.industryIds = industryIdsCopy;
           

            var infoBebans1Copy = that.data.infoBebans1
            for (var i = 0; i < infoBebans1Copy.length; i++) {

              for (var j = 0; j < industryIdsCopy.length; j++) {
              
                if (infoBebans1Copy[i].id == industryIdsCopy[j]) {
                  infoBebans1Copy[i].isSelect = true;
                  that.setData({
                    infoBebans1: infoBebans1Copy
                  })
                  break;
                }else{
                  infoBebans1Copy[i].isSelect = false;
                  that.setData({
                    infoBebans1: infoBebans1Copy
                  })
                }
              }
            }
          }
            console.log(that.data.infoBebans1)
            var raundIds = preference.raundIds
            if (raundIds){
                var raundIdsCopy = raundIds.split(",");
                preference.raundIds = raundIdsCopy;
            

              var infoBebans2Copy = that.data.infoBebans2
              for (var i = 0; i < infoBebans2Copy.length;i++){
                
                for (var j = 0; j < raundIdsCopy.length; j++) {
            
                  if (infoBebans2Copy[i].id == raundIdsCopy[j]) {
                    infoBebans2Copy[i].isSelect = true;
                    that.setData({
                      infoBebans2: infoBebans2Copy
                    })
                    break;
                  }else{
                    infoBebans2Copy[i].isSelect = false;
                    that.setData({
                      infoBebans2: infoBebans2Copy
                    })
                  }
                }
              }
            }
            console.log(that.data.infoBebans2)
            var investMoneyUnit = preference.investMoneyUnit;
            switch (investMoneyUnit){
                case 1:
                  that.setData({
                    money: "RMB￥"
                  })
                break;
                case 2:
                  that.setData({
                    money:"US$"
                  })
                  break;
            }

            that.setData({
              preference: preference
            })
           
        }
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}

//添加或编辑用户投资偏好信息
function addUserInvestPreferenceInfo(that, param) {
  wx.request({
    url: app.globalData.API[0] + 'my/addOrUpdateUserInvestPreferenceInfo',
    method: "POST",
    dataType: "json",
    data:param,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      var stats = res.data.statsMsg.stats;
      if (stats == 1) {
        wx.showToast({
          title: '保存成功',
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../myCenter/myCenter',
          })
        },1500);
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}


//行业领域/融资轮次
function findBasicInfo(that,datatype) {
  wx.request({
    url: app.globalData.API[0] + 'stock/findBasicInfo',
    method: "POST",
    dataType: "json",
    data: {
      dataType: datatype //	1行业领域，2融资轮次
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      console.log(res.data)
      var stats = res.data.statsMsg.stats; 
      if (stats == 1) {
        var infoBebans8 = res.data.infoBebans;
        if (infoBebans8) {
          switch(datatype){
            case 1:
              for (var i = 0; i < infoBebans8.length;i++){
                infoBebans8[i].isSelect = false;
              }
              that.setData({
                infoBebans1:infoBebans8
              })
             break;
            case 2:
              for (var i = 0; i < infoBebans8.length; i++) {
                infoBebans8[i].isSelect = false;
              }
              that.setData({
                infoBebans2: infoBebans8
              })
              break;
            default:

          }
        }
      }
    },
    fail: function (er) {
      console.log(er);
    }
  })
}