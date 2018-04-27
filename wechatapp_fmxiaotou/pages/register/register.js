var app=getApp();
Page({
    data:{
        v:'60',
        isvcode:true,
        phoneNumber:''
    },
    getPhone:function (e) {
        this.setData({
            phoneNumber:e.detail.value
        })
        // if(e.detail.value.length==11){
        //     this.setData({
        //         isyellow:'yellow'
        //     })
        //     console.log('isyelllow的值是true')
        // }
        // else {
        //     this.setData({
        //         isyellow:''
        //     })
        // }
        this.setData({
            vCode:e.detail.value
        })
        if(this.data.vCode.length==6 && this.data.phoneNumber.length==11){
            this.setData({
                isbangding:'yellow'
            })
        }else {
            this.setData({
                isbangding:''
            })
        }
    },
    getVcode:function (e) {
        this.setData({
            vCode:e.detail.value
        })
        if(this.data.vCode.length==6 && this.data.phoneNumber.length==11){
            this.setData({
                isbangding:'yellow'
            })
        }else {
            this.setData({
                isbangding:''
            })
        }
    },
    vcode:function () {
        var phoneNumber=this.data.phoneNumber;
        console.log(phoneNumber);
        if(phoneNumber.trim()==''){
            console.log('还没有输入手机号');
            wx.showToast({
                title: '请输入手机号',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        if(!(/^1[3|4|5|8|7|9][0-9]\d{4,8}$/.test(phoneNumber))){
            wx.showToast({
                title: '手机号码格式错误',
                icon: 'loading',
                duration: 2000
            })
            return;
        }
        var that=this;
        var count=this.data.v;
        wx.request({
            url:app.globalData.API[0]+'sentObtain',
            method: "POST",
            dataType: "json",
            data: {
                telephoneint:that.data.phoneNumber,
                type:1
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success:function (res) {
                console.log(res)
                if(res.data==1){

                }
                if(res.data=='该手机号已注册过'){
                    console.log('该手机号已注册过');
                    wx.showModal({
                        title: '',
                        content: '手机已注册过，请直接登录',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        });
        countDown(that,count);
    },
//    点击绑定
    toRegister:function () {
        var phoneNumber=this.data.phoneNumber;
        var vCode=this.data.vCode;
        var that=this;
        var userInfo=app.globalData.userInfomation;
        console.log(userInfo);
        console.log(userInfo.gender);
        if(phoneNumber.trim()==''){
            wx.showToast({
                title: '请输入手机号',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        if(vCode.trim()==''){
            wx.showToast({
                title: '请输入验证码',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        if(userInfo.gender==2){
            var sex=0       //女
        }
        if(userInfo.gender==1){
            var sex=1       //男
        }else{
            sex=2           //未识别的性别
        }
        wx.request({
            url:app.globalData.API[0]+'user/weiXinBindMobile',
            method: "POST",
            dataType: "json",
            data: {
                telepHoneint:phoneNumber,
                accountType:1,
                nickName:userInfo.nickName,
                code:vCode,
                passWord:null,
                sex:sex,
                headPhoto:userInfo.avatarUrl,
                openId:app.globalData.appid,
                type:1,
                unionId:app.globalData.unionId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success:function (res) {
                console.log('手机绑定成功');
                console.log(res)
                if(res.data.token){
                    app.globalData.token=res.data.token;//在手机绑定成功后即把后台返回的token保存下来
                    wx.redirectTo({
                        url:'/pages/myCenter/myCenter'
                    })
                    return;
                }
                if(res.data.statsMsg.msg=='验证码错误'){
                    console.log('验证码输入有误')
                    wx.showToast({
                        title: res.data.statsMsg.msg,
                        icon: 'loading',
                        duration: 2000
                    })
                    return;
                }

            }
        })
    },
//    倒计时渲染
    //倒计时60秒

})
function countDown(that,count) {
    if (count == 0) {
        that.setData({
           isvcode:true,
            v:60
        })
        return;
    }
    that.setData({
        isvcode:false,
        v: count,
    })
    console.log(that.data.isvcode);
    setTimeout(function(){
        count--;
        countDown(that, count);
    }, 1000);
}