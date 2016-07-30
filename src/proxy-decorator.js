import check from './check.js';
import JanusError from './janus-error.js';

const handler = (sig) => {
    return {
        get: function(target, name, receiver) {
            if (sig.param[name] === undefined) {
                throw new JanusError({
                    type: 'undefined-property',
                    propertyName: name,
                });
            }

            return Reflect.get(target, name, receiver);
        }
    }
}

const proxy = (sig, object) => {
    const proxied = {};
    const keys = Object.keys(sig.param);
    keys.forEach((key) => {
        if (sig.param[key].type === 'shape') {
            proxied[key] = proxy(sig.param[key], object[key]);
        } else {
            proxied[key] = object[key];
        }
    });

    return new Proxy(proxied, handler(sig));
}

const decorator = (sig) => (func) => {
    return (...args) => {
        const ret = func(...args);
        const checked = check(sig, ret);
        if (checked !== null) {
            throw checked;
        }

        if (sig.type === 'shape') {
            return proxy(sig, ret);
        }

        return ret;
    };
};

export default decorator;
