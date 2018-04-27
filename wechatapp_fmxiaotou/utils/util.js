//获取应用实例
const app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return formatNumber(year) + '年' + formatNumber(month) + "月" + formatNumber(day)+"日"
}

const formatTime3 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return formatNumber(year) + '-' + formatNumber(month) + "-" + formatNumber(day);
}

//计算剩余的天数
function dateCount(oldDay) {
  //取当前的时间
  var nowDate = new Date();

  var NDs = nowDate.getTime();

  //设置将来的时间毫秒数

  var FTs = oldDay

  var timerDiff = FTs - NDs;

  var diffDate = new Date(timerDiff);
  //计算出相差天数  
  var days = Math.floor(diffDate / (24 * 3600 * 1000))

  //计算出小时数  

  var leave1 = diffDate % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  

  var hours = Math.floor(leave1 / (3600 * 1000))

  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000))

  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);

  if (days > 0) {

    var back = "剩余" + days+"天";

  } else if (hours > 0) {

    var back = "剩余1天";

  } else if (minutes > 0) {

    back = '剩余1天';

  } else if (seconds > 0) {

    back = '剩余1天';

  } else if (seconds <= 0) {

    back = '已结束';

  }
  return back;
}

//计算剩余的天数
function dateCount2(oldDay) {
  //取当前的时间
  var nowDate = new Date();

  var NDs = nowDate.getTime();

  //设置将来的时间毫秒数

  var FTs = oldDay

  var timerDiff = FTs - NDs;

  var diffDate = new Date(timerDiff);
  //计算出相差天数  
  var days = Math.floor(diffDate / (24 * 3600 * 1000))

  //计算出小时数  

  var leave1 = diffDate % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  

  var hours = Math.floor(leave1 / (3600 * 1000))

  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000))

  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);

  if (days > 0) {

    var back = "剩余" + days + "天";

  } else if (hours > 0) {

    var back = "剩余1天";

  } else if (minutes > 0) {

    back = '剩余1天';

  } else if (seconds > 0) {

    back = '剩余1天';

  } else if (seconds <= 0) {

    back = '已到期';

  }
  return back;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//设置底部的消息数量
const setCounts = obj =>{

  console.log(obj)
  let {
    msg,
    msgCount
    } = obj;

  let {
        dataForTabbar
  } = app.globalData;

  let data = dataForTabbar.map((item) => {
    let {
      iCount,
      sIconUrl,
      sTitle
        } = item;
    if (sTitle === msg) {
      iCount = msgCount;
      
      console.log(iCount);
    }
    return {
      iCount,
      sIconUrl,
      sTitle
    };
  });
  console.log(data);
  app.globalData.dataForTabbar=data;
  console.log(app.globalData.dataForTabbar)
}

//设置底部的图标
const settabImg = obj=>{
  let {
    key
  } = obj;

  let {
    dataForTabbar
  } = app.globalData;

  switch (key){
    case 0:
      dataForTabbar[0].sIconUrl = Img("tabbar_invest_icon_s@2x"); //按钮图标
      dataForTabbar[1].sIconUrl = Img("tabbar_news_icon_n@2x");
      dataForTabbar[2].sIconUrl = Img("tabbar_mine_icon_n@2x");
      break;
    case 1:
      dataForTabbar[0].sIconUrl = Img("tabbar_invest_icon_n@2x"); //按钮图标
      dataForTabbar[1].sIconUrl = Img("tabbar_news_icon_s@2x");
      dataForTabbar[2].sIconUrl = Img("tabbar_mine_icon_n@2x");
      break;
    case 2:
      dataForTabbar[0].sIconUrl = Img("tabbar_invest_icon_n@2x"); //按钮图标
      dataForTabbar[1].sIconUrl = Img("tabbar_news_icon_n@2x");
      dataForTabbar[2].sIconUrl = Img("tabbar_mine_icon_s@2x");
      break;

    default:
      break;
  }
}

//设置底部的图标
const setmsg = obj => {
  let {
    msgCount
  } = obj;
 
  console.log({msgCount})
  let {
    dataForTabbar
  } = app.globalData;
  dataForTabbar[1].iCount = msgCount;
}


//计算时间戳月日展示
function dateCount3(Daycount, day) {
  var newDate = new Date();
  newDate.setTime(Daycount);
  var date1 = newDate.toLocaleDateString();
  var datasplit = date1.split("/")
  var out = ''
  if (day) {
    out = datasplit[1] + '月' + datasplit[2] + '日'
  }
  else {
    out = datasplit[2] + '日'
  }
  return out;
}

// 生成img文件的目录
function Img(filename, state) {
  //定义img文件所在的文件夹
  const IMG_FILES_FOLDER = "../../images/tabBar/";
  //定义img文件的后缀
  const SUBFIX = ".png";
  //数组转换字符串
  if (state === undefined) {

    return [
      IMG_FILES_FOLDER,
      filename,
      SUBFIX
    ].join("");

  }
  //数组转换字符串并用-做分割
  else {
    return [
      IMG_FILES_FOLDER,
      filename,
      "-",
      state,
      SUBFIX
    ].join("");
  }
}


/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}


module.exports = {
  formatTime: formatTime,
  formatTime2:formatTime2,
  formatTime3: formatTime3,
  setCounts:setCounts,
  settabImg: settabImg,
  dateCount: dateCount,
  setmsg: setmsg,
  promisify: wxPromisify,
  dateCount2: dateCount2,
  dateCount3: dateCount3,
}
