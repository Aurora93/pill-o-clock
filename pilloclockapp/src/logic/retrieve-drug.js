const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Finds and receives the drug desired
 * 
 * @param {string} id drug's unique id
 * 
 * @returns {<object>} drug with all its properties
 * 
 * @throws {NotFoundError} if the drug does not exist
 * @throws {Error} if there are unkown error from the api or server's error
 */


module.exports = function (id) {
    validate.string(id, 'id')

    return (async() => {
   
        const response = await fetch(`${this.API_URL}/drug/${id}`)
    
        const { status } = response
        
        if (status === 200) {
            const drug = await response.json()
            
            return drug
        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 404) {
                throw new NotFoundError(error)
            }


            throw new Error(error)
        }

        throw new Error('server error')
    })()
    
}.bind(context)
