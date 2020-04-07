const { validate } = require('pill-o-clock-utils')
const { models: { Drug } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives the drug desired
 * 
 * @param {string} id drug's unique id
 * 
 * @returns {Promise<object>} drug with all its properties
 * 
 * @throws {NotFoundError} if the drug does not exist
 */


module.exports = (id) => {
    validate.string(id, 'id')

    return Drug.findById(id).lean()
        .then(drug => {

            if(!drug) throw new NotFoundError(`drug with id ${id} does not exist`)

            drug.id = drug._id

            delete drug._id

            return drug
            
        })

}