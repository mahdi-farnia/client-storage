# Client Storage

Solve communication with storage api with client storage library

- This library use ES6 version of Ecmascript

## Cache Usage

This library use cache for performance

Cache system works fine untill you set an item without using set method

## Chain

You can chain through methods except get method that returns key value

## Typescript Support

You can use typescript just like this:

```xml
/// <reference path="client-storage.d.ts" />
```

## No JSON.parse or JSON.stringify

This library handle json strings by it self

## Complete Usage

```ts
// Init
const store = new ClientStorage.Store<T extends "session" | "local">(type: T);

// Set new item
store.set(key: string, data: NonNullable<any>): ThisType<ClientStorage.Store<T>>;

// OR
store.set({
    [key: string]: NonNullable<any>
}): ThisType<ClientStorage.Store<T>>;


// Get all item
/**
 * If you wanna get an item value but you modified it,
 * you can pass true as force argument to get
 * specified key from storage.
 */
store.get(force?: boolean)

// OR get an item
store.get(key: string, force?: boolean): any;


// Check an item exist
store.hasItem(...keys: string[]): boolean;


// Clear an item or entire storage
store.clear(key?: string): ThisType<ClientStorage.Store<T>>;

// Refresh cache
store.refresh(): ThisType<ClientStorage.Store<T>>;


// Copy selected store data to another storage
store.saveToAnotherStorage(): ThisType<ClientStorage.Store<T>>


// Switch to another storage
store.switch(): ThisType<ClientStorage.Store<Exclude<"storage" | "local", T>>>
```
