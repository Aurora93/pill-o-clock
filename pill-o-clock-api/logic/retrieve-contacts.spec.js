require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveContacts = require('./retrieve-contacts')
const { mongoose, models: { User } } = require('pill-o-clock-data')
const { NotFoundError } = require('pill-o-clock-errors')

describe('retrieveContacts', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password, name2, surname2, gender2, age2, phone2, profile2, email2, password2, idUser, idUserToAdd

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`

        name2 = `name-${random()}`
        surname2 = `surname-${random()}`
        gender2 = `gender-${random()}`
        age2 = random()
        phone2 = `00000-${random()}`
        profile2 = `profile-${random()}`
        email2 = `email-${random()}@mail.com`
        password2 = `password-${random()}`
    })

    describe('when user already exists', () => {

        beforeEach(() => 
            Promise.all([User.create({ name, surname, gender, age, phone, profile, email, password }),
                User.create({ name: name2, surname: surname2, gender: gender2, age: age2, phone: phone2, profile: profile2, email: email2, password: password2 })])
                
                .then(([user, userToAdd]) => {
                    idUser = user.id
                    idUserToAdd = userToAdd.id

                    user.contacts.push(idUserToAdd)

                    return user.save()
                })
                .then(()=>{})
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveContacts(idUser)
                .then(contacts => { 
                    expect(contacts).to.be.instanceOf(Array)
                    expect(contacts[0].id).to.equal(idUserToAdd)
                    expect(contacts[0].name).to.equal(name2)
                    expect(contacts[0].surname).to.equal(surname2)
                    expect(contacts[0].email).to.equal(email2)
                })
        )

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => retrieveContacts(idUser))
                .catch((error)=> {
                    expect(error).to.exist
                    expect(error).to.be.instanceof(NotFoundError)
                    expect(message).to.equal(`user with id ${idUser}-wrong not found`)
                    
                })
        })
    })

    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrieveContacts(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = false
        expect(() => retrieveContacts(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = undefined
        expect(() => retrieveContacts(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        _id = []
        expect(() => retrieveContacts(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})