const Component = require('./component');

module.exports = class StatefulComponent extends Component {
	static get observedAttributes() {
		if(this.propTypes) {
			return Array.isArray(this.propTypes) ? this.propTypes : Object.keys(this.propTypes);
		}
	}

	attributeChangedCallback(name, old, val) {
		this.props[name] = this._propValue(name, val);
		this.connectedCallback();
	}
};
