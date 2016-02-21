import test from 'tape';

import { add, createAdder } from '../src/app.js';

test('add', t => {
  t.equal(add(1, 1), 2, '1+1=2');
  t.end();
});

test('createAdder', t => {
  const add2 = createAdder(2);
  t.equal(add2(2), 4, '2+2=4');
  t.end();
})
