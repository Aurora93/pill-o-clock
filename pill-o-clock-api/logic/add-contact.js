const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

/**
 * Add a new contact to the array of user contacts
 * 
 * @param {string} idUser user's unique id
 * 
 * @param {string} idSecondUser the id of the user to add
 *
 * @returns {Promise<undefined>} an empty Promise on a successful addition
 * 
 * @throws {NotFoundError} if the user does not exist
 */


module.exports = (idUser, idSecondUser)=> { 
    validate.string(idUser, 'idUser')
    validate.string(idSecondUser, 'idSecondUser')    

    return Promise.all([User.findById(idUser), User.findById(idSecondUser)])
        .then(([user, secondUser]) => {
            if (!user) throw new NotFoundError(`user with id ${idUser} not found`)

            if (!secondUser) throw new NotFoundError(`user with id ${secondUser} not found`)
            
            user.contacts.push(idSecondUser)

            secondUser.contacts.push(idUser)

            return Promise.all([user.save(), secondUser.save()])
        })
        .then(() => { })
}