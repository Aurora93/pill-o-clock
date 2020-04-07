const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Add a new contact to the array of user contacts
 * 
 * @param {string} id2 the id of the user to add
 *
 * @returns {<undefined>} an undefined on a successful addition
 * 
 * @throws {NotFoundError} if the user does not exist
 *
 * @throws {Error} if there are unkown error from the api or server's error
 */


module.exports = function (id2) {
    validate.string(id2, 'id')

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/add-contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
            body: JSON.stringify({ id2 })
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