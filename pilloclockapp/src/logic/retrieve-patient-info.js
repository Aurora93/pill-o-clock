const { NotAllowedError, NotFoundError } = require('../errors') 
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context = require('./context')

/**
 * Finds and receives the patient info (the daily progress and the progress of the current day) to the pharmacist
 * 
 * @param {string} patientId the unique user id from the pharmacist's patient
 *
 * @returns {Promise<object>} the daily progress and the progress of the current day
 * 
 * @throws {NotFoundError} if the pharmacist or patient does not exist
 * @throws {Error} if there are unkown error from the api or server's error
 */

module.exports = function (patientId) {
    validate.string(patientId, 'patientId')
    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/retrieve-patient-info/${patientId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    
        const { status } = response
        
        if (status === 200) {
            const patientInfo = await response.json()
            
            return patientInfo
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