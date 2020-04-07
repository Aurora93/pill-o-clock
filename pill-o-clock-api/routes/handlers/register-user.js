const { registerUser } = require('../../logic')
const { NotAllowedError, ContentError, NotFoundError } = require('pill-o-clock-errors')

module.exports = (req, res) => {
    const { body: { name, surname, gender, age, phone, profile, email, password } } = req

    try {
        registerUser(name, surname, gender, age, phone, profile, email, password)
            .then(() => res.status(201).end())
            .catch(error => {
                let status = 400

                if (error instanceof NotAllowedError)
                    status = 409 // conflict

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406 // not acceptable

        if (error instanceof NotFoundError)
            status = 404

        if (error instanceof NotAllowedError)
            status = 401

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}