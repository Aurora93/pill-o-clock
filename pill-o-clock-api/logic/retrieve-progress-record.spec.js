require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { floor, random } = Math
const retrieveProgressRecord = require('./retrieve-progress-record')
const { mongoose, models: { User, Drug, Guideline } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')


describe('retrieveProgressRecord', ()=> {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, records, email, password, drugName, description, _id, times
    const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white']
    
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
        records = {
            record: COLORS[floor(random() * COLORS.length)],
            date: `${2000 + floor(random() * 20)}-${floor(random() * 11) + 1}-${floor(random() * 30) + 1}`
        }
    })

    describe ('when user alredy exists', ()=> {
        beforeEach(() => 
            Promise.all([User.create({ name, surname, gender, age, phone, profile, email, password }), Drug.create({drugName, description}) ])
                .then(([user, drug]) => {
                    _id = user.id

                    _drugId = drug.id

                    let guideline = new Guideline({created: new Date, prescribed: user.id, drug: _drugId, times: [time]})

                    user.prescription.push(guideline)
                    user.progressRecord.push(records)

                    return Promise.all([user.save(), guideline.save()])
                })
                .then(() => {})
        )

        it('should succeed on correct data', ()=>
            retrieveProgressRecord(_id) 
                .then(progressRecord => { 
                    
                    expect(progressRecord instanceof Array).to.equal(true)
                    expect(progressRecord[0] instanceof Object).to.equal(true)
                    expect(progressRecord[0].record).to.equal(records.record)
                    expect(progressRecord[0].date).to.equal(records.date)
                })
        )

        it('should fail to retrieve if the user does not exist', () => {
            User.deleteMany()
            .then(() => retrieveProgressRecord(_id))
            .then(() => { throw new Error ('should not reach this point') })
            .catch(error => {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotFoundError)
                expect(error.message).to.equal(`user with id ${_id}-wrong does not exist`)
            })
        })
    })


    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrieveProgressRecord(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = false
        expect(() => retrieveProgressRecord(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = undefined
        expect(() => retrieveProgressRecord(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = []
        expect(() => retrieveProgressRecord(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })

    after(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})