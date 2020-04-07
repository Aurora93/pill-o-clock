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
const { retrieveUser } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('retrieveUser', () => {
    
    let name, surname, gender, age, phone, profile, email, password, token
    
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
        let _id

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)
            const result = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
                .then(user => {
                    _id = user.id
                    return user.id
                })
                .then(async id => {
                    token = jwt.sign({ sub: id }, 'my cat is a demon', { expiresIn: '1d' })
                    
                    token = await logic.__context__.storage.setItem('token', token)
                })
                .then(() => { })
        })

        it('should succeed on correct and valid and right data', async () => {
            
            const user = await retrieveUser(token)

            expect(user).toBeDefined()
            expect(user.name).toBe(name)
            expect(user.surname).toBe(surname)
            expect(user.email).toBe(email)
            expect(user.age).toBe(age)
            expect(user.gender).toBe(gender)
            expect(user.password).toBeUndefined()
        })

          it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await retrieveUser()

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} does not exist`)
            }
        })

    })
    
    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})