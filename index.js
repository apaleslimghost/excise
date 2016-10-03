import {innerHTML} from 'diffhtml/lib';

export class Component extends HTMLElement {
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

	constructor() {
		super();

		this.props = {};
		for(const {name, value} of this.attributes) {
			this.props[name] = value;
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

export const component = Component.component.bind(Component);
