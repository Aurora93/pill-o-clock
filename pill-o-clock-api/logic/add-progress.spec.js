require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User } } = require('pill-o-clock-data')
const { expect } = require('chai')
const { random } = Math
const addProgress = require('./add-progress')

describe('addProgress', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password, description, _id, check

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        description = `description-${random()}`
        check = true
    })

    describe('when user already exists', () => {

        beforeEach(() => 
            User.create({ name, surname, gender, age, phone, profile, email, password })
                .then(({ id }) => {
                    _id = id
                })
        )

        it('should succeed on correct and valid and right data', () => {
            
            addProgress(_id, check)
                .then(() => User.findById(_id).lean() )
                .then((user) => {
                    expect(user).to.exist
                    expect(user.progress).to.be.true
                })
        })


    })
    describe('when user does not exist', ()=>{

        it('should fail if user does not exist', () => {
            User.deleteMany()
            .then(() => addProgress(_id, check))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${id} not found`)
                    
                })
        })
    })

    describe('unhappy path syncronous', () => {
        beforeEach(() => 
            User.create({ name, surname, gender, age, phone, profile, email, password })
        .then(({id}) => {
            __id = id
        })
        )
        it('should fail on a non-string id', () => {
            let idWrong
            idWrong = 9328743289
            expect(() => addProgress(idWrong, check)).to.throw(TypeError, `id ${idWrong} is not a string`)
            idWrong = false
            expect(() => addProgress(idWrong, check)).to.throw(TypeError, `id ${idWrong} is not a string`)
            idWrong = undefined
            expect(() => addProgress(idWrong, check)).to.throw(TypeError, `id ${idWrong} is not a string`)
            idWrong = []
            expect(() => addProgress(idWrong, check)).to.throw(TypeError, `id ${idWrong} is not a string`)

        })

        it('should fail on a non-boolean check', () => {
            check = 9328743289
            expect(() => addProgress(__id, check)).to.throw(TypeError, `check ${check} is not a boolean`)
            check = 'false'
            expect(() => addProgress(__id, check)).to.throw(TypeError, `check ${check} is not a boolean`)
            check = undefined
            expect(() => addProgress(__id, check)).to.throw(TypeError, `check ${check} is not a boolean`)
            check = []
            expect(() => addProgress(__id, check)).to.throw(TypeError, `check ${check} is not a boolean`)
        })
    })
        


    after(() => Promise.all([User.deleteMany()]).then(() => mongoose.disconnect()))
})