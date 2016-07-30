import {assert} from 'chai';
import returns from '../src/checker-decorator.js';
import t from '../src/type.js';
import primitiveTests from './primitive-tests.js';

describe('returns', () => {
    it('works with primitives', () => {
        const func = (shouldFail) => shouldFail ? 0 : 'test';
        const decorated = returns(t.string)(func);
        assert.doesNotThrow(() => decorated(false));
        assert.throws(() => decorated(true));
    });

    describe('working with shapes', () => {
        const sig = t.shape({
            str: t.string,
            num: t.number,
            shape: t.shape({
                bool: t.bool,
            }),
        });
        const func = (shouldFail) => ({
            str: 'str',
            num: 1,
            shape: {
                bool: shouldFail ? 'fail' : true,
            }
        });
        const decorated = returns(sig)(func);
        it('does not error on correct output', () => {
            assert.equal(decorated(false).str, 'str');
            assert.equal(decorated(false).shape.bool, true);
        });
        it('errors on incorrect output', () => {
            assert.throws(() => decorated(true));
        });
    });
});
