const { validate } = require('pill-o-clock-utils')
const { models: { User, Drug, GuideLine } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives all user's prescriptions
 * 
 * @param {string} id the unique user
 *
 * @returns {Promise<object>} the user prescriptions (with drugs that user takes and times when user have to take)
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id).lean()
        .then(user => {
            
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            return user.prescription
        })

}