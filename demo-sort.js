#!/usr/bin/env node
const s = require('./sort');

console.log( `

This library creates a stable sort of nested objects of valid JSON data types based on the following precedence:
* null
* boolean
* number
* string
* object
* array

`);

console.log( `
Here is an example of a complex object that challenges many sorting libraries

[[[2,1],[],{"bc":2, "a":1},{},"before","a string", 4.2e+2, 12, true, 8.7e-2, false, null, null, ["zaxby's", "pizza"], [true, false], [null, null] ], [2,1],[],{"bc":2, "a":1},{},"before","a string", 4.2e+2, 12, true, 8.7e-2, true, false, null, null, ["zaxby's", "pizza"], [true, false], [null, null] ]

`)
let result = s.sort( 
    [[[2,1],[],{"bc":2, "a":1},{},"before","a string", 4.2e+2, 12, true, 8.7e-2, false, null, null, ["zaxby's", "pizza"], [true, false], [null, null] ], [2,1],[],{"bc":2, "a":1},{},"before","a string", 4.2e+2, 12, true, 8.7e-2, true, false, null, null, ["zaxby's", "pizza"], [true, false], [null, null] ]
)
console.log( "The sorted result is: \n" + JSON.stringify( result) )


console.log( `
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
`)
