const { retrieveDrugs } = require('../../logic')
const { NotAllowedError, ContentError, NotFoundError  } = require('pill-o-clock-errors')

module.exports = (req, res) => {
    try {
        retrieveDrugs()
            .then(drugs =>
                res.status(200).json(drugs)
            )
            .catch(error => {
                let status = 400

                if (error instanceof NotAllowedError)
                    status = 401 // not authorized

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