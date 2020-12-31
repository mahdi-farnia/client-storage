/// <reference path="../dist/client-storage.d.ts" />
const { Store } = ClientStorage;

const store = new Store('session');

store.set({
  age: 17,
  name: 'mohammad',
  data: {
    programmingLanguage: 'typescript'
  }
});
