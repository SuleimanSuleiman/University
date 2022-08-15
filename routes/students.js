const express = require('express')
const router = express.Router()
const controller = require('../controllers/students')

//create student
router.get('/createStudent', controller.pathcreateStudent)
router.post('/', controller.createStudent)


//update student
router.get('/edit/:id', controller.pathUpdateStudent)
router.put('/:id', controller.updateStudent)

//delete student
router.delete('/delete/:id', controller.deleteStudent)

//all students
router.get('/', controller.getAllStudent)


//get student
router.get('/:id', controller.getStudent)



module.exports = router