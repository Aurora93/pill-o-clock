require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Drug, Guideline } } = require('pill-o-clock-data')
const { expect } = require('chai')
const { random } = Math
const deletePrescription = require('./delete-prescription')
const { NotFoundError } = require('pill-o-clock-errors')


describe('deletePrescription', ()=> {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Drug.deleteMany()]))
    )

    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, times, userId, drugId


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
        times = [`${random()}`]

    })

    describe('when user alredy exists', ()=> {

        beforeEach(() => 
            Promise.all([User.create({ name, surname, gender, age, phone, profile, email, password }), Drug.create({drugName, description}) ])
                .then(([user, drug]) => {
                    userId = user.id
                    drugId= drug.id

                    const prescription = new Guideline({prescribed: userId, drug: drugId, times})
                    user.prescription.push(prescription)
                    return Promise.all([user.save(), prescription.save()])
                })
            .then(() => {})
        )

        it('should succeed on correct and valid and right data', () =>
            User.findById(userId).lean()
                .then(user => {
                    expect(user.prescription).to.exist
                    expect(user.prescription[0]).to.exist
                    expect(user.prescription[0].drug.toString()).to.equal(drugId)
                    expect(user.prescription[0].prescribed.toString()).to.equal(userId)
                })

                .then(() => deletePrescription(userId, drugId))
                .then(() => User.findById(userId).lean() )
                .then((user) => {
                    expect(user).to.exist
                    expect(user.prescription[0]).to.be.undefined
                })
        )
        
        it('should fail if the prescription does not exist', () => {
            Guideline.deleteMany()
            .then(() => deletePrescription(userId, drugId))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch((error)=> {
                    expect(error).to.exist
                    expect(error).to.be.instanceof(NotFoundError)
                    expect(error.message).to.equal(`prescript within user with id ${userId} not found`)
                    
                })
        })

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => deletePrescription(userId, drugId))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch((error)=> {
                    expect(error).to.exist
                    expect(error).to.be.instanceof(NotFoundError)
                    expect(error.message).to.equal(`user with id ${userId} not found`)
                    
                })
        })

        it('should fail if the drug does not exist', () => {
            Drug.deleteMany()
            .then(() => deletePrescription(userId, drugId))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch((error)=> {
                    expect(error).to.exist
                    expect(error).to.be.instanceof(NotFoundError)
                    expect(error.message).to.equal(`drug with id ${drugId} not found`)
                    
                })
        })

    })

    describe('unhappy paths', () => {
        it('should fail on a non-string user ID', () => {
            userId = 9328743289
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `id ${userId} is not a string`)
            userId = false
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `id ${userId} is not a string`)
            userId = undefined
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `id ${userId} is not a string`)
            userId = []
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `id ${userId} is not a string`)
        })

        it('should fail on a non-string drug ID', () => {
            userId = 'some id'
            drugId = 9328743289
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `drugId ${drugId} is not a string`)
            drugId = false
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `drugId ${drugId} is not a string`)
            drugId = undefined
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `drugId ${drugId} is not a string`)
            drugId = []
            expect(() => deletePrescription(userId, drugId)).to.throw(TypeError, `drugId ${drugId} is not a string`)
        })
    })


    after(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))

})