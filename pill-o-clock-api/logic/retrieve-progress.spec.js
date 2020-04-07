require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveProgress = require('./retrieve-progress')
const { mongoose, models: { User } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

describe('retrieveProgress', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password, _id

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        progress = [false, true, false, true]
    })

    describe('when user already exists', () => {

        beforeEach(() => 
            User.create({ name, surname, gender, age, phone, profile, email, password, progress })
                .then((user) => {
                    _id = user._id.toString()

                    return user
                })
                .then(()=>{})
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveProgress(_id)
                .then(progress => { 
                    expect(progress).to.be.instanceOf(Array)
                    expect(progress[0]).to.be.false
                    expect(progress[1]).to.be.true
                    expect(progress[2]).to.be.false
                    expect(progress[3]).to.be.true
                    
                })
        )

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => retrieveProgress(_id))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${_id}-wrong not found`)
                    
                })
        })
    })

    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrieveProgress(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = false
        expect(() => retrieveProgress(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = undefined
        expect(() => retrieveProgress(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = []
        expect(() => retrieveProgress(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})