const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotAllowedError } = require('pill-o-clock-errors')
const bcrypt = require('bcryptjs')

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
 * @returns {Promise<string>} an empty Promise on a successful registration
 * 
 * @throws {NotAllowedError} if a user with that same email already exists on the database
 */

module.exports = (name, surname, gender, age, phone, profile, email, password) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(gender, 'gender')
    validate.gender(gender)
    validate.type(age, 'age', Number)
    validate.string(phone, 'phone')
    validate.string(profile, 'profile')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, surname, gender, age, phone, profile, email, password, created: new Date })

            return user.save()
        })
        .then(() => { })
}