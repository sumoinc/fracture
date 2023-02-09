import { Attribute } from '../../src/model/attribute';

test('Smoke test', () => {
  const someAttribute = new Attribute({ name: 'foo' });
  expect(someAttribute).toBeTruthy();
});
