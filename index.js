const {innerHTML, html} = require('diffhtml');
const paramCase = require('param-case');

class Component extends HTMLElement {
	static component(render, observedAttributes) {
		return class extends this {
			get render() {
				return render;
			}

			static get observedAttributes() {
				return observedAttributes;
			}
		}
	}

	static define(name, klass, ...rest) {
		if(typeof name === 'function') {
			klass = name;
			name = klass.is || paramCase(klass.name);
		}

		if(!klass.prototype || !klass.prototype.render) {
			klass = this.component(klass, ...rest);
		}

		customElements.define(name, klass);
	}

	static get html() {
		return html;
	}

	constructor() {
		super();

		this.props = {};
		for(const {name, value} of this.attributes) {
			this.props[name] = !value && this.hasOwnProperty(name) ? this[name] : value;
		}

		this.attachShadow({mode: 'open'});
	}

	static get observedAttributes() {
		return [];
	}

	attributeChangedCallback(name, old, val) {
		this.props[name] = val;
		this.connectedCallback();
	}

	connectedCallback() {
		this._updateTree(this.shadowRoot, this.render(this.props, this));
	}

	get _updateTree() {
		return innerHTML;
	}

	render() {
		throw new Error(`component ${this.constructor.is || this.constructor.name} does not implement render`);
	}
}

module.exports = Component;
Component.component = Component.component.bind(Component);
Component.define = Component.define.bind(Component);
