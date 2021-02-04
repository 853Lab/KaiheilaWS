export const Json = new class {
    /** 以避免报错形式解析Json。*/
    parse(data) {
        let rdata
        try {
            rdata = JSON.parse(data)
        } catch (error) {
            // console.log("JSON已解析，直接跳过")
            rdata = data
        }
        return rdata
    }
    /** 如果格式为string，将原样输出。 */
    stringify(data) {
        if (typeof data == "string") return data
        return JSON.stringify(data)
    }
}

export const JtC = (c, j) => {
    for (const k in j) {
        if (c.hasOwnProperty(k)) {
            c[k] = j[k]
        }
    }
    return c
}

export class RunList {
    time = 500
    #list = []
    Push(callback) {
        this.#list.push(callback)
        if (this.#list.length === 1) this.Run()
    }
    Run() {
        if (this.#list.length !== 0) {
            this.#list[0]()
            setTimeout(() => {
                this.#list.splice(0, 1)
                this.Run()
            }, this.time)
        }
    }
}
export class RList{
    time = 500
    #list = -1
    snooze = ms => new Promise(resolve => setTimeout(resolve, ms))
    async Push(){
        this.#list++
        await this.snooze(this.#list*this.time)
        Promise.resolve().finally(()=>{
            setTimeout(()=>{this.#list--},(this.#list+1)*this.time)
        })
    }
}
export const returnFileType = (file="") => {
    let f = file.split(".")
    if (f.length > 2) {
        let name = f[0]
        for (let i = 1; i < f.length - 1; i++) {
            name += "." + f[i]
        }
        return { name, type: f[f.length - 1] }
    }
    else return { name: f[0], type: f.length === 1 ? "" : f[1] }
}
export const randomizator = (a = 0, b = 0) => {
    return Math.floor(Math.random() * b) + a
}