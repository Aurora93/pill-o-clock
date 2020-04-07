const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotAllowedError, NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives data from a desired user
 * 
 * @param {string} id user's unique id
 * 
 * @returns {Promise<string>} user's name, surname, gender, age, phone, profile, email and id from storage
 * 
 * @throws {NotFoundError} if the user does not exist
 */


module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            user.id = user._id

            delete user._id

            user.retrieved = new Date

            return user.save()
        })
        .then(({ name, surname, gender, age, phone, profile, email, id }) => ({ name, surname, gender, age, phone, profile, email, id }))
}