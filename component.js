const {innerHTML} = require('diffhtml');
const paramCase = require('param-case');

module.exports = class Component extends HTMLElement {
	static component(render, propTypes) {
		return class extends this {
			get render() {
				return render;
			}

			static get propTypes() {
				return propTypes;
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
		return klass;
	}

	constructor() {
		super();

		this.props = {};
		for(const {name, value} of this.attributes) {
			const val = this._propValue(name, value);
			this.props[name] = val;
		}

		this.attachShadow({mode: 'open'});
	}

	_propValue(name, value) {
		if(!value && this.hasOwnProperty(name)) {
			value = this[name];
		}

		if(this.constructor.propTypes && this.constructor.propTypes.hasOwnProperty(name)) {
			value = this.constructor.propTypes[name](value);
		}

		return value;
	}

	connectedCallback() {
		this._updateTree(this.shadowRoot, this.render(this.props, this));
	}

	get _updateTree() {
		return innerHTML;
	}
}
