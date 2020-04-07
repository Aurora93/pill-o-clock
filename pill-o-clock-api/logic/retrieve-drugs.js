const { validate } = require('pill-o-clock-utils')
const { models: { Drug } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

/**
 * Finds and receives all drugs from the database
 * 
 * @returns {Promise<array>} all drugs from the data base
 * 
 * @throws {NotFoundError} if the drug does not exist
 */

module.exports = () => {

    return Drug.find().lean()
        .then(drugs => {
            drugs.forEach(drug => {
                drug.id = drug._id

                delete drug._id
            })

            return drugs
        })
}