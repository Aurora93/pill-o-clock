const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

/**
 * Add a boolean if the user hace taked the drug or not to an daily array of progress
 * 
 * @param {string} id user's unique id
 * 
 * @param {boolean} progress determine if the user have taked the drug (tue) or not (false)
 *
 * @returns {Promise<undefined>} an empty Promise on a successful addition
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = (id, check)=> { 
    validate.string(id, 'id')
    validate.type(check, 'check', Boolean)

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            
            user.progress.push(check)

            return user.save()
        })
        .then(() => { })
}