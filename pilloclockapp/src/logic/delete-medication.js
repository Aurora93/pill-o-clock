const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Finds and delete a specific drug prescription from the user's prescriptions
 * 
 * @param {string} id user's unique id
 * 
 * @param {drugId} drugId drug's unique id, the drug that user want to delete of his/her prescription
 *
 * @returns {<undefined>} undefined on a successful deletion
 * 
 * @throws {NotFoundError} if the user, the drug or the prescription does not exist
 *
 * @throws {Error} if there are unkown error from the api or server's error
 */


module.exports = function (idDrug) {
    validate.string(idDrug, 'idDrug')

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/prescription/${idDrug}`, {
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