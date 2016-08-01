import getType from './get-type.js';
import JanusError from './janus-error.js';

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

function isOptional(sig) {
    return sig.optional === null;
}

function anyChecker(element) {
    if (typeof element === 'undefined') {
        throw new JanusError({
            type: 'type-error',
            expected: 'any',
            actual: 'undefined',
        });
    }
}

function arrayOfChecker(element, sig) {
    validateType('array', element);
    const paramSig = sig.param;
    element.forEach((item, index) => {
        const itemError = check(paramSig, item);
        if (itemError !== null) {
            itemError.addPropertyParent(index);
            throw itemError;
        }
    });
}

function isStrict(sig) {
    return sig.strict === null;
}

function shapeChecker(element, sig) {
    validateType('object', element);
    const shape = sig.param;
    const sigKeys = Object.keys(shape);
    const elementKeys = new Set(Object.keys(element));
    sigKeys.forEach((sigKey) => {
        elementKeys.delete(sigKey);
        const paramSig = shape[sigKey];

        // Ensure required values exist
        if (element[sigKey] === undefined) {
            if (!isOptional(paramSig)) {
                throw new JanusError({
                    type: 'missing-property',
                    property: sigKey,
                    expectedType: paramSig.type,
                });
            } else {
                return;
            }
        }

        // Ensure existing value is of right type
        const paramError = check(paramSig, element[sigKey]);
        if (paramError !== null) {
            paramError.addPropertyParent(sigKey);
            throw paramError;
        }
    });

    // Ensure no extra values are included when strict is set
    if (isStrict(sig) && elementKeys.size > 0) {
        throw new JanusError({
            type: 'extra-property',
            properties: Array.from(elementKeys),
        });
    }
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

    any: anyChecker,
    arrayOf: arrayOfChecker,
    // element:
    // instanceOf:
    // node:
    // objectOf:
    // oneOf:
    // oneOfType:
    shape: shapeChecker,
};

function check(sig, obj) {
    try {
        checkers[sig.type](obj, sig);
        return null;
    } catch (e) {
        return e;
    }
}

export default check;
