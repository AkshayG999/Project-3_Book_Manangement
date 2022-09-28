const jwt = require('jsonwebtoken')
const booksModel = require('../models/booksModel')
const v = require('../validators/validation')

//____________________________Authentication________________________________________________________________________________________________

let authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ status: false, message: "token must be present" })

        jwt.verify(token, "g66indmahraj", (err, user) => {
            if (err) { return res.status(401).send("invalid token") }
            
            req.userLoggedIn = user
            next()  

        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//____________________________________________Authorization_____________________________________________________________________________________________________

let authorisation = async function (req, res, next) {
    try {
        req.BookId = req.params.bookId
        let bodyUserId = req.body.userId

         //_________________________Authorization For Create book(post)_____________________________________________________

        if (!req.BookId) {
            if(!bodyUserId ) return res.status(400).send({ status: false, message: 'UserId is mandatory' })
            if (!v.isValidObjectId(bodyUserId)) return res.status(400).send({ status: false, message: 'valid userId is mandatory' })

            if (req.userLoggedIn.userId != bodyUserId) return res.status(201).send({ status: false, message: 'Failed Authorisation' })
        }

        //____________________________Authorization For Book Get/put/delete____________________________________________ 

        if(req.BookId) { 
            if (!v.isValidObjectId(req.BookId)) return res.status(400).send({ status: false, message: 'bookId is not valid' })
            
             req.book = await booksModel.findOne({_id:req.BookId})
              
            if(!req.book) return res.status(404).send({ status: false, message: 'BookId not exist' })
   
            let userId = req.book.userId
           
            if (req.userLoggedIn.userId != userId) return res.status(403).send({ status: false, message: "User is unauthorised" })
            
            }
        
         next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { authentication, authorisation }