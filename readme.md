# excise

a toolkit for writing functional-style (react-like) web components, based on [diffhtml](https://github.com/tbranyen/diffhtml)

## install

```sh
npm install excise
```

## usage

### basic

you'll need a browser that supports custom elements v1 and shadow dom v1. chrome 55 will work.

```js
const {define, html} = require('excise');

define('x-hello-world', () => html`<h1>it works!</h1>`);

document.body.innerHTML = '<x-hello-world></x-hello-world>';
```

#### polyfills

the only polyfills i've found that work are [custom-elements](https://github.com/webcomponents/custom-elements) and [shadydom](https://github.com/webcomponents/shadydom). they're not fully on npm yet but they can be installed with:

```sh
npm install --save webcomponents/shadydom webcomponents/custom-elements
```

and then include them with

```js
require('@webcomponents/shadydom');
require('@webcomponents/custom-elements');
```

or as entry points to your bundle

#### bundling

i've found it difficult to get this working with webpack because it thinks `define` means AMD and even if you disable that plugin it breaks. just use browserify, and don't bother with babel because we need to natively extend `HTMLElement`.

### props

element attributes are passed as an object to the render function

```js
const {define, html} = require('excise');

define('x-count', ({count}) => html`<h1>${count}</h1>`);

document.body.innerHTML = '<x-count count="5"></x-count>';
```

pass a third argument to `define` to specify the types of the props, for coercion:

```js
const {define, html, types} = require('excise');

define('x-increment', ({count}) => html`<h1>${count + 1}</h1>`, {count: types.number});

document.body.innerHTML = '<x-increment count="5"></x-increment>';
```

### server rendering

call `renderToString` with an `html` block:

```js
const {define, html, renderToString} = require('excise');

define('x-foo', () => html`<h1>hello</h1>`);

renderToString(html`<x-foo></x-foo>`); //⇒ <x-foo><span slot="__excise_rendered"><h1>hello</h1></span></x-foo>
```

the extra `span` allows you to reuse the server-rendered markup on the client. when your elements are defined, the `__excise_rendered` slot is ignored.

### events

`on*` attributes are attached to elements as event handlers:

```js
const {define, html} = require('excise');

define('x-button', () => html`<button onclick=${() => alert('hello!')}>click me</button>`);

document.body.innerHTML = '<x-button></x-button>';
```

### state

`StatefulComponent` watches its attributes and rerenders when they change:

```js
const {StatefulComponent, html, types} = require('excise');

StatefulComponent.define('x-counter',
	(props, el) => html`<b>${props.count}</b> <button onclick=${() => el.setAttribute('count', props.count + 1)}>click me}</button>`,
	{count: types.number}
);

document.body.innerHTML = '<x-counter count="1"></x-counter>';
```

there's a little bit of oddness here. we can't destructure `count` here like in previous examples, because of how diffhtml renders the button. the actual dom of the button never changes (it's the same structure) so diffhtml leaves it alone when `count` updates. this means the `onclick` handler still closes over `count` from the first run of the render function, and the button only works once.

### shadow dom/slots

```js
const {define, html} = require('excise');

define('x-shadow', () => html`<slot name="title" /> <h2>slots work</h2>`);

document.body.innerHTML = '<x-shadow><h1 slot="title">it works!</h1></x-shadow>';
```

### classes

```js
const {Component, html, types} = require('excise');

define(class XClassComponent extends Component {
	static get propTypes() {
		return {
			greeting: types.string,
		};
	}

	render() {
		return html`<h1>it works! ${this.props.greeting}</h1>`;
	}
});

document.body.innerHTML = '<x-class-component greeting="hello!"></x-class-component>'
```

## licence

ISC. &copy; matt brennan
