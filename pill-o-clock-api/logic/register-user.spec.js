require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('pill-o-clock-data')
const registerUser = require('./register-user')
const bcrypt = require('bcryptjs')
const { NotAllowedError } = require('pill-o-clock-errors')

const { env: { TEST_MONGODB_URL } } = process

describe('registerUser', () => {
    let name, surname, gender, age, phone, profile, email, password

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `female`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', () =>
        registerUser(name, surname, gender, age, phone, profile, email, password)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return User.findOne({ email })
            })
            .then(user => {
                expect(user).to.exist
                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.gender).to.equal(gender)
                expect(user.age).to.equal(age)
                expect(user.phone).to.equal(phone)
                expect(user.profile).to.equal(profile)
                expect(user.email).to.equal(email)
                expect(user.created).to.be.instanceOf(Date)

                return bcrypt.compare(password, user.password)
            })
            .then(validPassword => expect(validPassword).to.be.true)
    )

    it('should fail to register if the user email already exists', () =>
        registerUser(name, surname, gender, age, phone, profile, email, password)
        .catch((error) => {
            expect(error).to.exist
            expect(error).to.be.instanceof(NotAllowedError)
            expect(error.message).not.to.be.undefined
            expect(error.message).to.equal(`user with email ${email} already exists`)
        })
    )

    it('should fail on a non-string name', () => {
        name = 9328743289
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `name ${name} is not a string`)
        name = false
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `name ${name} is not a string`)
        name = undefined
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `name ${name} is not a string`)
        name = []
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `name ${name} is not a string`)
    })

    it('should fail on a non-string surname', () => {
        surname = 9328743289
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `surname ${surname} is not a string`)
        surname = false
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `surname ${surname} is not a string`)
        surname = undefined
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `surname ${surname} is not a string`)
        surname = []
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `surname ${surname} is not a string`)
    })

    it('should fail on a non-string and non-valid email', () => {
        email = 9328743289
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `email ${email} is not a string`)
        email = false
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `email ${email} is not a string`)
        email = undefined
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `email ${email} is not a string`)
        email = []
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `email ${email} is not a string`)
    })
    

    it('should fail on a non-string password', () => {
        password = 9328743289
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `password ${password} is not a string`)
        password = false
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `password ${password} is not a string`)
        password = undefined
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `password ${password} is not a string`)
        password = []
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `password ${password} is not a string`)
    })

    it('should fail on a non-number age', () => {
        age = {}
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `age ${age} is not a number`)
        age = []
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `age ${age} is not a number`)
    })

    it('should fail on a non-string gender', () => {
        gender = 9328743289
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `gender ${gender} is not a string`)
        gender = false
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `gender ${gender} is not a string`)
        gender = undefined
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `gender ${gender} is not a string`)
        gender = []
        expect(() => registerUser(name, surname, gender, age, phone, profile, email, password)).to.throw(TypeError, `gender ${gender} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})

