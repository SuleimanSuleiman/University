const University = require('../model/universty')
const Student = require('../model/student')

const {
    handleError
} = require('../utils/handleErrorUniversity')
const {
    ObjectId
} = require('mongodb')

//CREATE UNIVERSITY
module.exports.pathcreateUniversity = async (req, res) => {
    try {
        res.render('../views/university/create.pug', {
            university: new University()
        })
    } catch (err) {
        res.redirect('/')
    }
}
module.exports.createUniversity = async (req, res) => {
    let newUniversity;
    try {
        newUniversity = await University(req.body);
        await newUniversity.save()
        res.render('../views/university/show.pug', {
            university: newUniversity
        })
    } catch (err) {
        const handle = await handleError(err)
        res.status(501).json(handle)
    }
}

//GET ALL UNIVERSITY
module.exports.getAllUniversity = async (req, res) => {
    let universitys = University.find({})
    if (req.query.name != null && req.query.name != '') {
        universitys = universitys.regex('name', new RegExp(req.query.name, 'ig'))
    }
    if (req.query.location != null && req.query.location != '') {
        universitys = universitys.regex('location', new RegExp(req.query.location, 'ig'))
    }
    try {
        const result = await universitys.exec()
        res.render('../views/university/index.pug', {
            universitys: result,
            search: req.query
        })
    } catch (Err) {
        console.log(Err)
        res.redirect('/')
    }
}

//UPDATE UNIVERSITY     
module.exports.pathUpdateUniversity = async (req, res) => {
    try {
        const theUniversity = await University.findOne({
            slug: req.params.slug
        })
        res.render('../views/university/edit.pug', {
            university: theUniversity
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}
module.exports.UpdateUniversity = async (req, res) => {
    let updateUniversity = new Object()
    try {
        updateUniversity = await University.findOneAndUpdate({
            slug: req.params.slug
        }, {
            $set: req.body
        }, {
            new: true
        })
        await updateUniversity.save()
        res.render('../views/university/show.pug', {
            university: updateUniversity
        })
    } catch (err) {
        res.json(err)
        if (updateUniversity != null && updateUniversity != '') {
            const handle = await handleError(err)
            res.status(501).json(handle)
        } else {
            res.redirect('/university')
        }
    }
}

//DELETE UNIVERSITY
module.exports.deleteUniversity = async (req, res) => {
    let university = new Object()
    try {
        university = await University.findOne({
            slug: req.params.slug
        })
        const checkIfUniversityHaveStudent = await Student.find({
            universityId: university.id
        })
        if (checkIfUniversityHaveStudent != null && checkIfUniversityHaveStudent != '') {
            throw Error('you can not delete this student because he have students !!')
        } else {
            await university.remove()
            res.status(200).redirect('/university')
        }
    } catch (error) {
        const handleErr = await handleError(error)
        res.status(501).json(handleErr)
    }
}

//GET UNIVERSITY
module.exports.getUniversity = async (req, res) => {
    const theUniversity = await University.aggregate([{
            $match: {
                slug: req.params.slug
            }

        },
        {
            $lookup: {
                from: "students",
                localField: "_id",
                foreignField: "universityId",
                as: "students"
            }
        },
    ])

    try {
        res.render('../views/university/show.pug', {
            university: theUniversity[0]
        })
    } catch (err) {
        console.log(err)
        res.redirect('/university')
    }
}