

/**
 * 对于本地存储操作的封装
 */

export default {
    get(key) {
        let val = window.sessionStorage.getItem(key);
        return JSON.parse(val);
    },
    set(key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },
    remove(key) {
        window.sessionStorage.removeItem(key)
    },
    clear() {
        window.sessionStorage.clear()
    }
}


