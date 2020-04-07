const { random, floor } = Math

const { mongoose, models: { User, Drug, Guideline } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')
const logic = require('.')
const { addProgressRecord } = logic
import config from '../../config'
const AsyncStorage = require('not-async-storage')
const { REACT_APP_TEST_MONGODB_URL: MONGODB_URL, REACT_APP_TEST_JWT_SECRET: JWT_SECRET } = config

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('addProgressRecord', () => {
    
    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, __id, time, records = {}
    const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white']
    const GENDERS = ['male', 'female','non-binary']
    
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
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        time = [`${floor(random() * 2300) + floor(random() * 59)}`]
    })

    describe('when user already exists', () => {
        it('should succeed on correct and valid and right data', async () => {     
            const _password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
                        
            _id = user.id.toString()
            
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            records = {
                record: COLORS[floor(random() * COLORS.length)],
                date: `${2000 + floor(random() * 20)}-${floor(random() * 11) + 1}-${floor(random() * 30) + 1}`
            }
                   
            await addProgressRecord(records)
            user = await User.findById(_id).lean()

            expect(user).toBeDefined()
            expect(user.progressRecord).toBeInstanceOf(Array)
            expect(user.progressRecord[0]).toBeDefined()
            expect(user.progressRecord[0]).toBeInstanceOf(Object)
            expect(user.progressRecord[0].record).toMatch(records.record)
            expect(user.progressRecord[0].date).toMatch(records.date)
        })

        it('should allow to add as many progresses as needed', async() => {
            let moreRecords = {
                record: COLORS[floor(random() * COLORS.length)],
                date: `${2000 + floor(random() * 20)}-${floor(random() * 11) + 1}-${floor(random() * 30) + 1}`
            }

            await addProgressRecord(moreRecords)

            user = await User.findById(_id).lean()

            expect(user).toBeDefined()
            expect(user.progressRecord).toBeInstanceOf(Array)
            expect(user.progressRecord.length).toBe(2)
            expect(user.progressRecord[0]).toBeDefined()
            expect(user.progressRecord[0]).toBeInstanceOf(Object)
            expect(user.progressRecord[0].record).toMatch(records.record)
            expect(user.progressRecord[0].date).toMatch(records.date)

            expect(user.progressRecord[1]).toBeDefined()
            expect(user.progressRecord[1]).toBeInstanceOf(Object)
            expect(user.progressRecord[1].record).toMatch(moreRecords.record)
            expect(user.progressRecord[1].date).toMatch(moreRecords.date)
        })
        it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await addProgressRecord(records)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} does not exist`)
            }
        })
    })

    describe('unhappy paths syncronous errors', () => {
        it('should fail on a non-object records', async () => {
            let _error

            records = 45438
            try {
                await addProgressRecord(records)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`record ${records} is not a Object`)
            
            records = false
            try {
                await addProgressRecord(records)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`record ${records} is not a Object`)
            
            records = undefined
            try {
                await addProgressRecord(records)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`record ${records} is not a Object`)
        })
    })
    afterAll(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})