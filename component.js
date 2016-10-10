const {innerHTML} = require('diffhtml');
const paramCase = require('param-case');
const Element = require('./element');


module.exports = class Component extends Element {
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

	static define(name, Class, ...rest) {
		if(typeof name === 'function') {
			Class = name;
			name = Class.is || paramCase(Class.name);
		}

		if(!Class.prototype || !Class.prototype.render) {
			Class = this.component(Class, ...rest);
		}

		this.customElements.define(name, Class);
		return Class;
	}


	constructor({attributes}) {
		super();

		this.props = {};
		for(const {name, value} of (attributes || this.attributes)) {
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
