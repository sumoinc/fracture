import { Attribute } from '../../src';

test('Smoke test', () => {
  const someAttribute = new Attribute({ name: 'foo' });
  expect(someAttribute).toBeTruthy();
});
