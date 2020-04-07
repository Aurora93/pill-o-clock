const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Add a boolean if the user hace taked the drug or not to an daily array of progress
 * 
 * @param {string} id user's unique id
 * 
 * @param {boolean} progress determine if the user have taked the drug (tue) or not (false)
 *
 * @returns {<undefined>} an undefined on a successful addition
 * 
 * @throws {NotFoundError} if the user does not exist
 *
 * @throws {Error} if there are unkown error from the api or server's error
 */


module.exports = function (check) {
    validate.type(check, 'check', Boolean)

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/add-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
            body: JSON.stringify({ check })
        })
    
        const { status } = response
        
        if (status === 201) return

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