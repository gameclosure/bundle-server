var path = require('path');

// Path helpers
__lib = path.normalize(path.resolve(__dirname, '..', 'lib'));
__tests = __dirname;
__fixtures = path.join(__tests, 'fixtures');

lib = path.join.bind(null, __lib);
test = path.join.bind(null, __tests);
fixture = path.join.bind(null, __fixtures);

// Tests will always need assert
assert = require('assert');

// Overwrite global.Promise in the test environment
/* jshint -W020 */
Promise = require('bluebird');
/* jshint +W020 */


