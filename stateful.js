const Component = require('./component');

module.exports = class StatefulComponent extends Component {
	static component(render, observedAttributes) {
		return class extends Component.component.call(this, render) {
			static get observedAttributes() {
				return observedAttributes;
			}
		}
	}

	attributeChangedCallback(name, old, val) {
		this.props[name] = val;
		this.connectedCallback();
	}
};
