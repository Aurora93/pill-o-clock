const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Add the day progress of the user to his daily record, with the level of success and the date of this day
 * 
 * @param {object} records an object with the data and the progress of the user in determinate date
 *
 * @returns {<undefined>} an undefined on a successful addition
 * 
 * @throws {NotFoundError} if the user does not exist
 *
 * @throws {Error} if there are unkown error from the api or server's error
 */

module.exports = function (record) {
    validate.type(record, 'record', Object)

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/add-progress-record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
            body: JSON.stringify(record)
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