const { validate } = require ('../utils')
const { NotAllowedError } = require('../errors')
const fetch = require ('node-fetch')
const context = require('./context')

/**
 * Registers a new user on the database
 * 
 * @param {string} name user's name
 * @param {string} surname user's surname
 * @param {string} email user's unique e-mail
 * @param {string} gender user's gender, with a three-choice
 * @param {number} age user's age
 * @param {number} phone user's phone number
 * @param {number} profile user's profile: patient or pharmacist
 * @param {number} email user's email
 * @param {string} password user's password, with further encryptation
 * 
 * @returns {<undefined>} an undefined on a successful registration
 * @throws {Error} if there are unkown error from the api or server's error
 * 
 * @throws {NotAllowedError} if a user with that same email already exists on the database
 */

module.exports = function (name, surname, gender, age, phone, profile, email, password){
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.gender(gender)
    validate.type(age, 'age', Number)
    validate.string(phone, 'phone')
    validate.string(profile, 'profile')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password') 
    
    return (async() => {

        const response = await fetch(`${this.API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, gender, age, phone, profile, email, password })
        })

        const { status } = response

        if (status === 201) return

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 409) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')

    })()
   
}.bind(context)
