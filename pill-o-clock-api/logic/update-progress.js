const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Resets the array of progress when changes the current day to reset the alarms
 * 
 * @param {string} id the unique user
 *
 * @returns {Promise<undefines>} an empty Promise on a successful updating 
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = (id) => {
    validate.string(id, 'id')

    return User.findById(id)
    .then(user => {
        if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

        return User.findByIdAndUpdate(id, { $set: {progress: [] }})
    })
    .then(() => {})
}