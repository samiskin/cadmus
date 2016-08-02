function basic(type, base) {
    return optional({
        type,
        param: null,
    });
}

function optional(base) {
    return {
        ...base,
        optional: {
            ...base,
            optional: null,
        },
    };
}

function strictOptional(base) {
    return {
        ...base,
        strict: {
            ...base,
            strict: null,
            optional: {
                ...base,
                optional: null,
                strict: null,
            }
        },
        optional: {
            ...base,
            optional: null,
            strict: {
                ...base,
                optional: null,
                strict: null,
            }
        }
    };
}

function parameterized(name) {
    return (param) => ({
        ...basic(name),
        param,
    });
}

function shapeType() {
    return (param) => strictOptional({
        type: 'shape',
        param,
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
    null: basic('null'),

    any: basic('any'),
    arrayOf: parameterized('arrayOf'),
    instanceOf: parameterized('instanceOf'),
    objectOf: parameterized('objectOf'),
    oneOf: parameterized('oneOf'),
    oneOfType: parameterized('oneOfType'),
    shape: shapeType(),
};


export default t;
