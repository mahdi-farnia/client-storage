namespace ClientStorage {
  interface PlainObject {
    [key: string]: any;
  }

  export class Store<T extends 'local' | 'session'> {
    type: T;
    private store: Storage | never;
    #storeValue: PlainObject;

    constructor(storage: T) {
      this.type = storage;
      this.store =
        storage === 'session'
          ? sessionStorage
          : storage === 'local'
          ? localStorage
          : report('Storage Type Must be Neither session Or local', 'throw');

      this.#storeValue = { ...this.store };
    }

    set(key: string, value: any): ThisType<Store<T>>;
    set(setObject: PlainObject): ThisType<Store<T>>;
    set(key: string | PlainObject, value?: any): ThisType<Store<T>> {
      const _set = (k: string, v: string) => {
        this.store.setItem(k, v);
        this.#storeValue[k] = v;
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

    /**
     * Get All From Store
     * @param force get all from browser?
     */
    get(force?: boolean): PlainObject;
    /**
     * Get Specified Item From Store
     * @param force get all from browser?
     */
    get(key: string, force?: boolean): any;
    get(key?: string | boolean, force?: boolean): any {
      if (typeof key === 'boolean' || typeof key === 'undefined') {
        key === true && this.refresh();

        return { ...this.#storeValue };
      }

      key = key.toString();

      const value =
        force === true
          ? (this.#storeValue[key] = this.store.getItem(key))
          : this.#storeValue[key];

      try {
        return JSON.parse(value);
      } catch (err) {
        if (!isNaN(+value)) return +value;

        return value;
      }
    }

    hasItems(...items: string[]): boolean {
      return items.length === 0
        ? false
        : items.every((item) =>
            this.#storeValue.hasOwnProperty((item ?? '').toString())
          );
    }

    /**
     * Clear Entire Storage
     */
    clear(): ThisType<Store<T>>;
    /**
     * Clear Specified Item
     */
    clear(key: string): ThisType<Store<T>>;
    clear(key?: string): ThisType<Store<T>> {
      if (typeof key === 'string') {
        this.store.removeItem(key);
        delete this.#storeValue[key];
      } else {
        this.store.clear();
        this.#storeValue = {};
      }

      return this;
    }

    /**
     * Get & Store Storage Value
     */
    refresh(): ThisType<Store<T>> {
      this.#storeValue = { ...this.store };
      return this;
    }

    /**
     * Save Current
     * @param key just Set Specified Item(s)
     * @param force get from browser then copy to another
     */
    saveToAnotherStorage(
      key?: string | string[],
      force?: boolean
    ): ThisType<Store<T>> {
      let other: Storage =
        this.type === 'local' ? sessionStorage : localStorage;

      const set =
        force === true
          ? (item: string) =>
              other.setItem(item, this.store.getItem(item) || '')
          : (item: string) => other.setItem(item, this.#storeValue[item] || '');

      if (typeof key === 'undefined') {
        for (const item in this.#storeValue) set(item);
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
    switch(): ThisType<Store<Exclude<'local' | 'session', T>>> {
      this.type === 'local'
        ? ((this.store = sessionStorage), (this.type = 'session' as T))
        : ((this.store = localStorage), (this.type = 'local' as T));
      this.refresh();
      return this;
    }
  }

  function convert2String(arg: any): string {
    if (isPlainObject(arg) || Array.isArray(arg)) return JSON.stringify(arg);

    return (arg ?? '').toString();
  }
  function report(message: string, type: 'throw'): never;
  function report(message: string, type: 'error' | 'warn' | 'info'): void;
  function report(
    message: string,
    type: 'throw' | 'error' | 'warn' | 'info'
  ): void | never {
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

  const isValidObj = (o: any) =>
    o != null &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    Object.prototype.toString.call(o) === '[object Object]';
  function isPlainObject(arg: any): arg is PlainObject {
    if (!isValidObj(arg)) return !1;

    let ctor = arg.constructor,
      prot;
    if (typeof ctor !== 'function') return !1;

    prot = ctor.prototype;
    if (!isValidObj(prot)) !1;

    if (!prot.hasOwnProperty('isPrototypeOf')) return !1;

    return !0;
  }
}
