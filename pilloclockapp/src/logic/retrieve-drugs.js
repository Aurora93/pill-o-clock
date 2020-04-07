const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Finds and receives all drugs from the database
 * 
 * @returns {<array>} all drugs from the data base
 * 
 * @throws {NotFoundError} if the drug does not exist
 * @throws {Error} if there are unkown error from the api or server's error
 */

module.exports = function () {
    return (async() => {
   
        const response = await fetch(`${this.API_URL}/drugs`)
    
        const { status } = response
        
        if (status === 200) {
            const drugs = await response.json()
            
            return drugs
        }

        if (status >= 400 && status < 500) {

            throw new Error(error)
        }

        throw new Error('server error')
    })()
    
}.bind(context)
