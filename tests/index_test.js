import {assert} from 'chai';
import { t } from '../src/index.js';

describe('index', () => {
    it('runs a test', () => {
        assert.equal(t, 'wat');
    });
});
