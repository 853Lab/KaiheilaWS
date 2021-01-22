import { KaiheilaWS } from './index.js'
let kaiheiws = new KaiheilaWS({
    ver: 3,
    v3: {
        token: ""
    }
})
kaiheiws.on("Message", r => { console.log(r) })
kaiheiws.connect()