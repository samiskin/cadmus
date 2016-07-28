import {assert} from 'chai';
import { t, returns, check } from '../src/index.js';
import primitiveTests from './primitive-tests.js';

describe('index', () => {
    it('exports the correct properties', () => {
        assert.isDefined(t);
        assert.isDefined(returns);
        assert.isDefined(check);
    });

    it('can check primitives', () => {
        const sig = t.string;
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
    });
});
