// Verifies the built CommonJS entry exposes the public API (BUG-002 guard).
const assert = require('node:assert');
const ui = require('../dist/index.cjs');

assert.ok(ui.designVariables, 'require() exposes designVariables');
assert.ok(ui.Input, 'require() exposes Input');
console.log('require smoke check passed');
