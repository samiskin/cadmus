import getType from './get-type.js';

class JanusError extends Error {
    constructor(data) {
        super('');
        switch (data.type) {
            case 'type-error': {
                const {expected, actual} = data;
                this.message = `expected ${expected}, received ${actual}`;
                break;
            }
        }
    }
}

function validateType(type, element) {
    const elementType = getType(element);
    if (elementType !== type) {
        throw new JanusError({
            type: 'type-error',
            expected: type,
            actual: elementType,
        });
    }

    return true;
}

const createPrimitiveChecker = (type) => (ele) => validateType(type, ele);

export const primitives = [
    'array',
    'bool',
    'date',
    'func',
    'number',
    'object',
    'regexp',
    'string',
    'symbol',
];

const typeAliases = {
    bool: 'boolean',
    func: 'function',
};

const primitiveCheckers = primitives.reduce((obj, primitive) => {
    const javascriptType = typeAliases[primitive] || primitive;
    obj[primitive] = createPrimitiveChecker(javascriptType);
    return obj;
}, {});

const checkers = {
    ...primitiveCheckers,

    // any:
    // arrayOf:
    // element:
    // instanceOf:
    // node:
    // objectOf:
    // oneOf:
    // oneOfType:
    // shape:
};

function check(sig, obj) {
    try {
        return checkers[sig.type](obj, sig);
    } catch (e) {
        return e;
    }
}

export default check;
