import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'index.js',
	format: 'iife',
	moduleName: 'excise',
	dest: 'dist/excise.js',
	plugins: [
		nodeResolve({
			include: 'node_modules/**'
		}),
		commonjs()
	]
};
