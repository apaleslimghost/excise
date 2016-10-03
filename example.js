const {component} = require('./');
const {html} = require('diffhtml');

customElements.define('x-increment', component(
	(props, el) => html`<div>
		<b>${props.count}</b>
		<x-button click=${() => el.setAttribute('count', +props.count + 1)}>+</x-button>
	</div>`,
	['count']
))

customElements.define('x-button', component(
	({click}) => html`<button onclick=${click}><b><slot /></b></button>`
));
