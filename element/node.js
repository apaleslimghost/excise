const registry = new Map();

const attrsToString = attrs => attrs.map(
	({name, value}) => ` ${name}="${value}"`
).join('');

module.exports = class Element {
	attachShadow() {} // noop

	static get customElements() {
		return {
			define(name, Class) {
				registry.set(name, Class);
			}
		};
	}

	static renderToString(node) {
		if(registry.has(node.nodeName)) {
			const Class = registry.get(node.nodeName);
			const element = new Class(node);
			node.childNodes = [].concat(element.render(element.props, element));
		}

		if(node.nodeName === '#text') {
			return node.nodeValue;
		}

		return `<${node.nodeName}${attrsToString(node.attributes)}>${node.childNodes.map(child => this.renderToString(child)).join('')}</${node.nodeName}>`
	}
}
