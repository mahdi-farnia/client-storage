/// <reference path="../dist/client-storage.d.ts" />

sessionStorage.setItem('test', JSON.stringify({ key: 'key' }));
sessionStorage.setItem('test2', JSON.stringify(2));

const { Store } = ClientStorage;

const store = new Store('session');

store.set({
  age: 17,
  name: 'farnia',
  data: {
    programmingLanguage: 'typescript'
  }
});

const test = {
  age: sessionStorage.getItem('age') == null,
  name: sessionStorage.getItem('name') == null,
  data:
    (sessionStorage.getItem('data') ??
      JSON.parse(sessionStorage.getItem('data')).programmingLanguage) == null
};

for (const item in test) {
  if (test[item]) throw new Error(`${item} is not exist`);
}

if (typeof store.get('test') !== 'object') {
  throw new Error('test item is not an object!');
}

if (typeof store.get('test2') !== 'number') {
  throw new Error('test item is not a number!');
}

sessionStorage.setItem('name', 'non-farnia');

if (store.get('name', true) !== 'non-farnia') {
  throw new Error('Name is not equal to non-farnia!');
}
