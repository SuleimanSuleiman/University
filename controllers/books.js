const Book = require('../model/book')
const Student = require('../model/student')
const {
    handleError
} = require('../utils/handleErrorBook')


//CREATE BOOK
module.exports.pathcreateBook = async (req, res) => {
    try {
        const students = await Student.find({})
        res.render('../views/books/create.pug', {
            book: new Book(),
            students: students
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
module.exports.createBook = async (req, res) => {
    let newBook;
    try {
        newBook = await Book(req.body);
        await newBook.save()
        res.status(201).redirect('/books')
    } catch (err) {
        // res.json({err,message: err.message})
        const handleErr = await handleError(err)
        res.status(501).json(handleErr)
    }
}

//UPDATE BOOK
module.exports.pathUpdateBook = async (req, res) => {
    try {
        const theBook = await Book.findOne({
            slug: req.params.slug
        })
        res.render('../views/books/edit.pug', {
            book: theBook
        })
    } catch (err) {
        console.log(err)
        res.redirect('/books')
    }
}
module.exports.updateBook = async (req, res) => {
    try {
        const theBook = await Book.findOneAndUpdate({
            slug: req.params.slug
        }, {
            $set: req.body
        }, {
            new: true
        })
        await theBook.save()
        res.status(200).redirect('/books')
    } catch (err) {
        const handleErr = await handleError(err)
        res.status(501).json(handleErr)
    }
}

//GET BOOK
module.exports.getBook = async (req, res) => {
    const theBook = await Book.findOne({
        slug: req.params.slug
    }).populate('studentId')
    getBook(req,res, theBook, 'show.pug')
}
//GET ALL BOOK
module.exports.getAllBook = async (req, res) => {
    let Books =  Book.find({})
    if(req.query.title != null && req.query.title != ''){
        Books =  Books.regex('title',new RegExp(req.query.title,'ig'))
    }
    if(req.query.minprice != null && req.query.minprice != ''){
        Books = Books.gte('price',req.query.minprice)
    }
    if(req.query.maxprice != null && req.query.maxprice != ''){
        Books = Books.lte('price',req.query.maxprice)
    }
    try {
        const Result = await Books.populate('studentId').exec()
        res.render(`../views/books/index.pug`, {
            books: Result,
            search: req.query
        })
    } catch (err) {
        console.log(err)
        res.redirect('/books')
    }
}


//DELETE BOOK
module.exports.deleteBook = async (req, res) => {
    let theBook;
    try {
        theBook = await Book.findOne({
            slug: req.params.slug
        })
        await theBook.remove()
        res.status(200).redirect('/books')
    } catch (error) {
        console.log(error)
        const handleErr = await handleError(error)
        if (theBook != null && theBook != '') {
            res.render('../views/student/show.pug', {
                books: theBook,
                handle: handleErr
            })
        }
        res.status(501).json(error)
    }
}

async function getBook(req,res, book, fileName) {
    try {
        res.render(`../views/books/${fileName}`, {
            books: book,
            search: req.query
        })
    } catch (err) {
        console.log(err)
        res.redirect('/books')
    }
}