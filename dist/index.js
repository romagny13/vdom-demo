'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// util
function isString(value) {
  return typeof value === 'string';
}

// JSX => VDOM
function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return { type: type, props: props, children: children };
}

// VDOM => DOM
function isEventProp(value) {
  return (/^on/.test(value)
  );
}

function getEventName(value) {
  return value.slice(2).toLowerCase();
}

function getAttrName(value) {
  if (value === 'className') {
    return 'class';
  } else if (value === 'htmlFor') {
    return 'for';
  } else {
    return value;
  }
}

function addEventListener(el, name, value) {
  var eventName = getEventName(name);
  el.addEventListener(eventName, value);
}

function setAttr(el, name, value) {
  var attrName = getAttrName(name);
  el.setAttribute(attrName, value);
}

function createTextNode(vnode) {
  return document.createTextNode(vnode);
}

function createElement(vnode) {
  if (isString(vnode)) {
    return createTextNode(vnode);
  } else {
    var el = document.createElement(vnode.type);
    // props
    var props = vnode.props;
    for (var name in props) {
      if (props.hasOwnProperty(name)) {
        if (isEventProp(name)) {
          // props => event listener
          addEventListener(el, name, props[name]);
        } else {
          // props => attribute
          setAttr(el, name, props[name]);
        }
      }
    }

    // children
    vnode.children.forEach(function (child) {
      el.appendChild(createElement(child));
    });

    return el;
  }
}

function removeEventListener(el, name, value) {
  var eventName = getEventName(name);
  el.removeEventListener(eventName, value);
}

function removeAttr(el, name) {
  var attrName = getAttrName(name);
  el.removeAttribute(name);
}

function hasChanged(newVnode, oldVnode) {
  return (typeof newVnode === 'undefined' ? 'undefined' : _typeof(newVnode)) !== (typeof oldVnode === 'undefined' ? 'undefined' : _typeof(oldVnode)) || newVnode !== oldVnode;
}

function updateElement(el, newVnode, oldVnode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!oldVnode) {
    // added
    el.appendChild(createElement(newVnode));
  } else if (!newVnode) {
    // removed
    el.removeChild(el.childNodes[index]);
  } else if (hasChanged(newVnode, oldVnode)) {
    // replace
    el.replaceChild(createElement(newVnode), el.childNodes[index]);
  } else if (newNode.type) {
    // props
    var props = Object.assign({}, newVnode.props, oldVnode.props);
    for (var name in props) {
      if (props.hasOwnProperty(name)) {
        if (isEventProp(name)) {
          removeEventListener(el, name, props[name]);
        } else {
          removeAttr(el, name);
        }
      }
    }
    // children
    var newLength = newVnode.children.length;
    var oldLength = oldVnode.children.length;
    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement(el.childNodes[index], newVnode.children[i], oldVnode.children[i], i);
    }
  }
}

// example
var app = document.getElementById('app');

// JSX
var vnode = h(
  'div',
  { 'class': 'container' },
  h(
    'h1',
    { style: 'color:#2c3e50' },
    'JSX => VDOM => DOM'
  ),
  h('img', { src: 'profile.png' }),
  h(
    'p',
    null,
    'My sample ',
    h(
      'strong',
      null,
      'text'
    )
  ),
  h(
    'button',
    { onClick: function onClick(event) {
        return console.log('click', event);
      } },
    'Clic!'
  ),
  h(
    'button',
    { onClick: function onClick(event) {
        // simulate update
        var newVnode = h(
          'div',
          { 'class': 'container' },
          h(
            'h1',
            null,
            'JSX => VDOM => DOM'
          ),
          h(
            'p',
            null,
            'My sample ',
            h(
              'strong',
              null,
              'text'
            ),
            ' updated !!'
          ),
          h(
            'p',
            null,
            'My new paragraph'
          ),
          h(
            'button',
            { onClick: function onClick(event) {
                return console.log('click updated', event);
              } },
            'Clic!'
          )
        );

        updateElement(app, newVnode, vnode);
        // or
        // app.replaceChild(createElement(newVnode), app.firstChild);
      } },
    'Update'
  )
);

console.log(vnode);
app.appendChild(createElement(vnode));