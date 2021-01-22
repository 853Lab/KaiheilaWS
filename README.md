# Kaiheila WebSocket 以及 V2 V3 API 请求收发接口集合

## 使用示例：

### WebSocket (v3)：

```JavaScript
import { KaiheilaWS } from './index.js'
let kaiheiws = new KaiheilaWS({
    ver: 3,
    v3: {
        token: ""
    }
})
kaiheiws.on("Message", r => { console.log(r) })
kaiheiws.connect()
```

### WebSocket (v2)：

```JavaScript
import { KaiheilaWS } from './index.js'
let kaiheiws = new KaiheilaWS({
    ver: 2,
    v2: {
        auth: "",
        token: ""
    }
})
kaiheiws.on("Message", r => { console.log(r) })
kaiheiws.connect()
```

### 发送消息：(v3、v2)：
```JavaScript
kaiheiws.sendmsg("Hell yeah!", "8815380044828253")
```

### 接收机器人自身信息：(v3、v2)：
```JavaScript
kaiheiws.getme().then(r=>{console.log(r)})
```

### 接收机器人已加入的服务器：(v3、v2)：
```JavaScript
kaiheiws.getGuild().then(r=>{console.log(r)})
```

### 给予、移除用户对应的角色：(v3、v2)：
```JavaScript
// 给予角色
kaiheiws.setrole("7430659266664661", "3543259271", 40956, "Grant").then(r=>{console.log(r)})
// 移除角色
kaiheiws.setrole("7430659266664661", "3543259271", 40956, "Revoke").then(r=>{console.log(r)})
```