const {innerHTML, html} = require('diffhtml');
const paramCase = require('param-case');

class Component extends HTMLElement {
	static component(render) {
		return class extends this {
			get render() {
				return render;
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
			this.props[name] = !value && this.hasOwnProperty(name) ? this[name] : value;
		}

		this.attachShadow({mode: 'open'});
	}

	connectedCallback() {
		this._updateTree(this.shadowRoot, this.render(this.props, this));
	}

	get _updateTree() {
		return innerHTML;
	}
}

exports.Component = Component;
exports.component = Component.component.bind(Component);
exports.define = Component.define.bind(Component);
exports.html = html;
