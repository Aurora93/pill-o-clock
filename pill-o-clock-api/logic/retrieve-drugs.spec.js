require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveDrugs = require('./retrieve-drugs')
const { mongoose, models: { Drug } } = require('pill-o-clock-data')

describe('retrieveDrugs', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Drug.deleteMany())
    )

    let drugName, description, _drugId

    beforeEach(() => {
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        
    })

    describe('when drug already exists', () => {

        beforeEach(() =>
            Drug.create({ drugName, description})       
            .then(({id})=> _drugId = id)
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveDrugs()
                .then(drugs => { 
                    expect(drugs).to.exist
                    expect(drugs instanceof Array).to.equal(true)
                    expect(drugs[0] instanceof Object).to.equal(true)
                    expect(drugs[0].id.toString()).to.equal(_drugId)
                    expect(drugs[0].drugName).to.equal(drugName)
                    expect(drugs[0].description).to.equal(description)
                })
        )

        it('should succeed with an empty array if no values are found', () =>{
            beforeEach(() => Drug.deleteMany().then(() => {}))
            retrieveDrugs()
                .then(drugs => { 
                    expect(drugs).to.exist
                    expect(drugs instanceof Array).to.equal(true)
                    expect(drugs.length).to.equal(0)
                })
        })
    })

    after(() => Drug.deleteMany().then(() => mongoose.disconnect()))
})