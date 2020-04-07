require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User } } = require('pill-o-clock-data')
const { expect } = require('chai')
const { random } = Math
const authenticateUser = require('./authenticate-user')
const bcrypt = require('bcryptjs')

describe('authenticateUser', () => {
   let name, surname, gender, age, phone, profile, email, password

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

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
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, gender, age, phone, profile, email, password })
                )
                .then(user => _id = user.id)
        )

        it('should succeed on correct and valid and right credentials', () =>
            authenticateUser(email, password)
                .then(id => {
                    expect(id).to.be.a('string')
                    expect(id.length).to.be.greaterThan(0)
                    expect(id).to.equal(_id)
                })
        )
        it('should fail on incorrect credentials', () => {
            authenticateUser(`wrong-${email}`, password)
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal('wrong credentials')
                })
            authenticateUser(email, `${password}-wrong`)
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal('wrong credentials')
                })
        })
    })
    it('should fail on a non-string and non-valid email', () => {
        email = 9328743289
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)
        email = false
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)
        email = undefined
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)
        email = []
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)

    })
    it('should fail on a non-string password', () => {
        password = 9328743289
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)
        password = false
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)
        password = undefined
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)
        password = []
        expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)
    })
    
    after(() => User.deleteMany().then(() => mongoose.disconnect()))

})
