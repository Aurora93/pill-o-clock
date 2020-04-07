require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrievePrescriptedMedication = require('./retrieve-prescripted-medication')
const { mongoose, models: { User, Drug, Guideline } } = require('pill-o-clock-data')


describe('retrievePrescriptedMedication', ()=> {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, time, prescId

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        time = `${[random()]}`
    })

    describe ('when user alredy exists', ()=> {
        beforeEach(() => 
            Promise.all([User.create({ name, surname, gender, age, phone, profile, email, password }), Drug.create({drugName, description}) ])
                .then(([user, drug]) => {
                    userId = user.id.toString()
                    drugId= drug.id.toString()

                    const prescription = new Guideline({prescribed: userId, drug: drugId, times: time})
                    prescId = prescription.id.toString()
                    user.prescription.push(prescription)
                    return user.save()
                })
            .then(() => {})
        )
        it('should succeed on correct and valid date', ()=>
            Promise.all([retrievePrescriptedMedication(userId), User.findById(userId)])
                .then(([prescription, user ])=> { 
                    expect(prescription instanceof Array).to.equal(true)
                    expect(user.prescription instanceof Array).to.equal(true)
                    expect(user.prescription).to.exist
                    prescription.forEach(element => {
                        expect(element).to.exist
                        expect(element._id).to.be.undefined
                        expect(element.__v).to.be.undefined
                        expect(element.id.toString()).to.equal(prescId)
                        expect(element.drug.toString()).to.equal(drugId)
                        expect(element.prescribed.toString()).to.equal(userId)
                    })

                    expect(user.prescription[0].prescribed.toString()).to.equal(userId)
                    expect(user.prescription[0].drug._id.toString()).to.equal(drugId)
                })
        )

        it('should fail if the prescription does not exist', () => {
            Guideline.deleteMany()
            .then(() => 
            retrievePrescriptedMedication(userId)
            )
            .then(()=> {throw new Error ('should not reach this point')})
            .catch(({message })=> {
                expect(message).to.exist
                
                expect(message).to.equal(`guideline not found`)
            })
        })

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => retrievePrescriptedMedication(userId))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${userId}-wrong not found`)
                    
                })
        })

    })


    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrievePrescriptedMedication(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = false
        expect(() => retrievePrescriptedMedication(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = undefined
        expect(() => retrievePrescriptedMedication(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = []
        expect(() => retrievePrescriptedMedication(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })
    after(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})