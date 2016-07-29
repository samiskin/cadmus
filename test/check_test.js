import {assert} from 'chai';
import check from '../src/check.js';
import primitiveTests from './primitive-tests.js';
import t from '../src/type.js';

describe('the type checker', () => {
    it('works with primitives', () => {
        const primitives = Object.keys(primitiveTests);
        primitives.forEach((typeA) => {
            assert.isTrue(check(t[typeA], primitiveTests[typeA]));
            primitives.forEach((typeB) => {
                if (typeA !== typeB) {
                    assert.instanceOf(check(t[typeA], primitiveTests[typeB]),
                                      Error);
                }
            });
        });

        assert.equal(
            check(t.array, primitiveTests.bool).message,
            'expected array, received boolean'
        );
    });
});
