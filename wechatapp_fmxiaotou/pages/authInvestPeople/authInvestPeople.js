Page({
  data: {
    way:'',
    date:'',
    type:'种子轮',
    money:'RMB￥',
    wayArry:['电商','社交'],
    moneyArry:['RMB￥','US$'],
    investTypeArry:['种子轮','天使轮'],
    isAuthenFlag:0
  },
  //picker选择器发生变化处理
  wayPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;
    var wayArry = this.data.wayArry[index];
    this.setData({
      way: wayArry
    })
  },
  datePickerChange:function(e){
    var date = e.detail.value;
    this.setData({
      date: date
    })
  },
  moneyTypePickerChange:function(e){
    var index = e.detail.value;
    var moneyArry = this.data.moneyArry[index];
    this.setData({
      money: moneyArry
    })
  },
  TypePickerChange:function(e){
    var index = e.detail.value;
    var investTypeArry = this.data.investTypeArry[index];
    this.setData({
      type: investTypeArry
    })
  },
  /**
   *调到认证投资人页面
   */
  authNext:function(e){
    console.log(e);
    var investTotalNum = e.detail.value.investTotalNum;
    var historyTotalNum = e.detail.value.historyTotalNum;
    var OutTotalNum = e.detail.value.OutTotalNum;
    var investName = e.detail.value.investName;
    var investWay = e.detail.value.investWay;
    var investDate = e.detail.value.investDate;
    var investMoney = e.detail.value.investMoney;
    var investMoneyType = e.detail.value.investMoneyType;
    
    var investType = e.detail.value.investType || this.data.type;
    var investReturn = e.detail.value.investReturn;
    // if ('' == investTotalNum){
    //   wx.showToast({
    //     title: '投资总数没填',
    //   })
    //   return false;
    // }
    // if ('' == historyTotalNum) {
    //   wx.showToast({
    //     title: '历史总额没填',
    //   })
    //   return false;
    // }
    // if ('' == OutTotalNum) {
    //   wx.showToast({
    //     title: '退出总数没填',
    //   })
    //   return false;
    // }

    // if ('' == investName) {
    //   wx.showToast({
    //     title: '项目名称没填',
    //   })
    //   return false;
    // }
    // if ('' == investWay) {
    //   wx.showToast({
    //     title: '行业没选择',
    //   })
    //   return false;
    // }
    // if ('' == investDate) {
    //   wx.showToast({
    //     title: '时间没选择',
    //   })
    //   return false;
    // }
    // if ('' == investMoney) {
    //   wx.showToast({
    //     title: '投资金额没填',
    //   })
    //   return false;
    // }
    // if ('' == investMoneyType) {
    //   wx.showToast({
    //     title: '投资金额类型没选中',
    //   })
    //   return false;
    // }
    // if ('' == investType) {
    //   wx.showToast({
    //     title: '投资轮次没填',
    //   })
    //   return false;
    // }
    // if ('' == investReturn) {
    //   wx.showToast({
    //     title: '投资回报没填',
    //   })
    //   return false;
    // }
    var investPeopleJson = {
      investTotalNum : investTotalNum,
      historyTotalNum : historyTotalNum,
      OutTotalNum : OutTotalNum,
      investName: investName,
      investWay: investWay,
      investDate: investDate,
      investMoney: investMoney,
      investMoneyType: investMoneyType,
      investType: investType,
      investReturn: investReturn
    }
    var investPeopleJsonStr = JSON.stringify(investPeopleJson);
    wx.redirectTo({
      url: '../uploadCertification/uploadCertification?investPeopleJsonStr=' + investPeopleJsonStr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isAuthenFlag =  wx.getStorageSync('isAuthenFlag');
    this.setData({
      isAuthenFlag: isAuthenFlag
    })
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