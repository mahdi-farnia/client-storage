"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var ClientStorage;
(function (ClientStorage) {
    var _storeValue;
    class Store {
        constructor(storage) {
            _storeValue.set(this, void 0);
            this.type = storage;
            this.store =
                storage === 'session'
                    ? sessionStorage
                    : storage === 'local'
                        ? localStorage
                        : report('Storage Type Must be Neither session Or local', 'throw');
            __classPrivateFieldSet(this, _storeValue, Object.assign({}, this.store));
        }
        set(key, value) {
            const _set = (k, v) => {
                this.store.setItem(k, v);
                __classPrivateFieldGet(this, _storeValue)[k] = v;
            };
            if (typeof key === 'string') {
                const v = convert2String(value);
                _set(key, v);
                return this;
            }
            if (isPlainObject(key)) {
                for (const item in key) {
                    const v = convert2String(key[item]);
                    _set(item, v);
                }
            }
            return this;
        }
        get(key, force) {
            if (typeof key === 'boolean' || typeof key === 'undefined') {
                key === true && this.refresh();
                return Object.assign({}, __classPrivateFieldGet(this, _storeValue));
            }
            key = key.toString();
            const value = force === true
                ? (__classPrivateFieldGet(this, _storeValue)[key] = this.store.getItem(key))
                : __classPrivateFieldGet(this, _storeValue)[key];
            try {
                return JSON.parse(value);
            }
            catch (err) {
                if (!isNaN(+value))
                    return +value;
                return value;
            }
        }
        hasItems(...items) {
            return items.length === 0
                ? false
                : items.every((item) => __classPrivateFieldGet(this, _storeValue).hasOwnProperty((item !== null && item !== void 0 ? item : '').toString()));
        }
        clear(key) {
            if (typeof key === 'string') {
                this.store.removeItem(key);
                delete __classPrivateFieldGet(this, _storeValue)[key];
            }
            else {
                this.store.clear();
                __classPrivateFieldSet(this, _storeValue, {});
            }
            return this;
        }
        /**
         * Get & Store Storage Value
         */
        refresh() {
            __classPrivateFieldSet(this, _storeValue, Object.assign({}, this.store));
            return this;
        }
        /**
         * Save Current
         * @param key just Set Specified Item(s)
         * @param force get from browser then copy to another
         */
        saveToAnotherStorage(key, force) {
            let other = this.type === 'local' ? sessionStorage : localStorage;
            const set = force === true
                ? (item) => other.setItem(item, this.store.getItem(item) || '')
                : (item) => other.setItem(item, __classPrivateFieldGet(this, _storeValue)[item] || '');
            if (typeof key === 'undefined') {
                for (const item in __classPrivateFieldGet(this, _storeValue))
                    set(item);
                return this;
            }
            if (Array.isArray(key)) {
                key.forEach((item) => set(item.toString()));
                return this;
            }
            set(key);
            return this;
        }
        /**
         * Switch To Another Storage
         */
        switch() {
            this.type === 'local'
                ? (this.store = sessionStorage)
                : (this.store = localStorage);
            this.refresh();
            return this;
        }
    }
    _storeValue = new WeakMap();
    ClientStorage.Store = Store;
    function convert2String(arg) {
        if (isPlainObject(arg) || Array.isArray(arg))
            return JSON.stringify(arg);
        return (arg !== null && arg !== void 0 ? arg : '').toString();
    }
    function report(message, type) {
        switch (type) {
            case 'throw':
                throw new Error(message);
            case 'error':
                return console.error(message);
            case 'info':
                return console.log(message);
            case 'warn':
                return console.warn(message);
        }
    }
    function isPlainObject(arg) {
        const isValidObj = (o) => o != null &&
            typeof o === 'object' &&
            !Array.isArray(o) &&
            Object.prototype.toString.call(o) === '[object Object]';
        if (!isValidObj(arg))
            return !1;
        let ctor = arg.constructor, prot;
        if (typeof ctor !== 'function')
            return !1;
        prot = ctor.prototype;
        if (!isValidObj(prot))
            !1;
        if (!prot.hasOwnProperty('isPrototypeOf'))
            return !1;
        return !0;
    }
})(ClientStorage || (ClientStorage = {}));
