import { Entity } from '../../src/model/entity';

test('Smoke test', () => {
  const foo = new Entity({ name: 'foo' });
  expect(foo).toBeTruthy();
});
