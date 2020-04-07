const mongoose = require('mongoose')
const { guideline } = require('../schemas')

module.exports = mongoose.model('Guideline', guideline)