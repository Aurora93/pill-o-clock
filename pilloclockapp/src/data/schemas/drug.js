const { Schema } = require('mongoose')

module.exports = new Schema({
    drugName: { type: String, required: true },
    description: { type: String, required: true },
    link: {type: String}
    
})