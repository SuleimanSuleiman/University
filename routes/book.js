const express = require('express')
const router = express.Router()
const controller = require('../controllers/books')


//create student
router.get('/createBook', controller.pathcreateBook)
router.post('/', controller.createBook)


//update student
router.get('/edit/:slug', controller.pathUpdateBook)
router.put('/:slug', controller.updateBook)

//delete student
router.delete('/delete/:slug', controller.deleteBook)

//all students
router.get('/', controller.getAllBook)

//get student
router.get('/:slug', controller.getBook)


module.exports = router