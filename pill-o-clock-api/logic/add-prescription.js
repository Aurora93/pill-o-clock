const { validate } = require('pill-o-clock-utils')
const { models: { User, Drug, Guideline } } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

/**
 * Add a prescription to user with the drug to take and the time(alarm) when the user have to take this drug 
 * 
 * @param {string} id user's unique id
 * 
 * @param {string} drugId the id of the drug to add to user prescription
 *
 * @param {array} time array of times in which alarms should trigger to inform the user to take the drug 
 *
 * @returns {Promise<undefined>} an empty Promise on a successful addition
 * 
 * @throws {NotFoundError} if the user or the drug does not exist
 */

module.exports = (id, drugId, time) => {  
    validate.string(id, 'id')
    validate.string(drugId, 'drugId')
    validate.type(time, 'times', Array)
    time.forEach(alarm =>{
        validate.stringOfNumbers(alarm)
    })

    return (async () => {
        let user = await User.findById(id).lean()
        let drug = await Drug.findById(drugId).lean()
    
        if (!drug) throw new NotFoundError(`drug with id ${drugId} not found`)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)
    
        if (user.prescription.find(drug => drug.drug.toString() === drugId)) throw new NotAllowedError (`user with id ${id} already have drug with id ${drugId} in his prescription`)
    
        // for (let i = 0; i < user.prescription.length; i++) {
        //     if (user.prescription[i].drug.toString() === drugId) throw new NotAllowedError (`user with id ${id} already have drug with id ${drugId} in his prescription`)
        // } 
    
        const guideline = new Guideline({created: new Date, prescribed: user._id.toString(), drug: drugId, times: time})
    
        await User.findByIdAndUpdate(user._id, { $push: { prescription: guideline } })
        return await guideline.save()   
    })()
}