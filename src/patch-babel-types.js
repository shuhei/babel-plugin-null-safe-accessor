var babelTypes = require('babel-types');

// For visitor validation.
babelTypes.TYPES.push('SafeMemberExpression');

// For node validation.
babelTypes.FLIPPED_ALIAS_KEYS['Expression'].push('SafeMemberExpression');
babelTypes.FLIPPED_ALIAS_KEYS['LVal'].push('SafeMemberExpression');
