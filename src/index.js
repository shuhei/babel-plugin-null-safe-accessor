require('./patch-babel-types');
require('./patch-babylon');

var template = require('babel-template');

var buildReference = template('OBJECT == null ? OBJECT : OBJECT.PROPERTY');
var buildMethodCall = template('OBJECT == null ? OBJECT : OBJECT.METHOD(ARGUMENTS)');
var buildCall = template('CALLEE == null ? CALLEE : CALLEE(ARGUMENTS)');

module.exports = function (t) {
  var types = t.types;
  return {
    visitor: {
      SafeMemberExpression: function (path) {
        var safeReference = buildReference({
          OBJECT: path.node.object,
          PROPERTY: path.node.property
        });
        path.replaceWith(safeReference);
      },
      CallExpression: function (path) {
        var callee = path.node.callee;
        if (callee.type === 'SafeMemberExpression') {
          var safeMethodCall = buildMethodCall({
            OBJECT: callee.object,
            METHOD: callee.property,
            ARGUMENTS: path.node.arguments
          });
          path.replaceWith(safeMethodCall);
        }
      },
      SafeCallExpression: function (path) {
        var safeCall = buildCall({
          CALLEE: path.node.callee,
          ARGUMENTS: path.node.arguments
        });
        path.replaceWith(safeCall);
      }
    }
  };
};
