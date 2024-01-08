"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
test('helloWorld returns "Hello World"', () => {
    expect((0, index_1.helloWorld)()).toBe('Hello World');
});
