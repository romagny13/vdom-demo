// util
function isString(value) { return typeof value === 'string'; }

// JSX => VDOM
function h(type, props, ...children) {
  return { type, props, children };
}

// VDOM => DOM
function isEventProp(value) {
  return /^on/.test(value);
}

function getEventName(value) {
  return value.slice(2).toLowerCase();
}

function getAttrName(value) {
  if (value === 'className') {
    return 'class';
  }
  else if (value === 'htmlFor') {
    return 'for';
  }
  else {
    return value;
  }
}

function addEventListener(el, name, value) {
  let eventName = getEventName(name);
  el.addEventListener(eventName, value);
}

function setAttr(el, name, value) {
  let attrName = getAttrName(name);
  el.setAttribute(attrName, value);
}

function createTextNode(vnode) {
  return document.createTextNode(vnode);
}

function createElement(vnode) {
  if (isString(vnode)) {
    return createTextNode(vnode);
  }
  else {
    const el = document.createElement(vnode.type);
    // props
    let props = vnode.props;
    for (let name in props) {
      if (props.hasOwnProperty(name)) {
        if (isEventProp(name)) {
          // props => event listener
          addEventListener(el, name, props[name]);
        }
        else {
          // props => attribute
          setAttr(el, name, props[name]);
        }
      }
    }

    // children
    vnode.children.forEach((child) => {
      el.appendChild(createElement(child));
    });

    return el;
  }
}

function removeEventListener(el, name, value) {
  let eventName = getEventName(name);
  el.removeEventListener(eventName, value);
}

function removeAttr(el, name) {
  let attrName = getAttrName(name);
  el.removeAttribute(name);
}

function hasChanged(newVnode, oldVnode) {
  return typeof newVnode !== typeof oldVnode || newVnode !== oldVnode;
}

function updateElement(el, newVnode, oldVnode, index = 0) {
  if (!oldVnode) {
    // added
    el.appendChild(createElement(newVnode));
  }
  else if (!newVnode) {
    // removed
    el.removeChild(el.childNodes[index]);
  }
  else if (hasChanged(newVnode, oldVnode)) {
    // replace
    el.replaceChild(createElement(newVnode), el.childNodes[index]);
  }
  else if (newNode.type) {
    // props
    const props = Object.assign({}, newVnode.props, oldVnode.props);
    for (let name in props) {
      if (props.hasOwnProperty(name)) {
        if (isEventProp(name)) {
          removeEventListener(el, name, props[name]);
        }
        else {
          removeAttribute(el, name);
        }
      }
    }
    // children
    const newLength = newVnode.children.length;
    const oldLength = oldVnode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        el.childNodes[index],
        newVnode.children[i],
        oldVnode.children[i],
        i
      );
    }
  }
}

// example
const app = document.getElementById('app');

// JSX
const vnode = (
  <div class="container">
    <h1 style="color:#444">JSX => VDOM => DOM</h1>
    <img src="profile.png" />
    <p>My sample <strong>text</strong></p>
    <button onClick={(event) => console.log('click', event)}>Clic!</button>
    <button onClick={(event) => {
      // simulate update
      const newVnode = (
        <div class="container">
          <h1 style="color:red">JSX => VDOM => DOM</h1>
          <p>My sample <strong>text</strong> updated !!</p>
          <p>My new paragraph</p>
          <button onClick={(event) => console.log('click updated', event)}>Clic!</button>
        </div>
      );

      updateElement(app, newVnode, vnode);
      // or
      // app.replaceChild(createElement(newVnode), app.firstChild);

    }}>Update</button>

  </div>
);

console.log(vnode);
app.appendChild(createElement(vnode));
