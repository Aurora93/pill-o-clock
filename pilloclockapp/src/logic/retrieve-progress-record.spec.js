const { random, floor } = Math

const { mongoose, models: { User } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')
const logic = require('.')
import config from '../../config'
const AsyncStorage = require('not-async-storage')
const { REACT_APP_TEST_MONGODB_URL: MONGODB_URL, REACT_APP_TEST_JWT_SECRET: JWT_SECRET } = config
const { retrieveProgressRecord } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('retrieveProgressRecord', () => {
    
    let name, surname, gender, age, phone, profile, email, password, _id, _progress, token, _records
    
    const GENDERS = ['male', 'female','non-binary']
    const BOOLEANS = [true, false]
    const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white']
    
    
    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        phone = `${random()}`
        age = floor(random() * 100)
        gender = GENDERS[floor(random() * GENDERS.length)]
        profile = 'pharmacist'
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => { 
        it('should succeed on correct and valid and right data', async () => {
            let user = await User.create({ name, surname, gender, age, phone, profile, email, password })
            
            _id = user.id.toString()
            
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            token = await logic.__context__.storage.setItem('token', token)

            for (let i = 0; i < 10; i++) {
                _records = {}
                _records.record = COLORS[floor(random() * COLORS.length)]
                _records.date = `${2000 + floor(random() * 20)}-${floor(random() * 11) + 1}-${floor(random() * 30) + 1}`
                
                _progress = BOOLEANS[floor(random() * BOOLEANS.length)]
    
                await User.findByIdAndUpdate(_id, { $push: { progress: _progress } })
                await User.findByIdAndUpdate(_id, { $push: { progressRecord: {_records} } })
            }


            const _progressRecord = await retrieveProgressRecord()
     
            expect(_progressRecord).toBeDefined()
            expect(_progressRecord).toHaveLength(10)
            expect(_progressRecord).toBeInstanceOf(Array)

            _progressRecord.forEach(progressRecord => {
                expect(progressRecord).toBeDefined()
                expect(progressRecord).toBeInstanceOf(Object)
            })

        })

        it('should fail to retrieve the info if the user does not exist', async() => {
            await User.findByIdAndRemove(_id)

            let _error

            try {
                await retrieveProgressRecord()
            } catch(error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toMatch(`user with id ${_id} does not exist`)
            }
        })

        
    })

    
    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})