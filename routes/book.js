var express = require('express');
var fs = require('fs');
var async = require('async');
var router = express.Router();

var books = [];
//var books = require('./books.json');

/**
 * @api {post} /api/book Add Book
 * @apiName AddBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 */
router.post('/', function (req, res, next) {
    if (!req.body.book) {
        return res.status(400).json({
            status: "error",
            message: "Invalid or missing payload!",
            details: req.body
        });
    }
    if (isBookExist(req.body.book)) {
        return res.status(400).json({
            status: "error",
            message: `Book ${req.body.book} is already exists.!`
        });
    }
    books.push(req.body.book);
    return res.status(201).json({
        status: "success",
        message: "Successfully created!",
        details: req.body.book
    });
});

/**
 * @api {delete} /api/book/:book Delete Book
 * @apiName DeleteBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 * @apiParam {String} book.
 */
router.delete('/:book', function (req, res, next) {
    if (!isBookExist(req.params.book)) {
        return res.status(400).json({
            status: "error",
            message: `Book ${req.params.book} does not exists!`
        });
    }
    let index = books.indexOf(req.params.book);
    books.splice(index, 1);
    return res.status(200).json({
        status: "success",
        message: `Book ${req.params.book} is deleted successfully.!`
    });
});

/**
 * @api {patch} /api/book Update Book
 * @apiName UpdateBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 */
router.patch('/', function (req, res) {
    if (!req.body.original_book || !req.body.new_book) {
        return res.status(400).json({
            status: "error",
            message: "Invalid or missing payload!",
            details: req.body
        });
    }
    if (!isBookExist(req.body.original_book)) {
        return res.status(400).json({
            status: "error",
            message: `Book ${req.body.original_book} does not exists!`
        });
    }
    let index = books.indexOf(req.body.original_book);
    books[index] = req.body.new_book;
    return res.status(200).json({
        status: "success",
        message: "Record Updated successfully.!",
        details: req.body.new_book, books: books
    });
});

/**
 * function to check book is exists
 * @param {String} book
 * @returns {Boolean}
 */
function isBookExist(book) {
    return books.includes(book);
}

/**
 * @api {get} /api/book Get Book
 * @apiName GetBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 */
router.get('/', function (req, res, next) {
    let output = getBookList(books);
    res.json({status: "success", books: output});
});

/**
 * function to get Book list
 * @param {object} list
 * @param {int} index
 * @param {type} callback
 */
function getBookList(list, index = - 1, callback) {
    if (list.length <= 0) {
        return list;
    }
    index++;
    let output = list[index];
    if (index <= list.length - 1) {
        return output + "|" + getBookList(list, index, callback);
}
}

/**
 * @api {put} /api/book Put Book
 * @apiName GetBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 */
router.put('/', function (req, res, next) {
    let pushArr = [];
    let finalArr = {};
    books.forEach((book) => {
        pushArr.push((next) => {
            let interval = setInterval(() => {
                saveItemOnDatabase(book, (err, result) => {
                    if (err) {
                        next(err);
                    }
                    finalArr[book] = book.length;
                    next(null, book);
                });
                clearInterval(interval);
            }, Math.random() + book.length);
        });
    });
    async.parallel(pushArr, (error, response) => {
        if (error) {
            return res.json({status: "error", error: error});
        } else {
            return res.json({status: "success", books: finalArr});
        }
    });
});

/**
 * function to save item in Database
 * @param {String} name
 * @param {type} callback
 * @returns {callback}
 */
function saveItemOnDatabase(name, callback) {
    let data = {};
    data[name] = name.length;
    let path = __dirname + "/../public/books/";
    fs.writeFile(`${path + name}.json`, JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("err : ", err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

module.exports = router;