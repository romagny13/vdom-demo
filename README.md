# VDOM Demo 

JSX => VDOM => DOM

Or without JSX use a (custom) html parser with templates

## Installation

```
npm i babel-plugin-transform-react-jsx -D
```

babel
```
npm i babel-cli babel-preset-latest -D
```

## Configuration
.babelrc
```js
{
  "plugins": ["transform-react-jsx"]
}
```
+ comment 
Example transpile with method "h"
```js
/** @jsx h */
const vnode = (
  <div class="container">
    <h1 style="color:#444">JSX => VDOM => DOM</h1>
    <img src="profile.png" />
    <p>My sample <strong>text</strong></p>
    <button onClick={(event) => console.log('click', event)}>Clic!</button>
  </div>
);
```

Or
```js
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "h" // default pragma is React.createElement
    }]
  ]
}
```
+ example
```js
// JSX
const vnode = (
  <div class="container">
    <h1 style="color:#444">JSX => VDOM => DOM</h1>
    <img src="profile.png" />
    <p>My sample <strong>text</strong></p>
    <button onClick={(event) => console.log('click', event)}>Clic!</button>
  </div>
);
```

## Build
Add a NPM Script
```
 "scripts": {
    "build": "babel --presets latest -d dist/ src/"
  },
```

## Transpilation 
```
npm run build
```

```js
// transpiled to =>
var vnode = h(
  "div",
  { "class": "container" },
  h(
    "h1",
    { style: "color:#444" },
    "JSX => VDOM => DOM"
  ),
  h("img", { src: "profile.png" }),
  h(
    "p",
    null,
    "My sample ",
    h(
      "strong",
      null,
      "text"
    )
  ),
  h(
    "button",
    { onClick: function onClick(event) {
        return console.log('click', event);
      } },
    "Clic!"
  )
);
```