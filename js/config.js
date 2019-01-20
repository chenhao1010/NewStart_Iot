var hostname = 'www.chenhao-home.cn',
    port = 8083,
    clientId = rnd_num(12),
    timeout = 5,
    keepAlive = 100,
    cleanSession = false,
    ssl = false,
    userName = 'chenhao',  
    password = '*******************',  
    topic = '/led';

//定时器
setInterval("data_time()", 1000);
var count = 0;


var temp1Obj={};
var temp2Obj={};
var temp3Obj={};
var temp4Obj={};
var hum1Obj={};
var hum2Obj={};
var hum3Obj={};
var hum4Obj={};
//存在对象
var map ={}



document.addEventListener("DOMContentLoaded", function(event) {
    var temp_list = {
        width:165,
        height:200,
        min: -40, //最小温度值
        max: 60, //最大温度值
        humanFriendly: false,
        decimals: 2, //小数点保留两位
        symbol: '℃', //单位
        gaugeWidthScale: 0.5, //温度表宽度
        titleFontColor: "#24C48E", //标题颜色
        titleFontFamily:"mFont",
        // titlePosition: "below", //标题向下显示
        valueFontColor: "#24C48E", //温度值颜色
        valueFontFamily:"mFont",
        customSectors: [{
            color: '#CE685C',
            lo: -40,
            hi: 15
          }, {
            color: '#24C48E',
            lo: 16,
            hi: 27
          },{
            color: '#CE685C',
            lo: 28,
            hi: 60
          }],
            counter: true
      }

      var hum_list = {
        width:165,
        height:200,
        min: 0,
        max: 100,
        donut: true,
        // humanFriendly: false,
        gaugeWidthScale: 0.5,
        relativeGaugeSize: false,
        decimals: 2, //小数点保留两位
        symbol: '%', //单位
        hideInnerShadow: true,
        titleFontColor: "#24C48E", //标题颜色
        titleFontFamily:"mFont",
        valueFontColor: "#24C48E", //温度值颜色
        valueFontFamily:"mFont",
        customSectors: [{
            color: '#CE685C',
            lo: 0,
            hi: 15
          }, {
            color: '#24C48E',
            lo: 16,
            hi: 60
          },{
            color: '#CE685C',
            lo: 61,
            hi: 100
          }],
            counter: true
      }

    temp1Obj = new JustGage({
        id: "temp-1",
        value: NaN, //当前温度值
        defaults: temp_list,
    });
    temp2Obj = new JustGage({
        id: "temp-2",
        value: NaN, //当前温度值
        defaults: temp_list,
    });
    temp3Obj = new JustGage({
        id: "temp-3",
        value: NaN, //当前温度值
        defaults: temp_list,
    });
    temp4Obj = new JustGage({
        id: "temp-4",
        value: NaN, //当前温度值
        defaults: temp_list,
    });

    hum1Obj = new JustGage({
        id: 'hum-1',
        value: NaN,
        defaults: hum_list,
      });
    hum2Obj = new JustGage({
        id: 'hum-2',
        value: NaN,
        defaults: hum_list,
      });
    hum3Obj = new JustGage({
        id: 'hum-3',
        value: NaN,
        defaults: hum_list,
      });
    hum4Obj = new JustGage({
        id: 'hum-4',
        value: NaN,
        defaults: hum_list,
      });

    //设置对象引用库
    map["temp-1"]=temp1Obj;
    map["temp-2"]=temp2Obj;
    map["temp-3"]=temp3Obj;
    map["temp-4"]=temp4Obj;
    map["hum-1"]=hum1Obj;
    map["hum-2"]=hum2Obj;
    map["hum-3"]=hum3Obj;
    map["hum-4"]=hum4Obj;
    //初始化连接
    initMqttClient();

});

function initMqttClient(temp_1){
    client = new Paho.MQTT.Client(hostname, port, clientId);
    //建立客户端实例  
    var options = {
        invocationContext: {
            host: hostname,
            port: port,
            path: client.path,
            clientId: clientId
        },
        timeout: timeout,
        keepAliveInterval: keepAlive,
        cleanSession: cleanSession,
        useSSL: ssl,
        userName: userName,  
        password: password,  
        onSuccess: onConnect,
        onFailure: function (e) {
            console.log(e);
            s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
            console.log(s);
        }
    };

    client.connect(options);
    client.onConnectionLost = onConnectionLost;
    //注册连接断开处理事件  
    client.onMessageArrived = onMessageArrived;
}

//连接服务器并注册连接成功处理事件  
function onConnect() {
    console.log("onConnected");
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnected()}";
    // console.log(s);
    client.subscribe(topic);
}

function send(msg, idx) {
    if (msg, idx) {
        var ploadData = {
        "time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
        "switchType" : msg,
        "idx":idx
        }
        var jsonData = JSON.stringify(ploadData);
        console.log("request data="+jsonData)
        message = new Paho.MQTT.Message(jsonData);
        message.destinationName = topic;
        client.send(message);
    }
}

function onMessageArrived(message) {
    var ploadData = new Date().Format("yyyy-MM-dd hh:mm:ss")
    // 解析服务器发来的JSON数据
    obj = JSON.parse(message.payloadString)
    var id = obj.idx;
    if(id.indexOf("sw") > -1){
        console.log("收到消息：" + message.payloadString)
    }
    else{
        var temp = obj.temp;
    var hum = obj.hum;
    var tempKey="temp-"+id;
    var humKey="hum-"+id;
    map[tempKey].refresh(parseInt(temp));
    map[humKey].refresh(parseInt(hum));
    console.log("time:"+ ploadData + "," + "收到消息:" + "id: " + id + "温度: "+ temp + "湿度: " + hum);
    } 
}

// 注册消息接收处理事件  
function onConnectionLost(responseObject) {
    console.log(responseObject);
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnectionLost()}";
    console.log(s);
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        console.log("连接已断开");
    }
}


// 判断隐藏input值，然后根据隐藏input的value值，达到开关的目的
function click_val(id) {
    var hidden_val = document.getElementById(id).value;//获取隐藏的input的值
    if(hidden_val=="off"){
        num = "on";
        document.getElementById(id).value = num;}
    else{
        num = "off";
        document.getElementById(id).value = num;}
    return(num);
}

function click_id(obj) {
    return(obj.id)
}

function data_time() {
    var headtime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    document.getElementById("head-time").innerHTML = headtime;
}

//产生随机数函数,用于clientID.
function rnd_num(n) {
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}


Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
            k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
