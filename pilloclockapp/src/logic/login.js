const { validate } = require ('../utils')
const { NotAllowedError } = require('../errors')
const fetch = require ('node-fetch')
const context = require('./context')

/**
 * Checks user credentials against the storage, and gives the token
 * 
 * @param {string} email user's unique e-mail
 * @param {string} password user's password
 * 
 * @returns {<undefined>} if the authetication was succesful
 * 
 * @throws {NotAllowedError} on wrong credentials
 *
 * @throws {Error} if there are unkown error from the api or server's error
 */

module.exports = function(email, password) {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return (async() => {
        const response = await fetch(`${this.API_URL}/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const { status } = response

        if (status === 200) {
            const { token } = await response.json()

            await this.storage.setItem('token', token)
            return
        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')

    })()
  
}.bind(context)