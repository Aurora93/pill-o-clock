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
const { updateProgress } = logic

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.REACT_APP_API_URL

describe('updateProgress', () => {
    
    let name, surname, gender, age, phone, profile, email, password, token, drugName, description, time
    
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
        time = `${random()}`
    })


    describe('when user already exists', () => {
        let _id, _drug

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)
            const user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
               
            _id = user.id
   
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })

            token = await logic.__context__.storage.setItem('token', token)

            let check = BOOLEANS[floor(random() * BOOLEANS.length)]
                
            await User.findByIdAndUpdate( _id, { $push: { progress: check }})
        })

        it('should succeed on correct and valid and right data', async () => {
            await updateProgress()

            user = await User.findById(_id)

            expect(user.progress).toBeInstanceOf(Array)
            expect(user.progress.length).toEqual(0)
            expect(user.progress[0]).toBeUndefined()
            
        })

          it('should fail when the user does not exist', async () =>{
            await User.deleteMany()
            try{
                await updateProgress()

            }catch(error){
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe(`user with id ${_id} does not exist`)
            }
        })
 
    })
    
    afterAll(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))

})