import {assert} from 'chai';
import { t, returns, check } from '../src/index.js';
import primitiveTests from './primitive-tests.js';

describe('index', () => {
    it('exports the correct properties', () => {
        assert.isDefined(t);
        assert.isDefined(returns);
        assert.isDefined(check);
    });
});
