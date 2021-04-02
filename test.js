import { KaiheilaWS } from './index.js'
let kaiheiws = new KaiheilaWS({
    type:"Bot",
    Bot: {
        token: ""
    },
    retry: true
})
kaiheiws.on("Message", r => { console.log(r) })
kaiheiws.connect()
setTimeout(()=>{
    kaiheiws.sendmsg("Hell yeah!", "8815380044828253").then(e=>{console.log(e)})
},3000)
setTimeout(()=>{
    kaiheiws.getGuildList().then(e=>{console.log(e)})
},3000)
// setTimeout(()=>{
//     kaiheiws.uploadFile("D:/Pictures/SAI2/Snipaste_2021-03-06_03-19-58.png").then(e=>{console.log(e)})
// },3000)
setTimeout(()=>{
    kaiheiws.disconnect()
},10000)
kaiheiws.getGuilds().then(e=>{console.log(e)})