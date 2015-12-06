var babel = require('babel-core');

var code = [
  'var c = a?.b?.c;',
  'a?.b?.c?(d, e);',
  'a.b?(c, d);',
  'a.b?();',
  'var d = a ? b : c;'
].join('\n');
var result = babel.transform(code, {
  plugins: ['../src']
});

console.log(result.code);
