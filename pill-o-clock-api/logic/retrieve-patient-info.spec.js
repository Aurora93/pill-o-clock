require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrievePatientInfo = require('./retrieve-patient-info')
const { mongoose, models: { User} } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

describe('retrievePatientInfo', () => {
    
    let name, surname, gender, age, phone, profile, email, password, name2, surname2, gender2, age2, phone2, profile2, email2, password2, _id, _id2, _progress, _records
    
    const GENDERS = ['male', 'female','non-binary']
    const BOOLEANS = [true, false]
    const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white']
    
    
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

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
        email2 = `email--${random()}@mail.com`
        password2 = `password-${random()}`
    })

    describe('when user already exists', () => { 
        it('should succeed on correct and valid and right data', async () => {
            let user = await User.create({ name, surname, gender, age, phone, profile, email, password })
            let user2 = await User.create({ name: name2, surname: surname2, gender: gender2, age: age2, phone: phone2, profile: profile2, email: email2, password: password2 })
            
            _id = user.id.toString()
            _id2 = user2.id.toString()
    
            await User.findByIdAndUpdate(_id, { $push: { contacts: _id2 } })
            await User.findByIdAndUpdate(_id2, { $push: { contacts: _id } })

            for (let i = 0; i < 10; i++) {
                _records = {}
                _records.record = COLORS[floor(random() * COLORS.length)]
                _records.date = `${2000 + floor(random() * 20)}-${floor(random() * 11) + 1}-${floor(random() * 30) + 1}`
                
                _progress = BOOLEANS[floor(random() * BOOLEANS.length)]
    
                await User.findByIdAndUpdate(_id2, { $push: { progress: _progress } })
                await User.findByIdAndUpdate(_id2, { $push: { progressRecord: {_records} } })
            }


            const info = await retrievePatientInfo(_id, _id2)
            
            expect(info).to.exist
            expect(info).to.be.instanceof(Object)
            expect(info.progressRecordPatient).to.exist
            expect(info.progressPatient).to.exist
            expect(info.progressRecordPatient.length).to.equal(10)
            expect(info.progressPatient.length).to.equal(10)
            expect(info.progressRecordPatient).to.be.instanceof(Array)
            expect(info.progressPatient).to.be.instanceof(Array)

            info.progressRecordPatient.forEach(progressRecord => {
                expect(progressRecord).to.exist
                expect(progressRecord).to.be.instanceof(Object)
            })

            info.progressPatient.forEach(patientProgress => {
                expect(patientProgress).to.exist
                expect(typeof patientProgress).to.equal('boolean')
            })
        })

        it('should fail to retrieve the info if the patient does not exist', async() => {
            await User.findByIdAndRemove(_id2)

            let _error

            try {
                await retrievePatientInfo(_id, _id2)
            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`user with id ${_id2} does not exist`)
            }
        })

        it('should fail to retrieve the info if the pharmacist does not exist', async() => {
            await User.findByIdAndRemove(_id)

            let _error

            try {
                await retrievePatientInfo(_id, _id2)
            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`user with id ${_id} does not exist`)
            }
        })

        it('should fail to retrieve the info if the main user is not a pharmacist profile', async() => {
            let user = await User.create({ name, surname, gender, age, phone, profile: 'patient', email, password })
            let user2 = await User.create({ name: name2, surname: surname2, gender: gender2, age: age2, phone: phone2, profile: 'patient', email: email2, password: password2 })
            
            _id = user.id.toString()
            _id2 = user2.id.toString()

            await User.findByIdAndUpdate(_id, { $push: { contacts: _id2 } })
            await User.findByIdAndUpdate(_id2, { $push: { contacts: _id } })

            let _error

            try {
                await retrievePatientInfo(_id, _id2)
            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`user with id ${_id} is not a pharmacist`)
            }
        })
        
        it('should fail to retrieve the info if the pharmacist does not have the patient as contact', async() => {
            await User.findByIdAndUpdate(_id, { $set: { profile: 'pharmacist' } })
            await User.findByIdAndUpdate(_id, { $pull: { contacts: _id2 } })
            let _error

            try {
                await retrievePatientInfo(_id, _id2)
            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`user with id ${_id} does not have contact with id ${_id2}`)
            }
        })

        it('should fail to retrieve the info if the patient does not have the pharmacist as contact', async() => {
            await User.findByIdAndUpdate(_id, { $push: { contacts: _id2 } })

            let _error

            try {
                await retrievePatientInfo(_id, _id2)
            } catch(error) {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`user with id ${_id2} does not have contact with id ${_id}`)
            }
        })
    })

    describe('unhappy paths', () => {
        it('should fail on nonstring pharmacist ID', () => {
            __id = 2394324
            expect(() => retrievePatientInfo(__id, _id2)).to.throw(`id ${__id} is not a string`)

            __id= {}
            expect(() => retrievePatientInfo(__id, _id2)).to.throw(`id ${__id} is not a string`)

            __id= [1,2,3]
            expect(() => retrievePatientInfo(__id, _id2)).to.throw(`id ${__id} is not a string`)

            __id= false
            expect(() => retrievePatientInfo(__id, _id2)).to.throw(`id ${__id} is not a string`)
        }) 

        it('should fail on nonstring patient ID', () => {
            _id2 = 2394324
            expect(() => retrievePatientInfo(_id, _id2)).to.throw(`patientId ${_id2} is not a string`)

            _id2 = {}
            expect(() => retrievePatientInfo(_id, _id2)).to.throw(`patientId ${_id2} is not a string`)

            _id2 = [1,2,3]
            expect(() => retrievePatientInfo(_id, _id2)).to.throw(`patientId ${_id2} is not a string`)

            _id2 = false
            expect(() => retrievePatientInfo(_id, _id2)).to.throw(`patientId ${_id2} is not a string`)
        })
    })
    
    
    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})