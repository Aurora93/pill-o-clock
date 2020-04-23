const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Finds and receives all user's prescriptions
 *
 * @returns {<object>} the user prescriptions (with drugs that user takes and times when user have to take) and drug's information
 * 
 * @throws {NotFoundError} if the user does not exist
 * @throws {Error} if there are unkown error from the api or server's error
 */

module.exports = function () {

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/medication`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    
        const { status } = response
        
        if (status === 200) {
            const medication = await response.json()
            
            return medication
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