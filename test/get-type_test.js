import {assert} from 'chai';
import { tests, typeAliases } from './primitive-tests.js';
import getType from '../src/get-type.js';

describe('getType', () => {
    it('works with basic types', () => {
        Object.keys(tests).forEach((type) => {
            const javascriptType = typeAliases[type] || type;
            assert.equal(getType(tests[type]), javascriptType);
        });

        assert.equal(getType(undefined), 'undefined');
    });
});
