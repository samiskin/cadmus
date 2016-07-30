import {assert} from 'chai';
import noUndefAccess from '../src/proxy-decorator.js';
import primitiveTests from './primitive-tests.js';

describe('proxy decorator', () => {
    describe('working with shapes', () => {
        it('errors on direct undefined property access', () => {
            const func = () => ({str: 'str', num: 1});
            const decorated = noUndefAccess(func);
            assert.equal(decorated().str, 'str');
            assert.throws(() => decorated().unknown);
        });

        it('errors on nested undefined property access', () => {
            const obj = {shape: {arr: [1,2]}};
            const func = () => obj;
            const decorated = noUndefAccess(func);
            assert.doesNotThrow(() => decorated().shape.arr);
            assert.throws(() => decorated().shape.unknown);
        });
    });
});
