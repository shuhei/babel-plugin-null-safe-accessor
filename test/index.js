const test = require('tape');

test('safe accessor for defined props', (t) => {
  t.plan(1);
  const a = { b: { c: 123 } };

  t.strictEqual(a?.b?.c, 123);
});

test('safe accessor for undefined props', (t) => {
  t.plan(1);
  const b = {};

  t.strictEqual(b?.c?.d, undefined);
});

test('call for defined method', (t) => {
  t.plan(1);
  const c = { d: { e(foo, bar) { return foo + bar } } };

  t.strictEqual(c?.d?.e(1, 23), 24);
});

test('call for null method', (t) => {
  t.plan(1);
  const d = { e: null };

  t.strictEqual(d?.e?.f(), null);
});

test('safe call for undefined method', (t) => {
  t.plan(1);
  const b = {};

  t.strictEqual(b.c?(), undefined);
});

test('safe call for defined method', (t) => {
  t.plan(1);
  const c = { d: { e(foo, bar) { return foo + bar } } };

  t.strictEqual(c?.d?.e?(1, 23), 24);
});
