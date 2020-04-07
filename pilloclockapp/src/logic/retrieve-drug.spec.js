const { random } = Math

const { mongoose, models: { Drug } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')
const logic = require('.')
import config from '../../config'
const AsyncStorage = require('not-async-storage')
const { REACT_APP_TEST_MONGODB_URL: MONGODB_URL, REACT_APP_TEST_JWT_SECRET: JWT_SECRET } = config
const { retrieveDrug} = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('retrieveDrug', () => {
    
    let drugName, description, _drugId
    
    beforeAll(async () => {
        await mongoose.connect( MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Drug.deleteMany()
    })

    beforeEach(() => {
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        
    })

    describe('when drug already exists', () => {


        it('should succeed and valid and right data', async () => { 
            const drug = await Drug.create({ drugName, description}) 
            _drugId = drug.id

            const _drug = await retrieveDrug(_drugId)
            expect(_drug).toBeDefined()
            expect(_drug.drugName).toBe(drugName)
            expect(_drug.description).toBe(description)
    
        })
        it('should fail when the drug does not exist', async () =>{
            await Drug.deleteMany()
            try{
                await retrieveDrug(_drugId)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`drug with id ${_drugId} does not exist`)
            }
        })

    })
    

    describe('unhappy paths syncronous', () => {
        it('should fail on a non-string drugName', async () => {
            let _error
            _drugId = 45438
            try {
                await retrieveDrug(_drugId)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_drugId} is not a string`)
            
            _drugId = false
            try {
                await retrieveDrug(_drugId)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_drugId} is not a string`)
            
            _drugId = []
            try {
                await retrieveDrug(_drugId)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_drugId} is not a string`)
        })
    })
    afterAll(() => Drug.deleteMany().then(() => mongoose.disconnect()))
})