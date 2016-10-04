const {define, html, types} = require('./');
const StatefulComponent = require('./stateful');

StatefulComponent.define('x-increment',
	(props, el) => html`<div>
		<b>${props.count}</b>
		<x-button click=${() => (console.log(props.foo), el.setAttribute('count', props.count + 1))}>+</x-button>
	</div>`,
	{count: types.number, foo: types.bool}
);

define('x-button',
	({click}) => html`<button onclick=${click}><b><slot /></b></button>`
);
