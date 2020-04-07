const { addProgressRecord } = require('../../logic')
const { ContentError } = require('pill-o-clock-errors')

module.exports = (req, res) => {
    const { payload: { sub: id }, body } = req
    
    try {
        addProgressRecord(id, body) 
            .then(() => res.status(201).end())
            .catch(error => {
                let status = 400

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
        
        if (error instanceof NotFoundError )
            status = 404

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}