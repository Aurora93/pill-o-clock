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
const { retrieveDrugs} = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('retrieveDrugs', () => {
    
    let drugName, description, _drugId
    
    beforeAll(async () => {
        await mongoose.connect( MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Drug.deleteMany()
    })

    describe('when drug already exists', () => {
        it('should succeed and valid and right data', async () => { 
            for (let i = 0; i < 10; i++) {
                drugName = `drugName-${[i]}`
                description = `description-${[i]}`
                await Drug.create({ drugName, description })
            }

            const drugs = await retrieveDrugs()

            expect(drugs).toBeDefined()
            expect(drugs).toBeInstanceOf(Array)
            expect(drugs.length).toBe(10)
    
            drugs.forEach((drug, index) => {
                expect(drug).toBeInstanceOf(Object)
                expect(drug.drugName).toMatch(`drugName-${[index]}`)
                expect(drug.description).toMatch(`description-${[index]}`)
            })
        })

        it('should successfully return an empty array if there are no drugs available', async () => {
            await Drug.deleteMany()

            const drugs = await retrieveDrugs()

            expect(drugs).toBeDefined()
            expect(drugs).toBeInstanceOf(Array)
            expect(drugs.length).toBe(0) 
        })
    })
    
    afterAll(() => Drug.deleteMany().then(() => mongoose.disconnect()))
})