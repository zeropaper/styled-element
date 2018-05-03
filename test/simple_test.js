/* eslint-disable */
import assert from 'assert';
import styledElement from './../src/index';

describe('styledElement', () => {
  it('throws an error if the selector is missing or cannot be used', () => {
    assert.throws(() => styledElement(`{ display: block; }`));
  });

  it('creates a function', () => {
    assert.equal(typeof styledElement(`div { display: block; }`), 'function');
  });
});
