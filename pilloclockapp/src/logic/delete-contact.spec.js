const { random, floor } = Math

const { mongoose, models: { User, Drug, Guideline } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')
const logic = require('.')
import config from '../../config'
const AsyncStorage = require('not-async-storage')
const { REACT_APP_TEST_MONGODB_URL: MONGODB_URL, REACT_APP_TEST_JWT_SECRET: JWT_SECRET } = config
const { deleteContact } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('deleteContact', () => {
    
    let name, surname, gender, age, phone, phone2, profile, email, password, password2, token, drugName, description, time, idUser, idUser2, user, drug
    
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
    
    describe('when users already exist', () => {
        it('should succeed on correct and valid and right data', async () => {     
            const _password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
            idUser = user.id.toString()
            
            token = jwt.sign({sub: idUser}, JWT_SECRET, {expiresIn: '1d'})
            await logic.__context__.storage.setItem('token', token)
            
            const _password2 = await bcrypt.hash(password2, 10)
            user2 = await User.create({name: `${name}-2`, surname: `${surname}-2`, gender, age, phone: phone2, profile, email: `2-${email}`, password: _password2})
            idUser2 = user2.id.toString()

            await User.findByIdAndUpdate(idUser, { $push: {contacts: idUser2}})
            await User.findByIdAndUpdate(idUser2, { $push: {contacts: idUser}})

            user =  await User.findById(idUser)
            user2 =  await User.findById(idUser2)

            expect(user.contacts[0]).toBeDefined()
            expect(user.contacts[0].toString()).toBe(idUser2.toString())
            expect(user2.contacts[0]).toBeDefined()
            expect(user2.contacts[0].toString()).toBe(idUser.toString())

            await deleteContact(idUser2)
            user =  await User.findById(idUser)
            user2 =  await User.findById(idUser2)
            expect(user.contacts[0]).toBeUndefined()
            expect(user.contacts.length).toBe(0)
            expect(user2.contacts[0]).toBeUndefined()
            expect(user2.contacts.length).toBe(0)
        })

        it('should fail when the users are not contact of each other', async ()=>{
            try{
                await deleteContact(idUser2)
            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`These users are not contacts`)
            }
        })
        
    })

    describe('when users do not exist', ()=>{
        it('should fail when the user does not exist', async () =>{
            await User.findByIdAndRemove(idUser2)
            try{
                await deleteContact(idUser2)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${idUser2} not found`)
            }
        })

        it('should fail when the user does not exist', async () =>{
            await User.findByIdAndRemove(idUser)
            try{
                await deleteContact(idUser2)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${idUser} not found`)
            }
        })

    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})
