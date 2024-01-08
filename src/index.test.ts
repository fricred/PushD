// index.test.ts
import { helloWorld } from './index';

test('helloWorld returns "Hello World"', () => {
  expect(helloWorld()).toBe('Hello World edited');
});
