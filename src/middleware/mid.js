const jwt = require('jsonwebtoken')
const booksModel = require('../models/booksModel')
const v = require('../validators/validation')

//____________________________Authentication________________________________________________________________________________________________

let authentication = async function (req, res, next) {
    try {
        let token
        const secretKey = "secretKey"

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token)
            return res.status(401)
                .send({ status: false, message: "Please provide token" })

        const decoded = jwt.decode(token)

        if (!decoded)
            return res.status(400)
                .send({ status: false, message: "Invalid Authentication Token in request header" })

        req["decoded"] = decoded

        if (Date.now() > decoded.exp * 1000)
            return res.status(440)
                .send({ status: false, message: "session expired, please login again" })

        jwt.verify(token, secretKey, function (err, decoded) {

            if (err) { return res.status(400).send({ status: false, message: "Token Invalid" }) }

            else {
                req.authorId = decoded.authorId;
                return next()
            }

        })

    } catch (error) {

        res.status(500).send({ error: error.message })
    }

}

//____________________________________________Authorization_____________________________________________________________________________________________________

let authorisation = async function (req, res, next) {
    try {
        req.BookId = req.params.bookId
        let bodyauthorId = req.body.authorId

        //_________________________Authorization For Create book(post)_____________________________________________________

        if (!req.BookId) {
            console.log(req.authorId, bodyauthorId);
            if (!bodyauthorId) return res.status(400).send({ status: false, message: 'authorId is mandatory' })
            if (!v.isValidObjectId(bodyauthorId)) return res.status(400).send({ status: false, message: 'valid authorId is mandatory' })

            if (req.authorId != bodyauthorId) return res.status(401).send({ status: false, message: 'Failed Authorisation' })
        }

        //____________________________Authorization For Book Get/put/delete____________________________________________ 

        if (req.BookId) {
            if (!v.isValidObjectId(req.BookId)) return res.status(400).send({ status: false, message: 'bookId is not valid' })

            req.book = await booksModel.findOne({ _id: req.BookId })

            if (!req.book) return res.status(404).send({ status: false, message: 'BookId not exist' })

            let authorId = req.book.authorId

            if (req.authorId != authorId) return res.status(403).send({ status: false, message: "User is unauthorised" })

        }

        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { authentication, authorisation }