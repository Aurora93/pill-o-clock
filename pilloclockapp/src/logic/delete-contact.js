const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Add a new contact to the array of user contacts
 * 
 * @param {string} idSecondUser the id of the user to delete
 *
 * @returns {Promise<undefined>} an empty Promise on a successful deletion
 * 
 * @throws {NotFoundError} if the users do not exist
 */


module.exports = function (idSecondUser) {
    validate.string(idSecondUser, 'idSecondUser')

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/delete-contact/${idSecondUser}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
        })
    
        const { status } = response
        
        if (status === 200) return

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