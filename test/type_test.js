import {assert} from 'chai';
import t from '../src/type.js';

describe('type definition', () => {
    it('works with nested objects', () => {
        const sig = t.shape({
            color: t.string.optional,
            fontSize: t.number,
            options: t.shape({
                rounded: t.bool,
            }),
            strictOptions: t.shape({
                sizes: t.arrayOf(t.number),
            }).strict,
        });

        assert.isNull(sig.param.color.optional);
        assert.isNull(sig.param.strictOptions.strict);

        assert.equal(
            sig.param.options.param.rounded.type,
            'bool'
        );
    });

    it('handles optional and strict', () => {
        const sig = t.shape({
            required: t.string,
            optional: t.number.optional,
            strictOptional: t.shape({
                bool: t.bool,
            }).strict.optional,
            optionalStrict: t.shape({
                arr: t.array,
            }).optional.strict,
        }).strict;

        assert.isNull(sig.param.optionalStrict.optional);
        assert.isNull(sig.param.optionalStrict.strict);
        assert.isNull(sig.param.strictOptional.optional);
        assert.isNull(sig.param.strictOptional.strict);
    });
})
