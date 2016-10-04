const {define, html} = require('./');
const StatefulComponent = require('./stateful');

StatefulComponent.define('x-increment',
	(props, el) => html`<div>
		<b>${props.count}</b>
		<x-button click=${() => el.setAttribute('count', +props.count + 1)}>+</x-button>
	</div>`,
	['count']
);

define('x-button',
	({click}) => html`<button onclick=${click}><b><slot /></b></button>`
);
