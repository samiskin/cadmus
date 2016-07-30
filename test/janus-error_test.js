import {assert} from 'chai';
import JanusError from '../src/janus-error.js';

const typeErrorData = {
    type: 'type-error',
    expected: 'string',
    actual: 'number',
};

describe('janus error type', () => {
    it('is an instance of Error', () => {
        const error = new JanusError();
        assert.isDefined(error.message);
        assert.isDefined(error.name);
    });

    it('chains property names', () => {
        const chain1 = new JanusError(typeErrorData, ['propName']);
        assert.equal(chain1.message,
                     'propName: expected string, received number');

        const chain2 = new JanusError(typeErrorData, ['parent', 'child']);
        assert.equal(chain2.message,
                     'parent.child: expected string, received number');
    });

    it('can have property names added', () => {
        const chain1 = new JanusError(typeErrorData);
        chain1.addPropertyParent('child');
        chain1.addPropertyParent('parent');
        assert.equal(chain1.message,
                     'parent.child: expected string, received number');

    });

});
