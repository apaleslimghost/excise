const registry = new Map();

exports.define = registry.set.bind(registry);
exports.registry = registry;
