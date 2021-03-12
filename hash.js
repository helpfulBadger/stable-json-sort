//@ts-check
const crypto = require('crypto');
const s = require('./sort')

function hash( obj, options ) {

    const { isValid, errMsg, config } = validateOptions( options )
    if ( !isValid ){
        return { isValid, errMsg, hash: ""}
    }

    const hash = crypto.createHash( config.alg );

    let o = obj;
    if ( config.sort ){
        o = s.sort( obj );
    }
    hash.update( JSON.stringify( o ));
    let result = hash.digest('hex');
    return { isValid, errMsg, hash: result}
}

function validateOptions( options ){

    let config = {
        sort: true,
        alg: "sha256"
    };
    
    let valid = true;
    let msg = "";

    if (options ){
        if ( (options.sort != null) && options.sort != undefined ) {
          if (typeof options.sort === 'boolean') {
            config.sort = options.sort
          } else {
              valid = false;
              msg = "Error: Sort option must either be true or false."
          }
        }
        if (options.alg) {
            if (typeof options.alg === 'string') {

                let alg = crypto.getHashes();    
                if ( !alg.includes( options.alg )){
                    valid = false;
                    msg = "Error: alg must be one of the values supported by the crypto library."
                } else {
                    config.alg = options.alg
                }
            } else {
                valid = false;
                msg = "Error: alg must be a string and one of the values supported by the crypto library."
            }
          }  
    }

    return { isValid: valid, errMsg: msg, config: config}
}

module.exports = hash;
