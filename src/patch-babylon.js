var Parser = require('babylon/lib/parser').default;
var _tokenizerTypes = require('babylon/lib/tokenizer/types');
var Tokenizer = require('babylon/lib/tokenizer').default;

// Add tokenizer type.
_tokenizerTypes.types.questionDot = new _tokenizerTypes.TokenType("?.", { beforeExpr: true });

// Tokenize "?.".
const originalGetTokenFromCode = Tokenizer.prototype.getTokenFromCode;
Tokenizer.prototype.getTokenFromCode = function getTokenFromCode(code) {
  if (code === 63) {
    var next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 46) {
      this.state.pos += 2;
      return this.finishToken(_tokenizerTypes.types.questionDot);
    }
  }
  return originalGetTokenFromCode.apply(this, arguments);
};

// Parse SafeMemberExpression.
const originalParseSubscripts = Parser.prototype.parseSubscripts;
Parser.prototype.parseSubscripts = function (base, startPos, startLoc, noCalls) {
  base = originalParseSubscripts.apply(this, arguments);
  for (;;) {
    if (this.eat(_tokenizerTypes.types.questionDot)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = this.parseIdentifier(true);
      node.computed = false;
      base = this.finishNode(node, "SafeMemberExpression");
      base = originalParseSubscripts.call(this, base, startPos, startLoc, noCalls);
    } else {
      return base;
    }
  }
};

