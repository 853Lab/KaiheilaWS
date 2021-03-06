"use strict"
import { EventEmitter } from 'events'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import WebSocket from 'ws'
import pako from 'pako'
import { Json, JtC, RList, randomizator, returnFileType } from './init.js'
class Config {
    type = "Bot"
    User = {
        auth: ""
    }
    Bot = {
        token: ""
    }
    get isBot() {
        return this.type === "Bot"
    }
    get isUser() {
        return this.type === "User"
    }
    get key() {
        return this.type === "Bot" ? this.Bot.token : this.User.auth
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
    nickname = ""
    online = false
    os = ""
    privacy_game_activity = 0
    privacy_music_activity = 0
    status = 0
    tag_info = {
        color: "",
        text: ""
    }
    roles = [] // 不是，为什么只是请求个自己的信息，怎么还会有角色组这玩意？而且还是空的？
    username = ""
}
class KaiheilaAPI {
    url = "https://kaiheila.cn/api/"
    me = {
        mode: "GET",
        addr: "/user/me"
    }
    gateway = {
        mode: "GET",
        addr: "/gateway/index"
    }
    guilds = {
        mode: "GET",
        addr: "/guild"
    }
    sendmsg = {
        mode: "POST",
        addr: "/message/create"
    }
    roleGrant = {
        mode: "POST",
        addr: "/guild-role/grant"
    }
    roleRevoke = {
        mode: "POST",
        addr: "/guild-role/revoke"
    }
    createAsset = {
        mode: "POST",
        addr: "/asset/create"
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
        role_id: 0,
        name: "@全体成员",
        color: 0,
        hoist: 0,
        mentionable: 0,
        permissions: 147642880
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
            console.log("心跳失败，重连") // 鲁迅：学医救不了国人
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
                console.log("发送心跳")
                time = 6000
                break
            case 1:
                console.log("发送心跳，重试：1")
                time = 2000
                break
            case 2:
                console.log("发送心跳，重试：2")
                time = 4000
                break
        }
        this.retryhb++
        this.wsInterval = setTimeout(() => { this.sendheartbeat() }, time)
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
    constructor(r, user) {
        if (user) {
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
const fileType = new class FileType {
    image = [
        "png",
        "jpg",
        "jpeg",
        "gif"
    ]
}
export class KaiheilaWS extends EventEmitter {
    config = new Config()
    #runList = new RList()
    #wsurl = ""
    #api = new KaiheilaAPI()
    #user = new UserInfo()
    #guilds = []
    #wsRequest = new KaiheilaWsRequest()
    /**
     * 初始配置，ver和v2、v3、userv3配置已弃用，请改用type、Bot、User配置。
     * @param {{
     * type:"User"|"Bot",
     * Bot:{
     * token:string,
     * }
     * User:{
     * auth:string,
     * }
     * }} config 
     */
    constructor(config = new Config()) {
        super()
        Object.assign(this.config, config)
    }
    /**
     * 开始接通 WebSocket
     */
    async connect() {
        await this.getGateway()
        if(!this.#wsurl) return console.log("获取不到 WebSocket URL!")
        this.#wsRequest = new KaiheilaWsRequest()
        this.#wsRequest.ws = new WebSocket(this.#wsurl)
        this.#wsRequest.ws.on("open", e => {
            console.log("连接已打开")
            this.#wsRequest.wsInterval = setTimeout(() => { this.#wsRequest.sendheartbeat() }, randomizator(25000, 10000))
        })
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
                    let msg = new Msg(r.d, this.config.isUser)
                    this.emit("Message", msg)
                    break
                case 1:
                    if (r?.d?.sessionId) this.#wsRequest.sessionId = r.d.sessionId
                    break
                case 3:
                    if (this.#wsRequest.wsInterval) clearTimeout(this.#wsRequest.wsInterval)
                    this.#wsRequest.retryhb = 0
                    this.#wsRequest.wsInterval = setTimeout(() => { this.#wsRequest.sendheartbeat() }, randomizator(25000, 10000))
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
            if (this.#wsRequest.wsInterval) clearTimeout(this.#wsRequest.wsInterval)
            this.#wsRequest.wsInterval = null
            if (!this.#wsRequest.realclose) {
                console.log("正在尝试重连")
                this.connect()
            }
            else console.log("连接已关闭")
        })
    }
    /**
     * 发送消息
     * @param {string} content 消息内容
     * @param {string} target_id 目标频道 id
     * @param {string} quote 回复某条消息的 msgId （可留空）
     * @param {1|2|3|4|5|6|7|8|9|10} type 消息类型：
     * 
     * 1：纯文字
     * 
     * 2：图片消息（只能发送由机器人或用户自己上传后的图片URL）
     * 
     * 3：视频消息
     * 
     * 4：文件消息
     * 
     * 9：kmarkdown
     * 
     * 10：卡片消息（CardMessage）
     * @param {string} temp_target_id 用户id，如果传了，代表该消息是临时消息，该消息不会存数据库，但是会在频道内只给该用户推送临时消息。用于在频道内针对用户的操作进行单独的回应通知等。
     * @returns {Promise<{
     * msg_id: string,
     * msg_timestamp: number,
     * nonce: string
     * }|undefined>}
     */
    async sendmsg(content = "", target_id = "", quote = "", type = 1, temp_target_id) {
        let [msg, request] = [{
            target_id,
            content,
            type
        }, this.createAPI("sendmsg")]
        if (temp_target_id) msg.temp_target_id = temp_target_id
        if (quote !== "") msg.quote = quote
        request.data = msg
        await this.#runList.Push()
        try {
            const r = await axios(request)
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return r.data.data
        } catch (error) {
            return console.error(`错误码：${error.response.data.code}，错误信息：${error.response.data.message}`)
        }
    }
    /**
     * 重新连接 WebSocket
     */
    reconnect() {
        this.#wsRequest.realclose = false
        this.#wsRequest.ws.close()
    }
    /**
     * 断开连接 WebSocket
     */
    disconnect() {
        this.#wsRequest.ws.close()
    }
    /**
     * 生成基础请求
     * @param {string} method 请求方式
     * @param {string} url 请求地址
     * @returns {{
     * method: string,
     * url: string,
     * headers: {
     * Authorization:string,
     * Referer: string,
     * "User-Agent": string
     * }}
     */
    creatRequest(method = "Get", url = "") {
        let request = {
            method,
            url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) kaiheila/0.0.30 Chrome/80.0.3987.158 Electron/8.2.0 Safari/537.36",
                Referer: "http://localhost:5888/app/discover"
            }
        }
        if (this.config.isBot) request.headers["Authorization"] = "Bot " + this.config.Bot.token
        else request.headers["Authorization"] = this.config.User.auth
        return request
    }
    /**
     * 生成api请求
     * @param {string} api 指定api
     * @returns {{
     * method: string,
     * url: string,
     * headers: {
     * Authorization:string,
     * Referer: string,
     * "User-Agent": string
     * }}
     */
    createAPI(api = "") {
        return this.creatRequest(this.#api[api].mode, this.#api.url + "v3" + this.#api[api].addr)
    }
    /**
     * 获取自身信息
     * @returns {Promise<UserInfo>}
     */
    async getme() {
        await this.#runList.Push()
        try {
            const r = await axios(this.createAPI("me"))
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            Object.assign(this.#user, r.data.data)
            return this.#user
        } catch (error) {
            return console.error(`错误码：${error.response.data.code}，错误信息：${error.response.data.message}`)
        }
    }
    /**
     * 获取连接 WebSocket 的 url
     * @returns {Promise<string|undefined>}
     */
    async getGateway() {
        console.log("获取连接信息")
        await this.#runList.Push()
        try {
            const r = await axios(this.createAPI("gateway"))
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return this.#wsurl = r.data.data.url
        } catch (error) {
            return console.error(`错误码：${error.response.data.code}，错误信息：${error.response.data.message}`)
        }
    }
    /**
     * 获取所有服务器的详细信息（谨慎使用）
     * @returns {Promise<[Guild]|undefined>}
     */
    async getGuilds() {
        await this.#runList.Push()
        try {
            const r = await axios(this.createAPI("guild"))
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return this.#guilds = r.data.data
        } catch (error) {
            return console.error(`错误码：${error.response.data.code}，错误信息：${error.response.data.message}`)
        }
    }
    /**
     * 给予或移除指定用户在某个服务器的角色组
     * @param {string} guild_id 服务器ID
     * @param {string} user_id 用户ID
     * @param {number} role_id 角色组ID
     * @param {"Grant"|"Revoke"} mode 模式，Grant为给予，Revoke为移除。
     * @returns {Promise<{
     * user_id: string,
     * guild_id: string,
     * roles: Array
     * }|undefined>} 返回成功后的结果或undefined
     */
    async setrole(guild_id = "", user_id = "", role_id = 0, mode = "Grant") {
        let request = this.createAPI("role" + mode)
        request.data = { guild_id, user_id, role_id }
        await this.#runList.Push()
        try {
            const r = await axios(request)
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return r.data.data
        } catch (error) {
            return console.error(`错误码：${error.response.data.code}，错误信息：${error.response.data.message}`)
        }
    }
    /**
     * 上传文件
     * @param {string} path 文件路径（不可以传文件夹！！！）
     * @returns {Promise<{url:string}|undefined>}
     */
    async uploadFile(path = "") {
        let request = this.createAPI("createAsset")
        let bodyFormData = new FormData()
        let stream = fs.createReadStream(path)
        // const file = path.indexOf("/") === -1 ? path.split("\\")[path.split("\\").length - 1] : path.split("/")[path.split("/").length - 1]
        // const { filename, filetype } = returnFileType(file)
        bodyFormData.append("file", stream)
        request.headers["content-type"] = bodyFormData.getHeaders()["content-type"]
        request.data = bodyFormData
        await this.#runList.Push()
        try {
            const r = await axios(request)
            if (r.data.code !== 0) return console.error("错误码：" + r.data.code + "，错误信息：" + r.data.message)
            return r.data.data
        } catch (error) {
            return console.error(`错误码：${error.response.data.code}，错误信息：${error.response.data.message}`)
        }
    }
    getChannel(channel_id) {
        for (let v = 0; v < this.#guilds.length; v++) {
            const z = this.#guilds[v]
            let channels = z.channels
            if (channels.length == 0) continue
            for (let i = 0; i < channels.length; i++) {
                const e = channels[i]
                if (e.hasOwnProperty("channels") && e.channels.length != 0) {
                    for (let q = 0; q < e.channels.length; q++) {
                        const w = e.channels[q]
                        if (channel_id != w.id) continue
                        return { guild: z, channel: w }
                    }
                }
                if (channel_id != e.id) continue
                return { guild: z, channel: e }
            }
        }
        return null
    }
}