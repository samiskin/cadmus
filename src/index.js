/*
React Proptypes: https://github.com/facebook/react/blob/master/src/isomorphic/classic/types/ReactPropTypes.js
*/

import t from './type.js';
import returns from './proxy-decorator.js';
import checkers from './checkers.js';

function check(sig, obj) {
    try {
        return checkers[sig.type](obj);
    } catch (e) {
        return e;
    }
}

export {
    t,
    returns,
    check,
};
