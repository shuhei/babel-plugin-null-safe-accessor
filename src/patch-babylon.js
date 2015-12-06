var Parser = require('babylon/lib/parser').default;
var _tokenizerTypes = require('babylon/lib/tokenizer/types');
var Tokenizer = require('babylon/lib/tokenizer').default;

// Add tokenizer type.
_tokenizerTypes.types.questionDot = new _tokenizerTypes.TokenType("?.", { beforeExpr: true });
_tokenizerTypes.types.questionParenL = new _tokenizerTypes.TokenType("?(", { beforeExpr: true, startsExpr: true });

// Tokenize "?(" and "?.".
const originalGetTokenFromCode = Tokenizer.prototype.getTokenFromCode;
Tokenizer.prototype.getTokenFromCode = function getTokenFromCode(code) {
  if (code === 63) {
    var next = this.input.charCodeAt(this.state.pos + 1);
    switch (next) {
      case 40:
        this.state.pos += 2;
        return this.finishToken(_tokenizerTypes.types.questionParenL);
      case 46:
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
    } else if (!noCalls && this.eat(_tokenizerTypes.types.questionParenL)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.callee = base;
      node.arguments = this.parseCallExpressionArguments(_tokenizerTypes.types.parenR, this.hasPlugin("trailingFunctionCommas"), false);
      base = this.finishNode(node, "SafeCallExpression");
      this.toReferencedList(node.arguments);
      base = originalParseSubscripts.call(this, base, startPos, startLoc, noCalls);
    } else {
      return base;
    }
  }
};

