const { Schema, Types: { ObjectId } } = require('mongoose')
const drug = require('./drug') 

module.exports = new Schema({
    created: { type: Date, required: true, default: Date.now },
    prescribed: { type: ObjectId, ref: 'User' },
    drug: { type: ObjectId, ref: 'Drug' },
    times: [ {type: String} ] 
    
})
