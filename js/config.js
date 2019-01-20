var hostname = 'www.chenhao-home.cn', //'192.168.1.2',
    port = 8083,
    clientId = rnd_num(6).toString(),
    timeout = 5,
    keepAlive = 100,
    cleanSession = false,
    ssl = false,
    userName = 'chenhao',  
    password = '****************',  
    topic = '/led';
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
//连接服务器并注册连接成功处理事件  
function onConnect() {
    console.log("onConnected");
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnected()}";
    console.log(s);
    client.subscribe(topic);
}

client.onConnectionLost = onConnectionLost;

//注册连接断开处理事件  
client.onMessageArrived = onMessageArrived;

//注册消息接收处理事件  
function onConnectionLost(responseObject) {
    console.log(responseObject);
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnectionLost()}";
    console.log(s);
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        console.log("连接已断开");
    }
}

function onMessageArrived(message) {
    s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onMessageArrived()}";
    console.log(s);
    console.log("收到消息:" + message.payloadString);
}

function send(msg, idx) {
    if (msg, idx) {
        var ploadData={
        "time": new Date().Format("yyyy-MM-dd hh:mm:ss"),
        "switchType" : msg,
        "idx":idx
        }
        var jsonData=JSON.stringify(ploadData);
        console.log("request data="+jsonData)
        message = new Paho.MQTT.Message(jsonData);
        message.destinationName = topic;
        client.send(message);
    }
}
// 判断隐藏input值，然后根据隐藏input的value值，达到开关的目的
function click_val(id){
    var hidden_val = document.getElementById(id).value;//获取隐藏的input的值
    if(hidden_val=="off"){
        num = "on";
        document.getElementById(id).value = num;}
    else{
        num = "off";
        document.getElementById(id).value = num;}
    return(num);
}

function click_id(obj){
    return(obj.id)
}

function data_time(){
    var headtime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    document.getElementById("head-time").innerHTML = headtime;
}

//产生随机数函数,用于clientID.
function rnd_num(n){
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}

document.addEventListener("DOMContentLoaded", function(event) {
    var temp_1 = new JustGage({
        id: "temp-1",
        title: "卧室温度",
        width:165,
        height:200,
        value: 25, //当前温度值
        min: -40, //最小温度值
        max: 60, //最大温度值
        humanFriendly: false,
        decimals: 2, //
        symbol: '℃', //单位
        gaugeWidthScale: 0.5, //温度表宽度
        titleFontColor: "#24C48E", //标题颜色
        titleFontFamily: "Microsoft YaHei", //标题字体
        // titlePosition: "below", //标题向下显示
        valueFontColor: "#24C48E", //温度值颜色
        valueFontFamily: "Microsoft YaHei", //温度值字体
        customSectors: [{
            color: '#CE685C',
            lo: -40,
            hi: 15
          }, {
            color: '#24C48E',
            lo: 16,
            hi: 60
          }], //温度区间颜色
          counter: true
    });
    var temp_2 = new JustGage({
        id: "temp-2",
        title: "客厅温度",
        width:165,
        height:200,
        value: 15.34, //当前温度值
        min: -40, //最小温度值
        max: 60, //最大温度值
        humanFriendly: false,
        decimals: 2, //小数点后保留
        symbol: '℃', //单位
        gaugeWidthScale: 0.5, //温度表宽度
        titleFontColor: "#24C48E", //标题颜色
        titleFontFamily: "Microsoft YaHei", //标题字体
        // titlePosition: "below", //标题向下显示
        valueFontColor: "#24C48E", //温度值颜色
        valueFontFamily: "Microsoft YaHei", //温度值字体
        customSectors: [{
            color: '#CE685C',
            lo: -40,
            hi: 15
          }, {
            color: '#24C48E',
            lo: 16,
            hi: 60
          }], //温度区间颜色
          counter: true
    });
});

setInterval("data_time()",1000);

var count = 0;

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
