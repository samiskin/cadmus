import {assert} from 'chai';
import t from '../src/type.js';

describe('type definition', () => {
    it('works with nested objects', () => {
        const sig = t.shape({
            color: t.string.isRequired,
            fontSize: t.number,
            options: t.shape({
                rounded: t.bool,
            }),
        });

        assert.equal(
            sig.data.fontSize.isRequired.optional,
            false
        );

        assert.equal(
            sig.data.options.data.rounded.type,
            'bool'
        );
    });
})
