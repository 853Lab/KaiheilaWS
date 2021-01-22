"use strict"
// const [{ EventEmitter }, axios, WebSocket, pako, { Json }] = [require('events'), require('axios'), require('ws'), require('pako'), require('./init.js')]
import { EventEmitter } from 'events'
import axios from 'axios'
import WebSocket from 'ws'
import pako from 'pako'
import { Json, JtC } from './init.js'
class Config {
    ver = 3
    get ver3() {
        return this.ver === 3
    }
    set ver3(t) {
        if (t === true) this.ver = 3
        return t
    }
    get ver2() {
        return this.ver === 2
    }
    set ver2(t) {
        if (t === true) this.ver = 2
        return t
    }
    // get auth() {
    //     return this.v2.auth
    // }
    // set auth(t) {
    //     return this.v2.auth = t
    // }
    // get token() {
    //     return this.ver3 ? this.v3.token : this.v2.token
    // }
    // set token(t) {
    //     return this.ver3 ? this.v3.token = t : this.v2.token = t
    // }
    v2 = {
        auth: "",
        token: ""
    }
    v3 = {
        token: ""
    }
}
class UserInfo {
    accompaniment = false
    audio_setting = ""
    auth_info = []
    auto_exit_audio_channel = false
    avatar = ""
    bot = true
    chat_setting = ""
    client_id = ""
    enable_desktop_notification = false
    friend_setting = {
        all: false,
        same_friend: false,
        guild_member: false
    }
    id = ""
    identify_num = ""
    invited_count = ""
    mobile = ""
    mobile_prefix = ""
    mobile_verified = false
    need_guide = false
    online = false
    os = ""
    privacy_game_activity = 0
    privacy_music_activity = 0
    status = 0
    tag_info = {
        color: "",
        text: ""
    }
    username = ""
}
class KaiheilaAPI {
    url = "https://kaiheila.cn/api/"
    me = {
        v2: "/user/user-state",
        v3: "/user/me"
    }
    gateway = {
        v2: "/user/user-state",
        v3: "/gateway/index"
    }
    guild = {
        v2: "/guilds",
        v3: "/guild"
    }
}
class Guild {
    id = ""
    name = ""
    topic = ""
    user_id = ""
    is_master = false
    icon = ""
    invite_enabled = 0
    notify_type = 0
    region = ""
    enable_open = 0
    open_id = 0
    default_channel_id = ""
    default_channel_id_setting = ""
    welcome_channel_id = ""
    ws_type = 0
    roles = [{
        "role_id": 0,
        "name": "@全体成员",
        "color": 0,
        "hoist": 0,
        "mentionable": 0,
        "permissions": 147642880
    }]
    channels = [{
        "id": "",
        "name": "",
        "user_id": "",
        "guild_id": "",
        "voice_quality": "",
        "limit_amount": 0,
        "is_category": 0,
        "is_readonly": false,
        "parent_id": "",
        "is_private": false,
        "server_type": 0,
        "server_url": "",
        "level": 0,
        "slow_mode": 0,
        "topic": "",
        "is_master": false,
        "type": 0,
        "permission_overwrites": [{
            "role_id": 0,
            "allow": 0,
            "deny": 0
        }],
        "permission_users": [],
        "permission_sync": 0
    }, {
        "id": "",
        "name": "",
        "guild_id": "",
        "is_category": 0,
        "is_master": false,
        "level": 0,
        "type": 0,
        "permission_overwrites": [{
            "role_id": 0,
            "allow": 0,
            "deny": 0
        }],
        "permission_users": [],
        "channels": [{
            "id": "",
            "name": "",
            "user_id": "",
            "guild_id": "",
            "voice_quality": "",
            "limit_amount": 0,
            "is_category": 0,
            "is_readonly": false,
            "parent_id": "",
            "is_private": false,
            "server_type": 0,
            "server_url": "",
            "level": 0,
            "slow_mode": 0,
            "topic": "",
            "is_master": false,
            "type": 0,
            "permission_overwrites": [{
                "role_id": 0,
                "allow": 0,
                "deny": 0
            }],
            "permission_users": [],
            "permission_sync": 0
        }]
    }, {
        "id": "",
        "name": "",
        "guild_id": "",
        "is_category": 0,
        "is_master": false,
        "level": 0,
        "type": 0,
        "permission_overwrites": [{
            "role_id": 0,
            "allow": 0,
            "deny": 0
        }],
        "permission_users": [],
        "channels": [{
            "id": "",
            "name": "",
            "user_id": "",
            "guild_id": "",
            "voice_quality": "",
            "limit_amount": 0,
            "is_category": 0,
            "is_readonly": false,
            "parent_id": "",
            "is_private": false,
            "server_type": 0,
            "server_url": "",
            "level": 0,
            "slow_mode": 0,
            "topic": "",
            "is_master": false,
            "type": 0,
            "permission_overwrites": [{
                "role_id": 0,
                "allow": 0,
                "deny": 0
            }],
            "permission_users": [],
            "permission_sync": 0
        }]
    }]
    user_notify_type = 0
    emojis = [{
        "id": "7430659266664661/c0e7cbda915e170e80e8",
        "name": "好耶"
    }, {
        "id": "7430659266664661/e067406176c8fe0e80e8",
        "name": "问号"
    }, {
        "id": "7430659266664661/0422a415bec09d01e01e",
        "name": "哇哦"
    }, {
        "id": "7430659266664661/bf5a010b11e96206w072",
        "name": "Party853"
    }]
    my_roles = [0]
    my_nickname = ""
    recommend_info = {
        "guild_id": "",
        "open_id": "",
        "default_channel_id": "",
        "name": "",
        "icon": "",
        "banner": "",
        "desc": "",
        "status": 0,
        "tag": ""
    }
}
class KaiheilaWsRequest {
    ws
    realclose = true
    sn = 0
    sessionId = ""
    wsInterval
    retryhb = 0
    sendheartbeat() {
        if (this.retryhb > 2) {
            this.realclose = false
            return this.ws.close()
        }
        let j = {
            s: 2,
            sn: this.sn
        }
        try {
            this.ws.send(Json.stringify(j))
        } catch (e) {
            console.log(e)
        }
        let time = 6000
        switch (this.retryhb) {
            case 0:
                time = 6000
                break
            case 1:
                time = 2000
                break
            case 2:
                time = 4000
                break
        }
        this.retryhb++
        this.wsInterval = setTimeout(this.sendheartbeat, time)
    }
}
class Msg {
    author_id = ""
    channel_type = ""
    content = ""
    extra = {}
    msg_id = ""
    msg_timestamp = 0
    nonce = ""
    target_id = ""
    type = 1
    constructor(r, v2) {
        if (v2) {
            r = Object.assign(r, Json.parse(r.content))
            r.extra = Json.parse(r.extra)
            JtC(this, r)
            this.msg_id = r.msgId
            this.msg_timestamp = r.msgTimestamp
            this.author_id = r.fromUserId
            this.target_id = r.toUserId
            this.type = r.extra?.type ?? r.type
        }
        else Object.assign(this, r)
    }
}
export class KaiheilaWS extends EventEmitter {
    config = new Config()
    get ver() {
        return this.config.ver
    }
    set ver(t) {
        return this.config.ver = t
    }
    #wsurl = ""
    #api = new KaiheilaAPI()
    #user = new UserInfo()
    #guilds = []
    #wsRequest = new KaiheilaWsRequest()
    constructor(config = new Config()) {
        super()
        Object.assign(this.config, config)
    }
    connect() {
        this.getGateway().then(() => {
            this.#wsRequest.ws = new WebSocket(this.#wsurl)
            // this.#wsRequest.ws.on("open", e => {
            // })
            this.#wsRequest.ws.on("message", e => {
                let n = e
                let r
                try {
                    if (typeof n !== "string") {
                        let a = new Uint8Array(n)
                        n = pako.inflate(a, {
                            to: "string"
                        })
                    }
                } catch (o) {
                    console.log(o)
                }
                r = Json.parse(n)
                // console.log(r)
                switch (r.s) {
                    case 0:
                        if (typeof r.sn == "number" && r.sn > this.#wsRequest.sn) this.#wsRequest.sn = r.sn
                        this.emit("Message", new Msg(r.d,this.config.ver2))
                        break
                    case 1:
                        if (r?.d?.sessionId) this.#wsRequest.sessionId = r.d.sessionId
                        break
                    case 3:
                        if (this.#wsRequest.wsInterval) clearTimeout(this.#wsRequest.wsInterval)
                        this.#wsRequest.retryhb = 0
                        this.#wsRequest.wsInterval = setTimeout(this.#wsRequest.sendheartbeat, randomizator(25000, 10000))
                        // 已接收到心跳，开始以25秒为基础，加上10秒之内的随机数继续发送
                        break
                    case 5:
                        this.#wsRequest.realclose = false
                        this.#wsRequest.ws.close()
                        break
                    default:
                        break
                }
            })
            this.#wsRequest.ws.on("close", e => {
                if (!this.#wsRequest.realclose) {
                    if (this.#wsRequest.wsInterval) clearTimeout(this.#wsRequest.wsInterval)
                    this.#wsRequest.wsInterval = null
                    this.#wsRequest = new KaiheilaWsRequest()
                    this.connect()
                }
            })
        })
    }
    reconnect() {
        this.#wsRequest.realclose = false
        this.#wsRequest.ws.close()
    }
    disconnect() {
        this.#wsRequest.ws.close()
    }
    creatRequest(api = "") {
        const ver = "v" + this.ver
        let request = {
            method: "GET",
            url: this.#api.url + ver + this.#api[api][ver],
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) kaiheila/0.0.25 Chrome/80.0.3987.158 Electron/8.2.0 Safari/537.36",
                Referer: "http://localhost:5888/app/discover"
            }
        }
        if (ver === "v3") request.headers["Authorization"] = "Bot " + this.config.v3.token
        else request.headers["Cookie"] = "auth=" + this.config.v2.auth
        return request
    }
    async getme() {
        const r = await axios(this.creatRequest("me"))
        if (this.config.ver3) {
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            Object.assign(this.#user, r.data.data)
            return this.#user
        }
        else {
            if (!r.data.user) return console.error("请求错误：" + r.data)
            Object.assign(this.#user, r.data.user)
            return this.#user
        }
    }
    async getGateway() {
        const r = await axios(this.creatRequest("gateway"))
        if (this.config.ver3) {
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return this.#wsurl = r.data.data.url
        }
        else {
            if (!r.data.proxy_url) return console.error("请求错误：" + r.data)
            Object.assign(this.#user, r.data.user)
            return this.#wsurl = r.data.proxy_url
        }
    }
    async getGuild() {
        const r = await axios(this.creatRequest("guild"))
        if (this.config.ver3) {
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return this.#guilds = r.data.data
        }
        else {
            if (r.data.code) return console.error("请求错误：" + r.data)
            return this.#guilds = r.data
        }
    }
}
// import { KaiheilaWS } from './index.js'
// let kaiheiws = new KaiheilaWS({
//     ver: 3,
//     v2: {
//         auth: "",
//         token: ""
//     },
//     v3: {
//         token: ""
//     }
// })
// kaiheiws.on("Message", r => { console.log(r) })
// kaiheiws.connect()