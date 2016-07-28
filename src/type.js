function basic(type, isRequired = false) {
    return {
        type,
        optional: !isRequired,
        isRequired: isRequired ? null
            : basic(type, true),
    };
}

function parameterized(name) {
    return (data) => ({
        ...basic(name),
        data,
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
    element: parameterized('element'),
    instanceOf: parameterized('instanceOf'),
    node: parameterized('node'),
    objectOf: parameterized('objectOf'),
    oneOf: parameterized('oneOf'),
    oneOfType: parameterized('oneOfType'),
    shape: parameterized('shape'),
};

export default t;
