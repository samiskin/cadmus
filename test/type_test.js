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
            strictOptions: t.shape({
                sizes: t.arrayOf(t.number),
            }).strict,
        });

        assert.equal(sig.param.color.isRequired, null);
        assert.equal(sig.param.strictOptions.strict, null);

        assert.equal(
            sig.param.options.param.rounded.type,
            'bool'
        );
    });
})
