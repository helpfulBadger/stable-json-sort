const hash = require('./hash');

describe('invalid Hash Options', () => {
    test('Should fail with an error message with an invalid sort option', () => {
        expect( hash( {}, {sort:"true"} ) ).toEqual( {"errMsg": "Error: Sort option must either be true or false.", "hash": "", "isValid": false} );
    });
    test("Should fail with a hash algorithm that isn't in the crypto library", () => {
        expect( hash( {}, {sort:true, alg:"true"} ) ).toEqual( { "errMsg":"Error: alg must be one of the values supported by the crypto library.", "hash":"", "isValid":false} );
    });
    test("Should fail with error message when the specified hash algorithm isn't a string", () => {
        expect( hash( {}, {sort:true, alg:12.4} ) ).toEqual( { "errMsg":"Error: alg must be a string and one of the values supported by the crypto library.", "hash":"", "isValid":false} );
    });
    test("Should fail with an error message when the sort option is null", () => {
        expect( hash( {}, {sort:null, alg:12.4} ) ).toEqual( { "errMsg":"Error: alg must be a string and one of the values supported by the crypto library.", "hash":"", "isValid":false} );
    });
    test("Should fail with an error message when the sort option is undefined", () => {
        expect( hash( {}, {sort:undefined, alg:12.4} ) ).toEqual( { "errMsg":"Error: alg must be a string and one of the values supported by the crypto library.", "hash":"", "isValid":false} );
    });
});

describe('Hashing tests', () => {
    test("Should succeed with defaults when no options are supplied", () => {
        expect( hash( {} ) ).toEqual( {"errMsg":"","hash":"44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a","isValid":true} );
    });
    test("Should succeed with sha256 algorithm and sorted object", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:true, alg:"sha256"} ) ).toEqual( {"errMsg":"","hash":"f63e3649d62eceaff56d7df1a18fe0d39cd86c3dfd51696d3e00b236ba4cbba6","isValid":true} );
    });
    test("Should succeed with sha256 algorithm and no sort", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:false, alg:"sha256"} ) ).toEqual( {"errMsg":"","hash":"f4f9ea45b03627bcc5328b93d4b0955dc2266c1c6616ebc8166d52469af83066","isValid":true} );
    });

    test("Should succeed with sha3-256 algorithm and sorted object", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:true, alg:"sha3-256"} ) ).toEqual( {"errMsg":"","hash":"f930dad51b4ec8e8aff8533b567f297ad3ae16fe67bd2ecf685901af9c876969","isValid":true} );
    });
    test("Should succeed with sha3-256 algorithm and no sort", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:false, alg:"sha3-256"} ) ).toEqual( {"errMsg":"","hash":"1ccd7669a7f568d2624034a4a0c730075cdcf35c51d3ac55630e833295ec21fc","isValid":true} );
    });

    test("Should succeed with md5 algorithm and sorted object", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:true, alg:"md5"} ) ).toEqual( {"errMsg":"","hash":"7654b19b3444afba0fee2bbb9e470446","isValid":true} );
    });
    test("Should succeed with md5 algorithm and no sort", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:false, alg:"md5"} ) ).toEqual( {"errMsg":"","hash":"71a66962175984a52aa9cb9bd5a1a036","isValid":true} );
    });

    test("Should succeed with md5-sha1 algorithm and sorted object", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:true, alg:"md5-sha1"} ) ).toEqual( {"errMsg":"","hash":"7654b19b3444afba0fee2bbb9e470446306f3d386a39a6966634b8b2c848fe5aeb08efab","isValid":true} );
    });
    test("Should succeed with md5-sha1 algorithm and no sort", () => {
        expect( hash( [{},"a string", 12, false, null], {sort:false, alg:"md5-sha1"} ) ).toEqual( {"errMsg":"","hash":"71a66962175984a52aa9cb9bd5a1a03618a3d9b04a119461c072171a5e3184afddb62f38","isValid":true} );
    });
});
