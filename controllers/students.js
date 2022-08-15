const {
    handleError
} = require('../utils/handleErrorStudent')
const Student = require('../model/student')
const Book = require('../model/book')
const University = require('../model/universty')
const {
    ObjectId
} = require('mongodb')

//CREATE STUDENT
module.exports.pathcreateStudent = async (req, res) => {
    pathCreateAndUpdateStudent(res, `students.pug`, new Student())
}
module.exports.createStudent = async (req, res) => {
    let theData = req.body
    try {
        let newStudent = new Student(theData)
        const student = await newStudent.save()
        res.status(201).render('../views/student/show.pug', {
            student: student,
        })
    } catch (err) {
        if (theData == null && theData == '') {
            res.redirect('/')
        }
        const handleErr = await handleError(err)
        res.render('../views/student/students.pug', {
            student: req.body,
            handle: handleErr
        })
    }
}


//UPDATE STUDENT
module.exports.pathUpdateStudent = async (req, res) => {
    try {
        const theStudent = await Student.findById(req.params.id)
        pathCreateAndUpdateStudent(res, `edit.pug`, theStudent)
    } catch (Err) {
        console.log(Err)
        res.redirect('/students')
    }
}
module.exports.updateStudent = async (req, res) => {
    const theStudent = await Student.findOneAndUpdate(req.query.id, req.body, {
        new: true
    })
    try {
        await theStudent.save()
        res.render('../views/student/show.pug', {
            student: theStudent
        })
    } catch (err) {
        const handleErr = await handleError(err)
        res.render('../views/student/edit.pug', {
            student: req.body,
            handle: handleErr
        })
    }
}

//DELETE STUDENT
module.exports.deleteStudent = async (req, res) => {
    let theStudent;
    try {
        theStudent = await Student.findById(req.params.id)
        const booksOfStudent = await Book.find({
            studentId: req.params.id
        })
        if (booksOfStudent != null && booksOfStudent != '') {
            throw Error('you can not delete this student because he have books !!')
        } else {
            await theStudent.remove()
            res.status(200).redirect('/students')
        }
    } catch (error) {
        const handleErr = await handleError(error)
        res.status(501).json(handleErr)
    }
}


//GET ALL STUDENT
module.exports.getAllStudent = async (req, res) => {
    let student = Student.find()
    if (req.query.firstName != null && req.query.firstName != '') {
        student = student.regex('firstName', new RegExp(req.query.firstName, 'ig'))
    }
    if (req.query.lastName != null && req.query.lastName != '') {
        student = student.regex('lastName', new RegExp(req.query.lastName, 'ig'))
    }
    if (req.query.email != null && req.query.email != '') {
        student = student.regex('email', new RegExp(req.query.email.substr(0, req.query.email.indexOf('@')), 'ig'))
    }
    try {
        const result = await student.populate('universityId').exec()
        res.render('../views/student/index.pug', {
            students: result,
            search: req.query
        })
    } catch (Err) {
        res.json(Err)
    }
}

//GET STUDENT BY ID
module.exports.getStudent = async (req, res) => {
    try {
        const theStudent = await Student.aggregate([{
                $lookup: {
                    from: "universities",
                    localField: "universityId",
                    foreignField: "_id",
                    as: "universityId"
                }
            },
            {
                $set: {
                    "universityId": {
                        $arrayElemAt: ["$universityId", 0]
                    }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "studentId",
                    as: "books"
                }
            },
            {
                $match: {
                    _id:  ObjectId(req.params.id)
                }
            }
        ])
        res.render('../views/student/show.pug', {
            student: theStudent[0]
        })
    } catch (Err) {
        console.log(Err)
        res.redirect('/students')
    }
}

async function pathCreateAndUpdateStudent(res, FilePug, theStudent) {
    try {
        const universities = await University.find({})
        res.render(`../views/student/${FilePug}`, {
            student: theStudent,
            handle: new Object(),
            universities,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}