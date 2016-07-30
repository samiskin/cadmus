import check from './check.js';

export default (sig) => (func) => {
    return (...args) => {
        const ret = func(...args);
        const checked = check(sig, ret);
        if (checked !== null) {
            throw checked;
        }

        return ret;
    };
};
