const {innerHTML} = require('diffhtml');
const Element = require('./element');
const customElements = require('./custom-elements');

const paramCase = s => s.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();

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

		customElements.define(name, Class);
		return Class;
	}


	constructor({attributes} = {}) {
		super();
		this.props = {};
		this._readProps(attributes);
		this.attachShadow({mode: 'open'});
	}

	_readProps(attributes) {
		for(const {name, value} of (attributes || this.attributes)) {
			const val = this._propValue(name, value);
			this.props[name] = val;
		}
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
		this._readProps();
		this._updateTree(this.shadowRoot, this.render(this.props, this));
	}

	get _updateTree() {
		return innerHTML;
	}
}
