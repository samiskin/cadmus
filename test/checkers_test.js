import {assert} from 'chai';
import checkers from '../src/checkers.js';
import primitiveTests from './primitive-tests.js';

describe('the type checker', () => {
    it('works with primitives', () => {
        const tests = primitiveTests;
        Object.keys(tests).forEach(typeA => {
            assert.doesNotThrow(() => {
                checkers[typeA](tests[typeA]);
            });
            Object.keys(tests).forEach(typeB => {
                if (typeA !== typeB) {
                    assert.throws(() => {
                        checkers[typeA](tests[typeB]);
                    })
                }
            });
        });

        assert.throws(
            () => checkers.array(tests.bool),
            'expected array, received bool'
        );
    });
});
