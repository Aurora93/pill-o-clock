require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Drug, Guideline } } = require('pill-o-clock-data')
const { expect } = require('chai')
const { floor, random } = Math
const addProgressRecord = require('./add-progress-record')

describe('addProgressRecord', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Drug.deleteMany()]))
    )

    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, __id, time, records = {}
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
        time = [`${random()}`]
        records = {
            record: COLORS[floor(random() * COLORS.length)],
            date: `${2000 + floor(random() * 20)}-${floor(random() * 11) + 1}-${floor(random() * 30) + 1}`
        }
    })

    describe('when user already exists', () => {

        beforeEach(() => 
            User.create({ name, surname, gender, age, phone, profile, email, password })
                .then(({ id }) => {
                    _id = id
                })
            .then(() => Drug.create({drugName, description}))
            .then(({id}) => _drugId = id)
        )

        it('should succeed on correct and valid and right data', () =>
            addProgressRecord(_id, records)
                .then(() => User.findById(_id).lean() )
                .then((user) => {
                    expect(user).to.exist 
                    
                    expect(user.progressRecord[0]).to.exist
                    expect(user.progressRecord[0]).to.be.instanceOf(Object)
                    expect(user.progressRecord[0].record).to.equal(records.record)
                    expect(user.progressRecord[0].date).to.equal(records.date)
                })
        )

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => addProgressRecord(_id, records))
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${_id}-wrong does not exist`)
                })
        })
    })

    describe('unhappy path syncronous', () => {
        // beforeEach(() => 
        //     User.create({ name, surname, gender, age, phone, profile, email, password })
        // .then(({id}) => {
        //     __id = id
        // })
        // )

        it('should fail on a non string id', async () => {
            let idWrong
            idWrong = 9328743289
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`userId ${idWrong} is not a string`)

            idWrong = false
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`userId ${idWrong} is not a string`)

            idWrong = undefined
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`userId ${idWrong} is not a string`)

            idWrong = []
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`userId ${idWrong} is not a string`)
        })

        it('should fail on a non object records', async () => {
            idWrong = 'some id'
            records = 9328743289
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`records ${records} is not a Object`)

            records = false
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`records ${records} is not a Object`)

            records = undefined
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`records ${records} is not a Object`)

            records = 'sajdbjasdb'
            try {
                await addProgressRecord(idWrong, records)
            } catch (error) {
                _error = error
            } expect(_error.message).to.equal(`records ${records} is not a Object`)
        })


    })

after(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})
