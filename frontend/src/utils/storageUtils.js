export const clone = function (data) {
    if (!data || typeof data === 'string') {
        return data
    }
    return JSON.parse(JSON.stringify(data))
}
// localStorage
export const setStorage = function (key, value) {
    try {
        if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
            localStorage.setItem(key, value)
        } else if (value instanceof Array) {
            localStorage.setItem(key, JSON.stringify(value))
        } else {
            const data = getStorage(key) || {}
            localStorage.setItem(key, JSON.stringify(Object.assign(data, clone(value))))
        }
    } catch (err) {
        console.log(err) // eslint-disable-line
    }
}
export const getStorage = function (key) {
    try {
        let value
        try {
            value = JSON.parse(localStorage.getItem(key))
        } catch (err) {
            value = localStorage.getItem(key)
        }
        return value
    } catch (err) {
        console.log(err) // eslint-disable-line
    }
}
