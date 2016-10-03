import {update} from 'yo-yo';

export class Component extends HTMLElement {
  constructor() {
    super();
    this.props = {};
    for(const attr of this.constructor.observedAttributes) {
      this._setProp(attr);
    }
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this._render();
  }

  _setProp(attr, val = this.getAttribute(attr)) {
    if(this.hasOwnProperty(attr)) {
      this.props[attr] = this[attr];
    } else if(this.hasAttribute(attr)) {
      this.props[attr] = val;
    }
  }

  attributeChangedCallback(name, old, val) {
    this._setProp(name, val);
    this._render();
  }

  _render() {
    this._updateTree(this.shadowRoot, this.render());
  }

  render() {
    throw new Error(`component ${this.constructor.is || this.constructor.name} does not implement render`);
  }

  static get observedAttributes() {
    return [];
  }

	get _updateTree() {
		return update;
	}
}

export const componentFactory = (BaseComponent) => ((render, observedAttributes = []) => class FunctionalComponent extends BaseComponent {
	render() {
		return render(this.props, this);
	}

	static get observedAttributes() {
		return observedAttributes;
	}
});

export const component = componentFactory(Component);
