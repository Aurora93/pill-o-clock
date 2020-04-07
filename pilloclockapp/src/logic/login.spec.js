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
const { login } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.API_URL


describe('login', () => {

    let name, surname, gender, age, phone, profile, email, password, _id
    
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
    })

    describe('when user already exists', () => {

        it('should succeed on correct and valid and right credentials', async () => {
            const _password = await bcrypt.hash(password, 10)
            await User.create({name, surname, gender, age, phone, profile, email, password: _password})
                .then(user => _id = user.id)

            await login(email, password)
            const token = await logic.__context__.storage.getItem('token')
            expect(token).toBeDefined()
            expect(token.length).toBeGreaterThan(0)
            expect(typeof token).toEqual('string')
            const sub = JSON.parse(atob(token.split('.')[1])).sub
            expect(sub).toEqual(_id)
        })

        it('should fail to auth on wrong email', async () => {
            let _error
            try {
                await login(`wrong-${email}`, password)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual('wrong credentials')
        })

        it('should fail to auth on wrong password', async () => {
            let _error
            try {
                await login(email, `${password}-wrong`)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual('wrong credentials')
        })

        afterEach(() => User.deleteMany().then(() => {}))
    })
  
 
    describe('unhappy paths', () => {
        it('should fail on a non string email', async () => {
            let _error
            email = 45438

            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)

            email = false
            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)

            email = []
            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
        })

        it('should fail on a non valid email address', async () => {
            let _error
            email = 'asjdvsdhjv'

            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${email} is not an e-mail`)

            email = '123@a'
            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${email} is not an e-mail`)
        })


        it('should fail on a non string password', async () => {
            let _error
            password = 45438
            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
            password = false
            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
            password = []
            try {
                await login(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
        })
    })

    
    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})