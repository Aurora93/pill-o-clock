require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveDrug = require('./retrieve-drug')
const { mongoose, models: { Drug } } = require('pill-o-clock-data')

describe('retrieveDrug', () => {
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
            retrieveDrug(_drugId)
                .then(drug => { 
                    expect(drug.drugName).to.equal(drugName)
                    expect(drug.description).to.equal(description)
                    
                })
        )
        it('should succeed on invalid data', () =>
            Drug.findByIdAndRemove(_drugId)
            .then(() => retrieveDrug(_drugId))
            .then(() => { 
                throw new Error('should not reach this point')
                
            })
            .catch(error => {
                expect(error.message).to.equal(`drug with id ${_drugId} does not exist`)
            })
        )

        it('should fail to retrieve if the user does not exist', () => {
            retrieveDrug(`${_drugId}-wrong`)
            .then(() => { throw new Error ('should not reach this point') })
            .catch(error => {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`drug with id ${_drugId}-wrong does not exist`)
            })
        })
    })

    it('should fail on a non-string drugName', () => {
        _drugId = 9328743289
        expect(() => retrieveDrug(_drugId)).to.throw(TypeError, `id ${_drugId} is not a string`)
        _drugId = false
        expect(() => retrieveDrug(_drugId)).to.throw(TypeError, `id ${_drugId} is not a string`)
        _drugId = undefined
        expect(() => retrieveDrug(_drugId)).to.throw(TypeError, `id ${_drugId} is not a string`)
        _drugId = []
        expect(() => retrieveDrug(_drugId)).to.throw(TypeError, `id ${_drugId} is not a string`)
    })

    after(() => Drug.deleteMany().then(() => mongoose.disconnect()))
})