const { random, floor } = Math

const { mongoose, models: { User, Drug, Guideline } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')
const logic = require('.')
const { addProgress } = logic
import config from '../../config'
const AsyncStorage = require('not-async-storage')
const { REACT_APP_TEST_MONGODB_URL: MONGODB_URL, REACT_APP_TEST_JWT_SECRET: JWT_SECRET } = config

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('addProgress', () => {
    
    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, __id, time, _progress = []
    const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white']
    const GENDERS = ['male', 'female','non-binary']
    const BOOLEANS = [true, false]
    
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
        it('should add the boolean value as progress on valid data', async () => {     
            const _password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
                        
            _id = user.id.toString()
            
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            _progress = BOOLEANS[floor(random() * BOOLEANS.length)]
                   
            await addProgress(_progress)
            user = await User.findById(_id).lean()

            expect(user).toBeDefined()
            expect(user.progress).toBeInstanceOf(Array)
            expect(user.progress[0]).toBeDefined()
            expect(typeof user.progress[0]).toMatch('boolean')
            expect(user.progress[0]).toBe(_progress)
        })

        it('should allow to add as many progresses as needed', async() => {
            _moreProgress = BOOLEANS[floor(random() * BOOLEANS.length)]

            await addProgress(_moreProgress)

            user = await User.findById(_id).lean()

            expect(user).toBeDefined()
            expect(user.progress).toBeInstanceOf(Array)
            expect(user.progress.length).toBe(2)
            expect(user.progress[0]).toBeDefined()
            expect(typeof user.progress[0]).toMatch('boolean')
            expect(user.progress[0]).toBe(_progress)

            expect(user.progress[1]).toBeDefined()
            expect(typeof user.progress[1]).toMatch('boolean')
            expect(user.progress[1]).toBe(_moreProgress)
        })
        it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await addProgress(_progress)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} not found`)
            }
        })
    })

    describe('unhappy paths syncronous errors', () => {
        it('should fail on a non-array progress', async () => {
            let _error

            _progress = 45438
            try {
                await addProgress(_progress)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`check ${_progress} is not a boolean`)
            
            _progress = 'sodjdsjfn'
            try {
                await addProgress(_progress)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`check ${_progress} is not a boolean`)
            
            _progress = undefined
            try {
                await addProgress(_progress)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`check ${_progress} is not a boolean`)
        })
    })
    afterAll(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})