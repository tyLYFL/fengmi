var openid;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    v: '60',
    isvcode: true,
    vcode:'',
    array: [],
    delay:true,
    json:{},
    investPeople:"",
    wechatNumber:"",
    contactWay:"",
    amount:'',
    reservable:0,
    reservableNum:0,
    focusFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var json = JSON.parse(options.json);
    var copies = json.copies;//个人限投
    var reservePeopleNum = json.reservePeopleNum;
    var equityShareType = json.equityShareType;
    var yetReservePropleNum = json.yetReservePropleNum;//已有几人跟投

    if (reservePeopleNum==null){
      var RemainderNumber = copies  //剩余份数
    }else{
      var RemainderNumber = reservePeopleNum - yetReservePropleNum  //剩余份数
    }
    

    console.log(RemainderNumber);

    if (equityShareType == 1) {

      that.setData({
        amount: 1
      })

    }

    if (RemainderNumber > copies){

      var reservableNum = copies - that.data.amount;
      that.setData({
        reservable: "剩余总数" + copies + "份",
        reservableNum: reservableNum
      })

    }else{

      var reservableNum = RemainderNumber - that.data.amount;
      that.setData({
        reservable: "剩余总数" + RemainderNumber + "份",
        reservableNum: reservableNum
      })
    

    }
    if (reservePeopleNum == null || reservePeopleNum == 'null') {
      that.setData({
        reservable: "剩余总数无限份"
      })
      that.setData({
        reservableNum: copies - that.data.amount
      })
    }

    var array1  = [];
    for(var i=0;i<copies;i++){

        array1.push(i+1);
    }

    that.setData({
      json: json,
      array: array1
      
    })
    console.log(that.data.json);
  },
  //获取用户输入的验证码
  getCodeNum:function(e){
    console.log(e)
    var value = e.detail.value;
    console.log(value)
    this.setData({
      vcode:value
    })
    console.log(this.data.vcode)
  },
  //发送验证码
  vcode: function () {
    var phoneNumber = this.data.contactWay;
    var count = this.data.v;
    console.log(phoneNumber);
    if (phoneNumber== '') {
      console.log('还没有输入手机号');
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(phoneNumber))) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this;
    var count = this.data.v;
    wx.request({
      url: app.globalData.API[0] + 'sentObtain',
      method: "POST",
      dataType: "json",
      data: {
        telephoneint: phoneNumber,
        type: 8
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res)
        if (res.data == 1) {
            that.setData({
              focusFlag:true,
              isvcode:false
            })
            countDown(that, count);
        }
      }
    });
    countDown(that, count);
  },
  //picker选择器发生变化处理
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;

    var amountArry = this.data.array[index];
    var json2 = this.data.json; 
    json2.totalFee = json2.totalFee * amountArry
    this.setData({
      amount: amountArry,
      json:json2
    })
  },

  //加变化计算
  changejiaNum:function(){
    var amount = this.data.amount;
    var reservableNum = this.data.reservableNum;
    var jsoncopies =this.data.json;

    if (jsoncopies.reservePeopleNum == null) {
      var RemainderNumber = jsoncopies.copies  //剩余份数
    } else {
      var RemainderNumber = jsoncopies.reservePeopleNum - jsoncopies.yetReservePropleNum  //剩余份数
    }
   

    if (jsoncopies.copies > RemainderNumber){
      var jsoncopiesNum = RemainderNumber
    }else{
        var jsoncopiesNum = jsoncopies.copies
    }

      amount++;
      reservableNum--;
      if (amount > jsoncopiesNum){
        amount = jsoncopiesNum;
      }
      if (reservableNum < 0) {
        reservableNum = 0;
      }
      this.setData({
        amount: amount,
        reservableNum: reservableNum
      })
  },

  //减号
  changejianNum: function () {
    var amount = this.data.amount;
    var reservableNum = this.data.reservableNum;
    var jsoncopies = this.data.json;

    if (jsoncopies.reservePeopleNum == null) {
      var RemainderNumber = jsoncopies.copies  //剩余份数
    } else {
      var RemainderNumber = jsoncopies.reservePeopleNum - jsoncopies.yetReservePropleNum  //剩余份数
    }

    if (jsoncopies.copies > RemainderNumber) {
      var jsoncopiesNum = RemainderNumber
    } else {
      var jsoncopiesNum = jsoncopies.copies
    }

    amount--;
    reservableNum++;
    if (amount<1){
      amount = 1;
    }
    if (reservableNum > jsoncopiesNum-1) {
      reservableNum = jsoncopiesNum-1;
    }
    this.setData({
      amount:amount,
      reservableNum: reservableNum
    })
  },
  //获取项目投资人
  getinvestPeople:function(e){
    var investName = e.detail.value;

    this.setData({
      investPeople: investName
    })
  },
  getwechatNumber: function (e) {
    var wechatNumber = e.detail.value;

    this.setData({
      wechatNumber: wechatNumber
    })
  },
  getcontactWay: function (e) {
    var contactWay = e.detail.value;
    this.setData({
      contactWay: contactWay
    })
  },
  //投资金额
  getamount: function (e) {
      var amount1 = e.detail.value;
      if (/^[0]\d*$/.test(amount1)) {
        return  amount1.replace(/^[0]\d*$/gi, '');
      }
      this.setData({
        amount: amount1
      })
  },
  //提交订单
  findByOrderSavenFn: function () {
    var that = this;
    console.log("提交订单")
    //orderType为1时必传，投资类型为1 则为份额数，为2则为入股金额（万）
    var amount = that.data.amount;
    var contactWay = that.data.contactWay;
    var wechatNumber = that.data.wechatNumber;
    var investPeople = that.data.investPeople;
    if (amount == "") {
      wx.showToast({
        title: '请输入投资金额'
      })
      return false;
    }
    if (investPeople == "") {
       wx.showToast({
        title: '请输入跟投人姓名'
      })
      return false;
    }
    if (wechatNumber == "") {
      wx.showToast({
        title: '请输入微信号'
      })
      return false;
    }
    if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(contactWay))) {
      wx.showToast({
        title: '请输入正确手机号'
      })
      return false;
    }
    this.setData({
      delay: false
    })
    setTimeout(function () {
      that.setData({
        delay: true
      })
    }, 2000);
    
    //点击确认请求后端

    var jsonInfo = that.data.json;
    var investId = jsonInfo.investId;
    var totalFee = jsonInfo.totalFee;
    var equityShareType = jsonInfo.equityShareType;//投资股权份额类型：1按照名额，2按照股权金额

    var id = jsonInfo.id;
    var code = that.data.vcode//验证码

    if (investId == null || investId == undefined || investId == 'null' || investId == "undefined" || investId == "") {
      return false;
    }

    if (totalFee == null || totalFee == undefined || totalFee == 'null' || totalFee == "undefined" || totalFee == "") {
      return false;
    }
   
    if (code == null || code == undefined || code == 'null' || code == "undefined" || code == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return false;
    }
    var param = {
      tokenId: app.globalData.token,
      code: code,//获取验证码
      investId: investId,//项目id
      rewardId: id,//投资回报率id
      amount: amount,//股权份数 或 投资金额
      shareType: equityShareType,//投资股权份额类型：1按照名额，2按照股权金额
      investPeople: investPeople,//跟投人名称
      wechatNumber: wechatNumber,//微信号
      contactWay: contactWay//电话
    }
    wx.request({
      url: app.globalData.API[0] + 'invest/saveInvestProjectFollow',
      method: "POST",
      dataType: "json",
      data: param,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log('确认股份', res);
        var stats = res.data.statsMsg.stats;
        var msg = res.data.statsMsg.msg;
        if (stats == "1") {
          wx.showToast({
            title: '已认购',
            icon: 'none'
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../InvestProjectfollow/InvestProjectfollow?queryType=1',
            })
          },1000)
          
        } else {
          wx.showToast({
            title: msg,
            icon:'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.data);
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
  
  }
})

function countDown(that, count) {
  if (count == 0) {
    that.setData({
      isvcode: true,
      v: 60
    })
    return;
  }
  that.setData({
    isvcode: false,
    v: count,
  })
  
  setTimeout(function () {
    count--;
    countDown(that, count);
  }, 1000);
}