import getType from './get-type.js';

const handler = {
    get: function(target, name, receiver) {
        if (target[name] === undefined) {
            throw new Error(`access to undefined property ${name} detected`);
        }
        return Reflect.get(target, name, receiver);
    }
}

const proxy = (object) => {
    if (getType(object) !== 'object') {
        return object;
    }

    const proxied = {};
    const keys = Object.keys(object);
    keys.forEach((key) => proxied[key] = proxy(object[key]));

    return new Proxy(proxied, handler);
}


export default (func) => {
    return (...args) => {
        const ret = func(...args);
        return proxy(ret);
    };
};


