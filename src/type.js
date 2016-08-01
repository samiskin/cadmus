function basic(type, optional = false, nullable = false) {
    return {
        type,
        optional: optional ? null
            : basic(type, true, nullable),
        param: null,
    };
}

function parameterized(name) {
    return (param) => ({
        ...basic(name),
        param,
    });
}

function shapeType() {
    return (param) => ({
        ...basic('shape'),
        param,
        strict: {
            ...basic('shape'),
            param,
            strict: null,
        }
    });
}


// Note: bool and func are used because boolean and function are keywords
const t = {
    array: basic('array'),
    bool: basic('bool'),
    date: basic('date'),
    func: basic('func'),
    number: basic('number'),
    object: basic('object'),
    regexp: basic('regexp'),
    string: basic('string'),
    symbol: basic('symbol'),

    any: basic('any'),
    arrayOf: parameterized('arrayOf'),
    instanceOf: parameterized('instanceOf'),
    objectOf: parameterized('objectOf'),
    oneOf: parameterized('oneOf'),
    oneOfType: parameterized('oneOfType'),
    shape: shapeType(),
};


export default t;
