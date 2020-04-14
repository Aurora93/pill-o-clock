const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

/**
 * Add a new contact to the array of user contacts
 * 
 * @param {string} idUser user's unique id
 * 
 * @param {string} idSecondUser the id of the user to delete
 *
 * @returns {Promise<undefined>} an empty Promise on a successful deletion
 * 
 * @throws {NotFoundError} if the users do not exist
 */


module.exports = (idUser, idSecondUser)=> { 
    validate.string(idUser, 'idUser')
    validate.string(idSecondUser, 'idSecondUser')    

    return Promise.all([User.findById(idUser), User.findById(idSecondUser)])
        .then(([user, secondUser]) => {
            
            if (!user) throw new NotFoundError(`user with id ${idUser} not found`)

            if (!secondUser) throw new NotFoundError(`user with id ${secondUser} not found`)
  
            if (user.contacts.includes(idSecondUser) && secondUser.contacts.includes(idUser)) return Promise.all([User.findByIdAndUpdate(idUser, {$pull: {contacts: idSecondUser}}), User.findByIdAndUpdate(idSecondUser, {$pull: {contacts: idUser}}) ])

            throw new NotAllowedError(`These users are not contacts`)
        })
        .then(() => { })
}