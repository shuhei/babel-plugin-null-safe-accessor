require('./patch-babel-types');
require('./patch-babylon');

var template = require('babel-template');

var buildReference = template('OBJECT == null ? OBJECT : OBJECT.PROPERTY');
var buildMethodCall = template('OBJECT == null ? OBJECT : OBJECT.METHOD()');

module.exports = function (t) {
  var types = t.types;
  return {
    visitor: {
      SafeMemberExpression(path) {
        var safeReference = buildReference({
          OBJECT: path.node.object,
          PROPERTY: path.node.property
        });
        path.replaceWith(safeReference);
      },
      CallExpression(path) {
        var callee = path.node.callee;
        if (callee.type === 'SafeMemberExpression') {
          var safeMethodCall = buildMethodCall({
            OBJECT: callee.object,
            METHOD: callee.property
          });
          path.replaceWith(safeMethodCall);
        }
      }
    }
  };
};
