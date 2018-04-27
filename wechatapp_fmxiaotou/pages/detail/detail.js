const app = getApp();
const util = require('../../utils/util.js');
var interval;
var varName;
var investId;
Page({
  data:{
    canIUse: wx.canIUse('web-view'),
    project:{},
    isShowRoadshowGroupBox:false,
    scrollTop: 0,
    toView: 'my0',
    current:'0',
    src:"",
    offsetTop:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that =this;
    var id = options.id;
    console.log(id)
    console.log(app.globalData.token)
    // wx.showLoading({
    //   title: app.globalData.token,
    // })
    if (app.globalData.token){
      console.log(11)
      var src = app.globalData.API[1] + 'fm-html5/FMAPP/detail/html/WechatDetail.html?id=' + id + '&tokenId=' + app.globalData.token + '&fg=#wechat_redirect'
    }else{
      console.log(22)
      var src = app.globalData.API[1] + 'fm-html5/FMAPP/detail/html/WechatDetail.html?id=' + id + '&tokenId=&fg=#wechat_redirect'

    }
  console.log(src)
    that.setData({
      src: src
    });
  
    //reqdetailData(that);
    //this.queryMultipleNodes();
  },
  getMsg:function(e){
      wx.downloadFile({
        url: 'http://7xoor9.com1.z0.glb.clouddn.com/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F.pdf',
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
  },
   /*
    查询节点的信息
  */
  queryMultipleNodes: function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('#my0').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // #the-id节点的上边界坐标
      // 显示区域的竖直滚动位置
      console.log(res[0].top)
      that.data.offsetTop.push(res[0].top);
      that.setData({
        offsetTop: that.data.offsetTop
      })
    })

    var query = wx.createSelectorQuery()
    query.select('#my1').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // #the-id节点的上边界坐标
      // 显示区域的竖直滚动位置
      console.log(res[0].top)
      that.data.offsetTop.push(res[0].top);
      that.setData({
        offsetTop: that.data.offsetTop
      })
    })

    var query = wx.createSelectorQuery()
    query.select('#my2').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // #the-id节点的上边界坐标
      // 显示区域的竖直滚动位置
      console.log(res[0].top)
      that.data.offsetTop.push(res[0].top);
      that.setData({
        offsetTop: that.data.offsetTop
      })
    })

    var query = wx.createSelectorQuery()
    query.select('#my3').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // #the-id节点的上边界坐标
      // 显示区域的竖直滚动位置
      console.log(res[0].top)
      that.data.offsetTop.push(res[0].top);
      that.setData({
        offsetTop: that.data.offsetTop
      })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options.webViewUrl)
  }
})