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
const { addMedication } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('addMedication', () => {
    
    let name, surname, gender, age, phone, profile, email, password, token, drugName, description, time, _id, user, drug
    
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
            drug = await Drug.create({drugName, description})
                        
            _id = user.id.toString()
            _idDrug = drug.id.toString()
            
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
                   
            await addMedication(_idDrug, time)
            user = await User.findById(_id).lean()
            presc = await Guideline.findOne({prescribed: _id}).populate('drug')

            expect(user.prescription).toBeDefined()
            expect(user.prescription).toBeInstanceOf(Array)
            expect(user.prescription[0]).toBeDefined()
            expect(user.prescription[0].prescribed.toString()).toMatch(_id)
            expect(user.prescription[0].times[0]).toBe(time[0])
            expect(user.prescription[0].drug._id.toString()).toMatch(_idDrug)

            expect(presc.drug.drugName).toBe(drugName)
            expect(presc.drug.description).toBe(description)
            expect(presc.drug._id.toString()).toMatch(_idDrug)
            expect(presc.times).toBeInstanceOf(Array)
            expect(presc.times[0]).toBe(time[0])
        })

        it('should fail when the user does have this drug on this prescription', async () =>{
            try{
                await addMedication(_idDrug, time)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} already have drug with id ${_idDrug} in his prescription`)
            }
        })
        it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await addMedication(_idDrug, time)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} not found`)
            }
        })

        it('should fail when the drug does not exist', async () =>{
            const __password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: __password})
            await Drug.deleteMany()
            try{
                await addMedication(_idDrug, time)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`drug with id ${_idDrug} not found`)
            }
        })
        
    })

    describe('unhappy paths syncronous errors', () => {
        it('should fail on a non-string drug ID', async () => {
            let _error
            _idDrug = 45438
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`drugId ${_idDrug} is not a string`)
            
            _idDrug = false
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`drugId ${_idDrug} is not a string`)
        
            _idDrug = []
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`drugId ${_idDrug} is not a string`)
        })

        it('should fail on a non-Array times', async () => {
            let _error
            _idDrug = 'some id'

            time = 45438
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`times ${time} is not a Array`)
            
            time = false
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`times ${time} is not a Array`)
            
            time = undefined
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`times ${time} is not a Array`)
        })

        it('should fail on a string of numbers values for times', async () => {
            let _error
            time = []

            time.push('jbsdjfb')
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${time[0]} is not a valid time`)
            
            time.push(false)
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${time[0]} is not a valid time`)
            
            time.push(undefined)
            try {
                await addMedication(_idDrug, time)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${time[0]} is not a valid time`)
        })
    })
    afterAll(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})