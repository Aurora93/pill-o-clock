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
const { retrieveContacts } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('retrieveContacts', () => {
    
    let name, surname, gender, age, phone, profile, email, password, token, name2, surname2, gender2, age2, phone2, profile2, email2, password2, _id, _id2
    
    const GENDERS = ['male', 'female','non-binary']
    
    
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test-pill-o-clock', { useNewUrlParser: true, useUnifiedTopology: true })
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

        name2 = `name-${random()}`
        surname2 = `surname-${random()}`
        gender2 = `gender-${random()}`
        age2 = random()
        phone2 = `00000-${random()}`
        profile2 = `profile-${random()}`
        email2 = `email-${random()}@mail.com`
        password2 = `password-${random()}`
        
    })


    describe('when user already exists', () => {

        beforeEach( async () => {
            const user = await User.create({ name, surname, gender, age, phone, profile, email, password })
            const user2 = await User.create({ name: name2, surname: surname2, gender: gender2, age: age2, phone: phone2, profile: profile2, email: email2, password: password2 })
            
            _id = user.id.toString()
            _id2 = user2.id.toString()

            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })

            token = await logic.__context__.storage.setItem('token', token)


            user.contacts.push(_id2)
            return await user.save()
        })

        it('should succeed on correct and valid and right data', async () => {
            
            const contacts = await retrieveContacts()
            
            expect(contacts).toBeInstanceOf(Array)
            expect(contacts[0].id.toString()).toMatch(_id2.toString())
            expect(contacts[0].name).toMatch(name2)
            expect(contacts[0].surname).toMatch(surname2)
        })

        it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await retrieveContacts()

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} does not exist`)
            }
        })
 
    })
    
    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})