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
const { deleteMedication } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('deleteMedication', () => { 

    let name, surname, gender, age, phone, profile, email, password, token, drugName, description, time, _id, _drugId, user, guideline 
    
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
        age = floor(random() * 100)
        gender = GENDERS[floor(random() * GENDERS.length)]
        profile = 'pharmacist'
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        time = `${random()}`
    })

    describe('when user already exists', () => {
        it('should succes on right data', async () =>{
            const _password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
            drug = await Drug.create({drugName, description})
                        
            _id = user.id.toString()
            _drugId = drug.id.toString()
    
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
            
            guideline = await Guideline.create({times: [time], prescribed: _id, drug})
            _guidelineId = guideline.id.toString()
            
            await User.findByIdAndUpdate(_id, {$push: {prescription: guideline}})
            
            let _guideline = await Guideline.findOne({prescribed: _id}).populate('drug')
            let _user = await User.findById({_id})
            
            expect(_guideline.drug.drugName).toMatch(drugName)
            expect(_guideline.times[0]).toBe(time)
            expect(_user.prescription[0].times[0]).toBe(_guideline.times[0])
            expect(_user.prescription[0].drug.toString()).toMatch(_drugId)

            await deleteMedication(_drugId)

            _guideline = await Guideline.findOne({prescribed: _id}).populate('drug')
            user = await User.findById(_id)

            expect(user.prescription.length).toBe(0)
            expect(_guideline).toBeNull()
        })

        it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await deleteMedication(_drugId)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} not found`)
            }
        })

        it('should fail when the drug does not exist', async () =>{
            let __password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: __password})
            _id = user.id.toString()
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
            
            await Drug.deleteMany()
            try{
                await deleteMedication(_drugId)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`drug with id ${_drugId} not found`)
            }
        })

        it('should fail when the prescription does not exist in user', async () =>{
            let __password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: __password})
            _id = user.id.toString()
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
            
            drug = await Drug.create({drugName, description})

            _drugId = drug.id.toString()

            await Guideline.deleteMany()

            try{
                await deleteMedication(_drugId)

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`prescript within user with id ${_id} not found`)
            }
        })
    })
     describe('unhappy paths syncronous errors', () => {
        
        it('should fail on a non-string idDrug', async () => {
            let _error
            _idDrug = 45438
            try {
                await deleteMedication(_idDrug)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`idDrug ${_idDrug} is not a string`)
            
            _idDrug = false
            try {
                await deleteMedication(_idDrug)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`idDrug ${_idDrug} is not a string`)
        
            _idDrug = []
            try {
                await deleteMedication(_idDrug)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`idDrug ${_idDrug} is not a string`)
        })
    })

    afterAll(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})