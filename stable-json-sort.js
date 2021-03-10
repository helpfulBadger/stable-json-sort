/**
 * Call sort with any object or array and get back stable, recursively sorted JSON.stringfyable object.
 * @param {*} obj 
 * @returns sorted object
 */
function sort( obj ) {
    switch ( typeof obj ) {
        case "object":
            if ( obj == null ){
                return obj
            } else if ( isDate( obj ) ){
                return obj.toISOString()
            } else if ( Array.isArray( obj ) ){
                return sortArray( obj );
            } else {
                return sortObject( obj );
            }
        case "number":
        case "string":
        case "boolean":
            return obj;
//        default:
//            return null;
    }
}

function sortObject( obj ){
    let result = {}
    let keys = Object.keys( obj )
    keys = keys.sort();
    for ( key of keys ){
        result[ key ] = sort( obj[ key ]);
    }
    return result;
}

function sortObjectArray( objects ){
    let results = []
    for ( e of objects ){
        e = sort( e )
        results.push( e );
    }
    results = results.sort( compareElements );
    return results;
}

function sortArray( obj ) {
    let results = [];

    let groups = groupByType( obj );

    let ordering = ["null", "boolean", "number", "string", "object", "array"]
    for ( type of ordering ){
        if ( groups[type] ){
            switch ( type ) {
                case "null":
                case "boolean":
                case "string":
                    results = results.concat( groups[type].sort() );
                    break;
                case "number":
                    results = results.concat( groups[type].sort( function(a, b){return a - b} ) );
                    break;
                case "array":
                case "object":
                    results = results.concat( sortObjectArray( groups[type] ) )
                    break;
//                default:
//                    console.log(`ERROR: Unhandled type: ${type}`);
            }
        }
    }
    return results;
}

function compareElements(a, b) {
    let result = compareTypes(a, b);    // Consistently sort by data type first before we look deeper
    if ( result != 0 ) return result;   // If the data types don't match then we are finished.
    switch ( getType( a ) ) {
        case "null":
            return 0;
        case "boolean":
        case "number": // Prevent type coercion by using a math function
            return compareNumbers( a, b );
        case "string": 
            return compareStrings( a, b );
        case "array":
        case "object":
            return compareObjects( a, b );
//        default:
//            console.log(`ERROR: Comparing Elements with an Unhandled type: ${type}`);
    }
}

function compareTypes( a, b ){
    let order = { 
        "null":    0,
        "boolean": 1,
        "number":  2,
        "string":  3,
        "object":  4,
        "array":   5
    }
    let typeAName = getType( a );
    let typeBName = getType( b );

    let typeA = order[ typeAName ];
    let typeB = order[ typeBName ];

    if ( typeA != typeB ){
        return typeA - typeB
    }
    return 0
}

function compareStrings( a, b ){
    //Alphabetic sort: avoid type coercion by avoiding the minus sign
    if ( a < b ) return -1; // The result is negative if a should be ahead of b when sorted.
    if ( a > b ) return 1;  // The result is positive if b should be ahead of a when sorted.
    return 0;               // Otherwise they must be the same
}

function compareNumbers( a, b ){
    let difference =  a - b;
    if ( difference < 0 ) return -1;
    if ( difference > 0 ) return 1;
    return 0;
}

function compareEmpty( a, b ){
    let aIsEmpty = isEmpty( a )
    let bIsEmpty = isEmpty( b )
    if ( aIsEmpty && !bIsEmpty ) return -1;
    if ( !aIsEmpty && bIsEmpty ) return 1;
    return 0;
}

function compareObjects( a, b ){
    let emptyObject = compareEmpty( a, b);
    if ( emptyObject != 0 ) return emptyObject;

    let aKeys = Object.keys( a ).sort();
    let bKeys = Object.keys( b ).sort();
    let limit = aKeys.length;
    if ( bKeys.length > aKeys.length ) limit = bKeys.length;

    let i
    for (i = 0; i < limit; i++) {
        if ( !aKeys[i] ) return -1
        if ( !bKeys[i] ) return 1
        if ( aKeys[i] < bKeys[i]) return -1
        if ( aKeys[i] > bKeys[i]) return 1

        // aKeys[i] == bKeys[i] So, now compare the values for each of those keys
        let potentialResult =  compareElements( a[ aKeys[i] ], b[ bKeys[i] ])
        if (potentialResult != 0 ) return potentialResult // there may be more tie breakers so flow down to the next if it exists
    }
    return 0; // Everything was the same so return 0
}

function groupByType( obj ){
    let result = {};

    obj.map(
        function(currentValue, /*index, arr*/ ){
            let dataType = getType( currentValue );
            if ( !result[ dataType ] ) result[ dataType ] = [];
            result[ dataType ].push( currentValue );
        }
    );

    return result;
}

function getType( obj ){
    let dataType = typeof obj;
    if ( dataType == "object") {
        if ( obj == null ){
            dataType = "null"
        } else if ( Array.isArray( obj ) ){
            dataType = "array"
        }
    }
    return dataType
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isDate( obj ) {
    return obj.constructor === Date;
}

module.exports = { sort, sortObject, sortArray, isDate, isEmpty, getType, compareElements, compareTypes };
