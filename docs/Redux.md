# Redux

[Getting started with Redux](https://egghead.io/series/getting-started-with-redux)

Read up on [function maps](https://priteshgupta.com/2015/01/function-maps-in-javascript/)
```js
var map = {
  functionOne: function(obj) {
    return console.info('I am at functionOne: %o', obj);
  },
  functionTwo: function(obj) {
    return console.info('I am at functionTwo: %o', obj);
  },
  functionThree: function(obj) {
    return console.info('I am at functionThree: %o', obj);
  }
};
```
Here you can call each function like:
```js
map[key]({hello: 'World'})
```

Then if you have an array of objects:
```js
var arr = data.map(function(item){
    return item[map[key](item)];
});
```

Things that you shoud *NEVER* do inside a reducer:
- Mutate any of the arguments
- Perform any side effects or call any APIs
- Call any non-pure functions

Note on Relationships
>In a more complex app, you're going to want different entities to reference each other. We suggest that you keep your state as normalized as possible, without any nesting. Keep every entity in an object stored with an ID as a key, and use IDs to reference it from other entities, or lists. Think of the app's state as a database. This approach is described in normalizr's documentation in detail. For example, keeping `todosById: { id -> todo }` and `todos: array<id>` inside the state would be a better idea in a real app, but we're keeping the example simple.

Lean how to use reducers (and the `combineReducers()` funciton):
```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
```
Is equivalent to
```js
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
```
You must have your store organised as `{nameA: ..., nameB: ..., nameC: ...}` and have reducers `nameA()`, `nameB()`, `nameC()`.  If you cannot separate your data like this, then you cannot use `combineReducers()`.
