# Kaiheila WebSocket 以及 V3 API 请求收发接口集合

## 使用示例：

### 安装：

```
npm i kaiheila-ws
```

### WebSocket (Bot)：

```JavaScript
import { KaiheilaWS } from 'kaiheila-ws'
let kaiheiws = new KaiheilaWS({
    type: "Bot",
    Bot: {
        token: ""
    }
})
kaiheiws.on("Message", r => { console.log(r) })
kaiheiws.connect()
```
### WebSocket (User)：

```JavaScript
import { KaiheilaWS } from 'kaiheila-ws'
let kaiheiws = new KaiheilaWS({
    type: "User",
    User: {
        auth: ""
    }
})
kaiheiws.on("Message", r => { console.log(r) })
kaiheiws.connect()
```

### 发送消息：
```JavaScript
kaiheiws.sendmsg("Hell yeah!", "8815380044828253")
```

### 接收机器人自身信息：
```JavaScript
kaiheiws.getme().then(r=>{console.log(r)})
```

### 接收机器人已加入的服务器：
```JavaScript
kaiheiws.getGuild().then(r=>{console.log(r)})
```

### 给予、移除用户对应的角色：
```JavaScript
// 给予角色
kaiheiws.setrole("7430659266664661", "3543259271", 40956, "Grant").then(r=>{console.log(r)})
// 移除角色
kaiheiws.setrole("7430659266664661", "3543259271", 40956, "Revoke").then(r=>{console.log(r)})
```