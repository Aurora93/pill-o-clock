const { validate } = require('pill-o-clock-utils')
const { models: { User, Drug, Guideline } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives all user's prescriptions
 * 
 * @param {string} id the unique user
 *
 * @returns {Promise<object>} the user prescriptions (with drugs that user takes and times when user have to take) and drug's information
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            return Guideline.find({prescribed: id}).populate('drug').lean()
            .then(guideline => {
                if (!guideline) throw new NotFoundError(`guideline not found`)

                guideline.forEach(element => {
                    element.id = element._id.toString()
                    delete element._id
                    delete element.__v
                })

                return guideline
            })
        })
}