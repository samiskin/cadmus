const tests = {
    'array': [1,2],
    'bool': false,
    'date': (new Date()),
    'func': () => {},
    'number': 1,
    'object': {a: 'b'},
    'regexp': /test/,
    'string': 'test',
    'symbol': Symbol('test'),
};

const typeAliases = {
    bool: 'boolean',
    func: 'function',
};

export default tests;
export { tests, typeAliases };
