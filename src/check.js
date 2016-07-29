import getType from './get-type.js';

class JanusError extends Error {
    constructor(data) {
        super('');
        switch (data.type) {
            case 'primitive': {
                const {expected, actual} = data;
                this.message = `expected ${expected}, received ${actual}`;
                break;
            }
        }
    }
}

function createPrimitiveChecker(type) {
    const validate = (element) => {
        const elementType = getType(element);
        if (elementType === type) {
            return true;
        }

        throw new JanusError({
            type: 'primitive',
            expected: type,
            actual: elementType,
        });
    };
    return validate;
}

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
