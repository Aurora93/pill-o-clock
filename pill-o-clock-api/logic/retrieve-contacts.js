const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotAllowedError, NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives contacts from the user
 * 
 * @param {string} id user's unique id
 * 
 * @returns {Promise<array>} user's contacts
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id).populate('contacts', 'name surname phone email').lean()
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            user.contacts.forEach(contact => {
                contact.id=contact._id.toString()
                delete contact._id
                delete contact.__v
            });

            return user.contacts
        })
        
}