#!/usr/bin/env node
const hash = require('./hash');

let result = hash( [{},"a string", 12, false, null], {sort:false, alg:"sha256"} );

console.log( "The hash is: \n" + JSON.stringify( result.hash ) )
