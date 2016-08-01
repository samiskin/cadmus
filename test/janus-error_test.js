import {assert} from 'chai';
import JanusError from '../src/janus-error.js';

const typeErrorData = {
    type: 'type-error',
    expected: 'string',
    actual: 'number',
};

const missingPropertyData = {
    type: 'missing-property',
    property: 'str',
    expectedType: 'string',
}

const extraPropertyDataSingular = {
    type: 'extra-property',
    properties: ['property']
}

const extraPropertyDataPlural = {
    type: 'extra-property',
    properties: ['parent', 'child']
}

describe('janus error type', () => {

    it('works for all types of errors', () => {
        assert.doesNotThrow(() => new JanusError(typeErrorData));
        assert.doesNotThrow(() => new JanusError(missingPropertyData));
        assert.doesNotThrow(() => new JanusError(extraPropertyDataSingular));
        assert.doesNotThrow(() => new JanusError(extraPropertyDataPlural));
    });

    it('is an instance of Error', () => {
        const error = new JanusError(typeErrorData);
        assert.isDefined(error.message);
        assert.isDefined(error.name);
    });

    it('chains property names', () => {
        const chain1 = new JanusError(typeErrorData, ['propName']);
        assert.include(chain1.message, 'propName: ');

        const chain2 = new JanusError(typeErrorData, ['parent', 'child']);
        assert.include(chain2.message, 'parent.child: ');
    });

    it('can have property names added', () => {
        const chain1 = new JanusError(typeErrorData);
        chain1.addPropertyParent('child');
        chain1.addPropertyParent(1);
        chain1.addPropertyParent('parent');
        assert.include(chain1.message, 'parent.1.child:');
    });

});
