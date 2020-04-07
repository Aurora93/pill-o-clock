const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives all user's progress record
 * 
 * @param {string} id the unique user
 *
 * @returns {Promise<object>} the user daily progress record (with the level of succes and the day date)
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id).lean()
        .then(user => {
            
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            return user.progressRecord
        })

}