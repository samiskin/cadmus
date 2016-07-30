import {assert} from 'chai';
import returns from '../src/proxy-decorator.js';
import t from '../src/type.js';
import primitiveTests from './primitive-tests.js';

describe('proxy decorator', () => {
    it('works with primitives', () => {
        const tests = primitiveTests;
        Object.keys(tests).forEach((typeA) => {
            const sig = t[typeA];
            const funcA = () => tests[typeA];
            const decoratedA = returns(sig)(funcA);
            assert.doesNotThrow(decoratedA);
            Object.keys(tests).forEach((typeB) => {
                if (typeA !== typeB) {
                    const funcB = () => tests[typeB];
                    const decoratedB = returns(sig)(funcB);
                    assert.throws(decoratedB);
                }
            });
        });
    });

    describe('working with shapes', () => {
        it('errors on direct undefined property access', () => {
            const sig = t.shape({
                str: t.string,
                num: t.number,
            });
            const func = () => ({str: 'str', num: 1});
            const decorated = returns(sig)(func);
            assert.equal(decorated().str, 'str');
            assert.throws(() => decorated().unknown);
        });

        it('errors on nested undefined property access', () => {
            const sig = t.shape({
                shape: t.shape({
                    str: t.string,
                }),
            });

            const obj = {shape: {str: 'str'}};
            const func = () => obj;
            const decorated = returns(sig)(func);
            assert.equal(decorated().shape.str, obj.shape.str);
            assert.throws(() => decorated().shape.unknown);
        });
    });
});
