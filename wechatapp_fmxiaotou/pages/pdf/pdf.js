const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    fileId:'',
    filename:'项目商业计划书',
    isFollow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id:options.id,
      fileId: options.fileId,
      filename: options.filename,
      isFollow: options.isFollow
    })
  },
  seePdf:function(){
    var that = this;
    if (that.data.isFollow==1){
      wx.downloadFile({
        url: app.globalData.API[0] + 'invest/Filebrowse?fileId=' + that.data.fileId,
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
    }else{
      wx.showToast({
        title: '预约跟投后可查看商业计划书',
        icon: 'none',
      })
    }
  }
})