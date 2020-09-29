const bookController = require('../routes/book');

const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Books API', function () {
    
    var books = ["1984", "A Christmas Carol", "Moby Dick", "The Hitchhiker’s Guide to the Galaxy", "The Lord of the Rings"];
    
    describe('/POST - Add New Book', () => {
        it('it should Add all the books', (done) => {
            for (book in books) {
                chai.request(server).post('/api/book').send({book:books[book]}).end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.status("success");
                    //console.log("Response Body:", res.body);
                });
            }
            done();
        });
        
        it('it should throw an error with invalid payload on add book', (done) => {
            chai.request(server).post('/api/book').send({books:"A Christmas Carol"}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done(); 
            });
        });
    });
    
    describe('/DELETE - Delete book', () => {
        it('it should delete the book', (done) => {
            chai.request(server).delete('/api/book/Moby Dick').end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
        
        it('it should avoid deleting the Non-existing book', (done) => {
            chai.request(server).delete('/api/book/MobyDick').end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });
    
    describe('/PATCH - Update book', () => {
        it('it should update the book', (done) => {
            chai.request(server).patch('/api/book').send({original_book : "1984",new_book : "Year 1984"}).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
        
        it('it should throw an error on updating non-existing book', (done) => {
            chai.request(server).patch('/api/book').send({original_book : "1984",new_book : "Year 1984"}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done();
            });
        });
        
        it('it should throw an error on updating book with Invalid payload', (done) => {
            chai.request(server).patch('/api/book').send({book : "1984",new_book : "Year 1984"}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });
    
    describe('/GET - Get All books', () => {
        it('it should GET all the books', (done) => {
            chai.request(server).get('/api/book').end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });
    
    describe('/PUT - Add All books in DB', () => {
        it('it should Create Book in DB', (done) => {
            chai.request(server).put('/api/book').end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });

});