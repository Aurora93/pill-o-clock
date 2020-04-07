require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveUser = require('./retrieve-user')
const { mongoose, models: { User } } = require('pill-o-clock-data')

describe('retrieveUser', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(() =>
            User.create({ name, surname, gender, age, phone, profile, email, password })
                .then(({ id }) => _id = id)
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveUser(_id)
                .then(user => {
                    expect(user.constructor).to.equal(Object)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.gender).to.equal(gender)
                    expect(user.age).to.equal(age)
                    expect(user.phone).to.equal(phone)
                    expect(user.profile).to.equal(profile)
                    expect(user.email).to.equal(email)
                    expect(user.password).to.be.undefined
                })
        )

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => retrieveUser(_id))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${_id}-wrong not found`)
                    
                })
        })
    })

    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = false
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = undefined
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = []
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})