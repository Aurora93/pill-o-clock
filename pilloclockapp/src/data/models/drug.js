const mongoose = require('mongoose')
const { drug } = require('../schemas')

module.exports = mongoose.model('Drug', drug)