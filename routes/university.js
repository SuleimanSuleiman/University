const express = require('express')
const router = express.Router()
const controller = require('../controllers/universty')

//create student
router.get('/createUuniversty', controller.pathcreateUniversity)
router.post('/', controller.createUniversity)


//update student
router.get('/edit/:slug', controller.pathUpdateUniversity)
router.put('/:slug', controller.UpdateUniversity)

//delete student
router.delete('/delete/:slug', controller.deleteUniversity)

//all university
router.get('/', controller.getAllUniversity)


//get student
router.get('/:slug', controller.getUniversity)



module.exports = router