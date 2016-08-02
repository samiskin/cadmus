import {assert} from 'chai';
import unboundToRP from '../src/toRP.js';
import t from '../src/type.js';
import React from 'react';
const RP = React.PropTypes;
const toRP = (sig) => unboundToRP(RP, sig);

function satisfiesRP(propType, object) {
    return propType({obj: object}, 'obj') === null;
}

describe('convert to React PropTypes', () => {
    it('handles primitives', () => {
        assert(satisfiesRP(toRP(t.string), 'wat'));
        assert(!satisfiesRP(toRP(t.number), true));
        assert(satisfiesRP(toRP(t.array), [1,4]));
    });

    it('handles objectOf/arrayOf', () => {
        const objOfRP = toRP(t.objectOf(t.string));
        assert(satisfiesRP(objOfRP, {a: '1', b: '2'}));
        assert(!satisfiesRP(objOfRP, {a: '1', b: 2}));

        const arrOfRP = toRP(t.arrayOf(t.array));
        assert(satisfiesRP(arrOfRP, [[1,2],[5,2]]));
        assert(!satisfiesRP(arrOfRP, [[1,2],'5,2']));
    });

    it('handles shape', () => {
        const shapeRP = toRP(t.shape({
            str: t.string,
            arr: t.arrayOf(t.bool),
            shape: t.shape({
                num: t.number,
            }),
            optional: t.number.optional,
        }));

        assert(satisfiesRP(shapeRP, {
            str: 'str',
            arr: [true, false, true],
            shape: {
                num: 1,
            }
        }));

        assert(!satisfiesRP(shapeRP, {
            str: 'str',
            arr: [true, 'test', true],
            shape: {
                num: 1,
            }
        }));

        assert(!satisfiesRP(shapeRP, {
            str: 'str',
            arr: [true, 'test', true],
            shape: {
            }
        }));
    });

    it('handles oneOfType', () => {
        const oneOfTypeRP = toRP(t.oneOfType([
            t.shape({ str: t.string }),
            t.arrayOf(t.number),
            t.bool,
        ]));

        assert(satisfiesRP(oneOfTypeRP, {
            str: 'hi',
        }));
        assert(satisfiesRP(oneOfTypeRP, [
            1,2,6,-1
        ]));
        assert(satisfiesRP(oneOfTypeRP, false));

        assert(!satisfiesRP(oneOfTypeRP, 3));
    });

    it('handles oneOf/instanceOf', () => {
        const oneOfRP = toRP(t.oneOf([1, 'test', true]));
        assert(satisfiesRP(oneOfRP, true));
        assert(!satisfiesRP(oneOfRP, false));
        assert(satisfiesRP(oneOfRP, 'test'));
        assert(!satisfiesRP(oneOfRP, 'teest'));
        assert(satisfiesRP(oneOfRP, 1));
        assert(!satisfiesRP(oneOfRP, 3));
    });
});
