const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives the user progress of the current day
 * 
 * @param {string} id the unique user
 *
 * @returns {Promise<array>} the array of patient's progress set up in boolean values
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id).lean()
        .then(user => {
            
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            return user.progress
        })

}