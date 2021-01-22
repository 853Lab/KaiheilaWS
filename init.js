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