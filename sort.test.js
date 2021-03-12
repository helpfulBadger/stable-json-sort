const s = require('./sort');

describe('TEST isEmpty Function', () => {
    test.each([
        [ {"a":1},       false],
        [  ["bc"],       false],
        [      {},        true],
        [      [],        true],
    ])('Is date?  %j should be %j', (a, expected) => {
            expect( s.isEmpty( a ) ).toBe( expected );
    });
});

describe('TEST isDate Function', () => {
    test.each([
        [   new Date(),  true],
        [   true,       false],
        [ 1.0e+3,       false],
        [  "abc",       false],
        [     {},       false],
        [     [],       false],
    ])('Is empty?  %j should be %j', (a, expected) => {
            expect( s.isDate( a ) ).toBe( expected );
    });
});

describe('TEST getType Function', () => {
    test.each([
        [   null,      "null"],
        [   true,   "boolean"],
        [ 1.0e+3,    "number"],
        [  "abc",    "string"],
        [     {},    "object"],
        [     [],     "array"],
    ])('get data type: %j should be %j', (a, expected) => {
            expect( s.getType( a ) ).toBe( expected );
    });
});

/* Data types and their numeric equivalent
    "null": 0,
    "boolean": 1,
    "number": 2,
    "string": 3,
    "object": 4,
    "array": 5
*/

describe('TEST compareTypes Function: Compare data types where the left side should be less than the right', () => {
    test.each([
        [ null,   true,    -1],
        [ null,   1.02,    -1],
        [ null,   "abc",   -1],
        [ null,   {},      -1],
        [ null,   [],      -1],
        [ true,   1.02e+3, -1],
        [ true,   "abc",   -1],
        [ true,   {},      -1],
        [ true,   [],      -1],
        [ true,   [],      -1],
        [ 1.0e+3, "abc",   -1],
        [ 1.0e+3, {},      -1],
        [ 1.0e+3, [],      -1],
        [ "abc",  {},      -1],
        [ "abc",  [],      -1],
        [ {},     [],      -1],
    ])('Data Type: %j < %j', (a, b, expected) => {
            expect( s.compareTypes( a, b ) ).toBeLessThanOrEqual( expected );
    });
});

describe('TEST compareTypes Function: Compare data types where the left side should be greater than the right', () => {
    test.each([
        [ [1,2],  null,  1],
        [ true,   null,  1],
        [ "abc",  null,  1],
        [ "abc",  false, 1],
        [ "abc",  4,     1],
        [ {},     null,  1],
        [ {},     false, 1],
        [ {},     4,     1],
        [ {},     "abc", 1],
        [ [],     null,  1],
        [ [],     false, 1],
        [ [],     4,     1],
        [ [],     "abc", 1],
    ])('Data Type: %j > %j', (a, b, expected) => {
            expect( s.compareTypes( a, b ) ).toBeGreaterThanOrEqual( expected );
    });
});

describe('TEST compareElements Function: Compare 2 elements with the same type and shape', () => {
    test.each([
        [           null,             null,   0],
        [           true,             true,   0],
        [           1.03,             1.03,   0],
        [          "abc",            "abc",   0],
        [ {"a":1, "b":2},   {"b":2, "a":1},   0],
        [            [1],              [1],   0], 

        [          false,             true,  -1],
        [           1.03,          2.03e+3,  -1],
        [           "ab",            "abc",  -1],
        [ {"a":1, "b":2},   {"a":1, "b":3},  -1], //first keys and values are the same, 2nd keys are same but value on right is greater

        [           true,            false,   1],
        [          "abc",             "ab",   1],
        [        2.03e+3,          1.03e-2,   1],
        [ {"a":2, "b":2},   {"a":1, "b":2},   1],  //the value of the first key is greater than the value of the 2nd
        [ {"a":1, "b":3},   {"a":1, "b":2},   1],  //the 1st 2 keys and their values are the same, the 2nd keys are same but value of the 2nd key on left is greater

    ])('Compare: %j with %j should be %j', (a, b, expected) => {
            expect( s.compareElements( a, b ) ).toBe( expected );
    });
});

