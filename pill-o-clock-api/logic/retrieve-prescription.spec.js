require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrievePrescription = require('./retrieve-prescription')
const { mongoose, models: { User, Drug, Guideline } } = require('pill-o-clock-data')


describe('retrievePrescription', ()=> {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, times

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
                    _id = user.id

                    _drugId = drug.id

                    let guideline = new Guideline({created: new Date, prescribed: user.id, drug: _drugId, times: [time]})

                    user.prescription.push(guideline)

                    return Promise.all([user.save(), guideline.save()])
                })
                .then(() => {})
        )
        it('should succeed on correct data', ()=>
            retrievePrescription(_id) 
                .then(prescription => { 
                    
                    expect(prescription instanceof Array).to.equal(true)
                    expect(prescription[0].drug.toString()).to.equal(_drugId)
                    expect(prescription[0].times[0]).to.equal(time)
                })
        )

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => retrievePrescription(_id))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${_id}-wrong not found`)
                    
                })
        })

    })


    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrievePrescription(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = false
        expect(() => retrievePrescription(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = undefined
        expect(() => retrievePrescription(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = []
        expect(() => retrievePrescription(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })
    after(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))

})