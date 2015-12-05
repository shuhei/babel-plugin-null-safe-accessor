# babel-plugin-null-safe-accessor

A Babel plugin to provide null safe accessor syntax like Groovy's.

Before:

```js
var b = a?.b;
a.b();
```

After:

```js
var b = a == null ? a : a.b;
a == null ? a : a.b();
```

## Installation

```sh
npm install -D babel-plugin-null-safe-accessor
```

.babelrc:

```json
{
  "plugins": ["null-safe-accessor"]
}
```
