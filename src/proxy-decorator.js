import checkers from './checkers.js';

const decorator = (sig) => (func) => {
    return (...args) => {
        const ret = func(...args);
        checkers[sig.type](ret);
        return ret;
    };
};

export default decorator;