describe('TEST compareElements Function: Compare 2 elements with the different shape', () => {
    test.each([
        [              {},       {"a":1, "bd":2}, -1 ], 
        [         {"a":1},       {"a":1, "bd":2}, -1 ],
        [ {"a":1, "bc":2},       {"a":1, "bd":2}, -1 ],
        [              [],                   [1], -1 ], 

        [ {"a":1, "bd":2},       {"a":1, "bc":2},  1 ],
        [ {"a":1, "bd":2},               {"a":1},  1 ],
        [ {"a":1, "bd":2},                    {},  1 ],
        [             [1],                    [],  1 ], 
    ])('Compare: %j with %j should be %j', (a, b, expected) => {
            expect( s.compareElements( a, b ) ).toBe( expected );
    });
});

describe('TEST sort Function: progressively more recursively complicated objects', () => {
    test.each([
        [ new Date("2021-03-09T18:16:41.366Z"),              "2021-03-09T18:16:41.366Z"],
        [                                 null,                                    null],
        [                                 true,                                    true],
        [                                    1,                                       1],
        [                                "abc",                                   "abc"],
        [                                   {},                                      {}],
        [                                   [],                                      []],
        [                                [2,1],                                   [1,2]],
        [                             [2,null],                                [null,2]],
        [                      {"bc":2, "a":1},                         {"a":1, "bc":2}],
        [     [{},"a string", 12, false, null],       [null, false, 12, "a string", {}]],
        [  [[],{},"a string", 12, false, null],    [null, false, 12, "a string", {},[]]],
        [
            [[2,1],[],{"bc":2, "a":1},{},"before","a string", 12, false, null], // input
            [null, false, 12, "a string","before", {},{"a":1, "bc":2},[],[1,2]] // expected
        ], 
        [ 
            [ {"c":3,"a":1,"b":"2"},{"b":null,"c":null,"a":null}],      // input
            [ {"a":null,"b":null,"c":null},{"a":1,"b":"2","c":3}]       // expected
        ],
        [ 
            [ {"c":true,"a":true,"b":false}, {"b":null,"c":null,"a":null}],      // input      
            [ {"a":null,"b":null,"c":null},  {"a":true,"b":false,"c":true}]      // expected
        ],
        [ 
            [ {"c":true,"a":[],"b":false}, {"b":null,"c":null,"a":{}}],
            [ {"a":{},"b":null,"c":null},  {"a":[],"b":false,"c":true}] 
        ],        
        [
            // input
            [[[2,1],[],{"bc":2, "a":1},{},"before","a string", 4.2e+2, 12, true, 8.7e-2, false, null, null, ["zaxby's", "pizza"], [true, false], [null, null] ], [2,1],[],{"bc":2, "a":1},{},"before","a string", 4.2e+2, 12, true, 8.7e-2, true, false, null, null, ["zaxby's", "pizza"], [true, false], [null, null] ], 
            // output
            //When printed this way it makes the sorting precedence more clear:
            [
                null,null,                         // null elements will sort first in an array
                false,true,true,                   // followed by the other data types
                0.087,12,420,                      // and sorted within their type grouping
                "a string","before",
                {},                                // Empty objects sort before non-empty objects
                {"a":1,"bc":2},
                [],                                // All objects are sorted before before any type of array, even empty arrays.
                [null,null],
                [                                  // Objects and arrays are recursively sorted before comparison
                    null,null,                     // Then the first element is compared to the first element of other arrays based on data type
                    false,true,                    // Then elements of the same data type are compared to see which is less
                    0.087,12,420,
                    "a string","before",
                    {},
                    {"a":1,"bc":2},
                    [],
                    [null,null],
                    [false,true],
                    [1,2],
                    ["pizza","zaxby's"]
                ],
                [false,true],                       // The large complex array sorts before these arrays because the first elements are sorted by data type precedence
                [1,2],
                ["pizza","zaxby's"]
            ]
        ]
    ])('Sorted: %j should be %j', (a, expected) => {
        let result = s.sort( a ) 
        //console.log( JSON.stringify( result ))
        expect( result ).toEqual( expected );
    });
});
