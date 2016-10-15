const {define, html, types, renderToString} = require('./');
const StatefulComponent = require('./stateful');

StatefulComponent.define('x-increment',
	(props, el) => html`<b>${props.count}</b>
		<x-button click=${() => (console.log(props.foo), el.setAttribute('count', props.count + 1))}>
			+
			<span slot="blah">hello</span>
			<h1><i slot="blah">what</i></h1>
			-
		</x-button>`,
	{count: types.number, foo: types.bool}
);

define('x-button',
	({click}) => html`<button onclick=${click}><b><slot /></b> <slot name="blah"></slot></button>`
);

console.log(renderToString(html`<x-increment count="5"></x-increment>`));
