export default class SSE {
    constructor(url, msgCallback, name = 'default') {
        this.url = url;
        this.msgCallback = msgCallback;
        this.name = name;
        this.ws = null; // websocket对象
        this.status = null; // websocket是否关闭
    }
    create(options) {
        // 处理参数
        var param = tool.initParam(options),
            sendData = '';

        // 是否有url传值
        if (param.data) {
            tool.each(param.data, function (item, index) {
                sendData += (index + "=" + item + "&")
            });
            sendData = sendData.slice(0, -1);
        }
        // 与服务器建立http通道
        var es = new EventSource(param.url + '?' + sendData);

        // 建立默认事件监听：打开、获得消息、错误
        es.addEventListener('open', function (e) {
            param.openEvent(e)
        });

        es.addEventListener('message', function (e) {
            param.messageEvent(e)
        });

        es.addEventListener('error', function (e) {
            param.errorEvent(e)
            es.close() // 关闭连接
        });

        // 创建用户自定义事件
        // if (param.customEvent.length > 0) {
        //     tool.each(param.customEvent, function (item) {
        //         es.addEventListener(item.name, item.callback);
        //     })
        // }
    }