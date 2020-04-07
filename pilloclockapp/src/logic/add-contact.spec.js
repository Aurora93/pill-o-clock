const { random, floor } = Math

const { mongoose, models: { User, Drug, Guideline } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')
const logic = require ('.')
const { addContact } = logic
import config from '../../config'
const AsyncStorage = require('not-async-storage')
const { REACT_APP_TEST_MONGODB_URL: MONGODB_URL, REACT_APP_TEST_JWT_SECRET: JWT_SECRET } = config

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('addContact', () => {
    
    let name, surname, gender, age, phone, phone2, profile, email, password, password2, token, drugName, description, time, _id, _id2, user, drug
    
    const GENDERS = ['male', 'female','non-binary']
    
    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
        await Drug.deleteMany()
        await Guideline.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        phone = `${random()}`
        phone2 = `${random()}`
        age = floor(random() * 100)
        gender = GENDERS[floor(random() * GENDERS.length)]
        profile = 'pharmacist'
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        password2 = `password2-${random()}`
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        time = random()
    })

    describe('when user already exists', () => {
        it('should succeed on correct and valid and right data', async () => {     
            const _password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
            _id = user.id.toString()
            token = jwt.sign({sub: _id}, JWT_SECRET, {expiresIn: '1d'})
            await logic.__context__.storage.setItem('token', token)
            
            const _password2 = await bcrypt.hash(password2, 10)
            user2 = await User.create({name: `${name}-2`, surname: `${surname}-2`, gender, age, phone: phone2, profile, email: `2-${email}`, password: _password2})
            _id2 = user2.id.toString()
            
            await addContact(_id2)

            user = await User.findById(_id).populate('contacts').lean()
            user2 = await User.findById(_id2).populate('contacts').lean()

            expect(user).toBeDefined()
            expect(user2).toBeDefined()
            expect(user.contacts).toBeDefined()
            expect(user2.contacts).toBeDefined()
            expect(user.contacts.length).toBe(1)
            expect(user2.contacts.length).toBe(1)

            expect(user.contacts[0]._id.toString()).toMatch(_id2)
            expect(user.contacts[0].name).toMatch(`${name}-2`)
            expect(user.contacts[0].surname).toMatch(`${surname}-2`)
            expect(user.contacts[0].phone).toMatch(phone2)

            expect(user2.contacts[0]._id.toString()).toMatch(user._id.toString())
            expect(user2.contacts[0].name).toMatch(name)
            expect(user2.contacts[0].surname).toMatch(surname)
            expect(user2.contacts[0].phone).toMatch(phone)
        }) 
        
        it('should fail when the user does not exist', async () =>{
            User.findByIdAndRemove(_id)
            try{
                await addContact(_id2)

            }catch(error){
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toBe(`user with id ${_id} not found`)
            }
        })

        it('should fail when the user does not exist', async () =>{
            User.findByIdAndRemove(_id2)
            try{
                await addContact(_id2)

            }catch(error){
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toBe(`user with id ${_id2} not found`)
            }
        })
    })

    describe('unhappy paths syncronous errors', () => {
        it('should fail on a non-string id', async () => {
            let _id
            _id = 45438
            try {
                await addContact(_id)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_id} is not a string`)
            
            _id = false
            try {
                await addContact(_id)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_id} is not a string`)
        
            _id = []
            try {
                await addContact(_id)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_id} is not a string`)
        })
    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})