const { validate } = require('pill-o-clock-utils')
const { NotFoundError } = require('pill-o-clock-errors')
const { models: { User }} = require('pill-o-clock-data')

/**
 * Add the day progress of the user to his daily record, with the level of success and the date of this day
 * 
 * @param {string} userId user's unique id
 * 
 * @param {object} records an object with the data and the progress of the user in determinate date
 *
 * @returns {Promise<undefined>} an empty Promise on a successful addition
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = (userId, records) => {
    validate.string(userId, 'userId')
    validate.type(records, 'records', Object)
    
    return User.findById(userId)
    .then(user => {
        if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)

        return User.findByIdAndUpdate(userId, {$push: {progressRecord: records}})
    })
    .then(() => {})
}