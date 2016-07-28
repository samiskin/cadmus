import {assert} from 'chai';
import returns from '../src/proxy-decorator.js';
import t from '../src/type.js';

describe('proxy decorator', () => {
    it('works with primitives', () => {
        const tests = {
            'array': [1,2],
            'bool': false,
            'date': (new Date()),
            'func': () => {},
            'number': 1,
            'object': {a: 'b'},
            'regexp': /test/,
            'string': 'test',
            'symbol': Symbol('test'),
        };

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
});
