const Component = require('./component');
const StatefulComponent = require('./stateful');
const types = require('./types');
const {html} = require('diffhtml');

module.exports = class extends Component {}
module.exports.define = Component.define.bind(Component);
module.exports.component = Component.component.bind(Component);
module.exports.html = html;
module.exports.StatefulComponent = StatefulComponent;
module.exports.types = types;
