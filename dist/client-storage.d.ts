declare namespace ClientStorage {
    interface PlainObject {
        [key: string]: any;
    }
    export class Store<T extends 'local' | 'session'> {
        #private;
        protected type: T;
        private store;
        constructor(storage: T);
        set(key: string, value: any): ThisType<Store<T>>;
        set(setObject: PlainObject): ThisType<Store<T>>;
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
        hasItems(...items: string[]): boolean;
        /**
         * Clear Entire Storage
         */
        clear(): ThisType<Store<T>>;
        /**
         * Clear Specified Item
         */
        clear(key: string): ThisType<Store<T>>;
        /**
         * Get & Store Storage Value
         */
        refresh(): ThisType<Store<T>>;
        /**
         * Save Current
         * @param key just Set Specified Item(s)
         * @param force get from browser then copy to another
         */
        saveToAnotherStorage(key?: string | string[], force?: boolean): ThisType<Store<T>>;
        /**
         * Switch To Another Storage
         */
        switch(): ThisType<Store<Exclude<'local' | 'session', T>>>;
    }
    export {};
}
