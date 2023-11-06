const express = require('express')
const router = express.Router()
const userController = require('../controllers/authorController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const mid = require('../middleware/mid')
const { uploadFile } = require('../../helper/aws')



router.post('/register', userController.createUser)//create user

router.post('/login', userController.login)//login user


router.post('/books', mid.authentication, mid.authorisation, bookController.createBook)//create book

router.get('/books', mid.authentication, bookController.getBook)//get books by query

router.get('/books/:bookId', mid.authentication, bookController.getBookById)//get books by params

router.put('/books/:bookId', mid.authentication, mid.authorisation, bookController.updateBook)//update books

router.delete('/books/:bookId', mid.authentication, mid.authorisation, bookController.deleteBook)//delete book by id


//__________________________________AWS S3 Configration & Connection____________________________________________________________________________

router.post("/write-file-aws",uploadFile)

module.exports = router


