import {assert} from 'chai';
import check from '../src/check.js';
import primitiveTests from './primitive-tests.js';
import t from '../src/type.js';
import JanusError from '../src/janus-error.js';

describe('the type checker', () => {
    it('works with primitives', () => {
        assert.isNull(check(t.string, 'string'));
        assert.instanceOf(check(t.array, true), JanusError);

        const primitives = Object.keys(primitiveTests);
        primitives.forEach((typeA) => {
            assert.isNull(check(t[typeA], primitiveTests[typeA]));
            primitives.forEach((typeB) => {
                if (typeA !== typeB && typeB !== 'null') {
                    assert.instanceOf(check(t[typeA], primitiveTests[typeB]),
                                      JanusError);
                }
            });
        });

        assert.equal(
            check(t.array, primitiveTests.bool).message,
            'expected type array, received boolean'
        );
    });

    describe('shape', () => {
        it('errors on missing properties', () => {
            const sig = t.shape({
                required: t.string,
                optional: t.number.optional,
            });

            assert.isNotNull(check(sig, {}));
            assert.isNotNull(check(sig, {required: undefined}));
            assert.isNull(check(sig, {required: 'str'}));
        });

        it('errors on incorrect type inside shape', () => {
            const sig = t.shape({
                str: t.string,
                arr: t.array.optional,
            });

            assert.isNotNull(check(sig, {str: 1}));
            assert.isNull(check(sig, {str: '1'}));

            assert.isNotNull(check(sig, {str: '1', arr: 4}));
            assert.isNull(check(sig, {str: '1', arr: [1,2]}));
        });

        it('nests error messages', () => {
            const sig = t.shape({
                str: t.string,
                shape1: t.shape({
                    num: t.number,
                    shape2: t.shape({
                        bool: t.bool,
                    }),
                }),
            });

            const test = {
                str: 'str',
                shape1: {
                    num: 5,
                    shape2: {
                        bool: true,
                    },
                },
            };

            assert.isNull(check(sig, test));
            test.shape1.shape2.bool = 'huh?';
            assert.include(check(sig, test).message,
                         `shape1.shape2.bool:`);
            delete test.shape1.shape2;
            assert.include(check(sig, test).message,
                         `shape1:`);
        });

        it('disallows extra properties when strict', () => {
            const sig = t.shape({
                str: t.string,
            }).strict;

            assert.isNull(check(sig, {str: 'str'}));
            assert.isNotNull(check(sig, {str: 'str', num: 1}));

            assert.equal(check(sig, {str: 'str', num: 1, bool: true}).message,
                         `unspecified properties: num,bool`)
        });
    });

    describe('any', () => {
        it('errors on undefined and nothing else', () => {
            const types = Object.keys(primitiveTests);
            types.forEach((type) => {
                assert.isNull(check(t.any, primitiveTests[type]));
            });
            assert.isNotNull(check(t.any, undefined));
        });
    });

    describe('arrayOf', () => {
        it('errors on non arrays', () => {
            assert.isNotNull(check(t.arrayOf(t.string), {}));
            assert.isNotNull(check(t.arrayOf(t.string), 'test'));
        });

        it('ensures all elements are of inner type', () => {
            const sig1 = t.arrayOf(t.string);
            assert.isNotNull(check(sig1, ['1', '2', 3]));
            assert.isNull(check(sig1, ['1', '2', '3']));
            const sig2 = t.arrayOf(t.shape({num: t.number}));
            assert.isNotNull(check(sig2, [{num: 1}, {num: '2'}]));
            assert.isNull(check(sig2, [{num: 1}, {num: 2}]));
        });

        it('communicates the correct erroring index', () => {
            const sig = t.arrayOf(t.number);
            assert.include(check(sig, [1, 2, '3', 4, '5']).message, '2');
            assert.include(check(sig, ['1', 2, '3', 4, '5']).message, '0');
        });
    });

    describe('instanceOf', () => {
        it('should warn for invalid instances', () => {
            class Person{}
            class Cat{}

            assert.isNull(check(t.instanceOf(Person), new Person()));
            assert.isNotNull(check(t.instanceOf(Person), new Cat()));
        });

        it('should show <<anonymous>> if no constructor', () => {
            const func = () => {};
            func.constructor = null;
            assert.include(check(t.instanceOf(String), func).message, '<<anonymous>>');
        });
    });

    describe('objectOf', () => {
        it('should warn for invalid instances', () => {
            const sig = t.objectOf(t.string);
            assert.isNull(check(sig, {a: '1', b: '2', c: '3'}));
            assert.isNotNull(check(sig, {a: '1', b: 2, c: '3'}));
            assert.include(check(sig, {a: '1', b: 2, c: '3'}).message, 'b');
        });
    });

    describe('oneOf', () => {
        it('should warn for invalid instances', () => {
            const sig = t.oneOf([1, '2']);
            assert.isNull(check(sig, 1));
            assert.isNull(check(sig, '2'));
            assert.isNotNull(check(sig, '3'));
            assert.isNotNull(check(sig, 2));
        });
    });

    describe('oneOfType', () => {
        it('should warn for invalid instances', () => {
            const sig = t.oneOfType([t.string, t.bool]);
            assert.isNull(check(sig, true));
            assert.isNull(check(sig, '2'));
            assert.isNotNull(check(sig, 1));
            assert.isNotNull(check(sig, [false]));
        });
    });

    it('allows null', () => {
        assert.isNull(check(t.string, null));
        assert.isNull(check(t.array, null));
        assert.isNull(check(t.shape({str: t.string}), null));
        assert.isNull(check(t.instanceOf(String), null));
    });
});
